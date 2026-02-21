import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { MAX_STRIKES } from '@/lib/blitz-constants';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challenge');
        if (limited) return limited;

        const body = await request.json();
        const { challenge_id, score, strikes } = body;

        if (!challenge_id || typeof challenge_id !== 'string') {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }
        if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }
        if (typeof strikes !== 'number' || !Number.isInteger(strikes) || strikes < 0 || strikes > MAX_STRIKES) {
            return NextResponse.json({ error: 'Invalid strikes' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Fetch challenge
        const { data: challenge, error: fetchErr } = await supabase
            .from('challenges')
            .select('id, creator_id, status, type, module_id')
            .eq('id', challenge_id)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        if (challenge.type !== 'public') {
            return NextResponse.json({ error: 'Not a public challenge' }, { status: 400 });
        }

        if (challenge.status !== 'playing' && challenge.status !== 'open') {
            return NextResponse.json({ error: 'Challenge is not accepting attempts' }, { status: 400 });
        }

        // Insert attempt (UNIQUE constraint will reject duplicates)
        const { error: insertErr } = await supabase
            .from('challenge_attempts')
            .insert({
                challenge_id,
                user_id: userId,
                score,
                strikes,
            });

        if (insertErr) {
            if (insertErr.code === '23505') {
                // Unique violation — user already played
                return NextResponse.json({ error: 'You have already played this challenge' }, { status: 409 });
            }
            console.error('Failed to save attempt:', insertErr.message);
            return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
        }

        // If this is the creator's attempt: transition status playing → open
        if (challenge.status === 'playing' && challenge.creator_id === userId) {
            await supabase
                .from('challenges')
                .update({ status: 'open', creator_finished: true })
                .eq('id', challenge_id);
        }

        // Fetch leaderboard (top 20)
        const { data: leaderboard } = await supabase
            .from('challenge_attempts')
            .select('user_id, score, strikes, finished_at')
            .eq('challenge_id', challenge_id)
            .order('score', { ascending: false })
            .order('finished_at', { ascending: true })
            .limit(20);

        // Resolve user names
        const userIds = (leaderboard ?? []).map(a => a.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

        const nameMap = new Map((profiles ?? []).map(p => [p.id, p.full_name]));

        const leaderboardWithNames = (leaderboard ?? []).map((entry, index) => ({
            rank: index + 1,
            user_id: entry.user_id,
            name: nameMap.get(entry.user_id) ?? null,
            score: entry.score,
            strikes: entry.strikes,
            is_you: entry.user_id === userId,
        }));

        // Get total attempt count
        const { count } = await supabase
            .from('challenge_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('challenge_id', challenge_id);

        // Fire-and-forget: credit exercises and XP to profile
        if (score > 0) {
            getSupabaseAdmin().rpc('credit_competitive_exercises', {
                p_user_id: userId,
                p_correct_count: score,
            }).then(({ error: creditErr }) => {
                if (creditErr) console.error('Failed to credit challenge exercises:', creditErr.message);
            });
        }

        // Fire-and-forget activity log for group competitions
        const logRows: { user_id: string; mode: string; subcategory: string; correct: boolean }[] = [];
        for (let i = 0; i < score; i++) logRows.push({ user_id: userId, mode: 'challenge', subcategory: challenge.module_id, correct: true });
        for (let i = 0; i < strikes; i++) logRows.push({ user_id: userId, mode: 'challenge', subcategory: challenge.module_id, correct: false });
        if (logRows.length > 0) {
            getSupabaseAdmin().from('activity_log').insert(logRows)
                .then(({ error: logErr }) => { if (logErr) console.error('Failed to log challenge activity:', logErr.message); });
        }

        return NextResponse.json({
            success: true,
            leaderboard: leaderboardWithNames,
            attempt_count: count ?? leaderboardWithNames.length,
        });
    } catch (err) {
        console.error('Save attempt error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
