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

        const limited = rateLimit(userId, 'challengeGameplay');
        if (limited) return limited;

        const body = await request.json();
        const { challenge_id, score, strikes, current_index, finished } = body;

        if (!challenge_id || typeof challenge_id !== 'string') {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }
        if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }
        if (typeof strikes !== 'number' || !Number.isInteger(strikes) || strikes < 0 || strikes > MAX_STRIKES) {
            return NextResponse.json({ error: 'Invalid strikes' }, { status: 400 });
        }
        if (typeof current_index !== 'number' || !Number.isInteger(current_index) || current_index < 0) {
            return NextResponse.json({ error: 'Invalid current_index' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Fetch challenge
        const { data: challenge, error: fetchErr } = await supabase
            .from('challenges')
            .select('creator_id, opponent_id, status, question_ids, creator_finished, opponent_finished, module_id')
            .eq('id', challenge_id)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        if (challenge.status !== 'playing' && challenge.status !== 'ready') {
            return NextResponse.json({ error: 'Challenge is not in a startable state' }, { status: 400 });
        }

        const isCreator = challenge.creator_id === userId;
        const isOpponent = challenge.opponent_id === userId;
        if (!isCreator && !isOpponent) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // Validate against question count
        if (current_index > challenge.question_ids.length) {
            return NextResponse.json({ error: 'current_index exceeds question count' }, { status: 400 });
        }
        if (score > current_index) {
            return NextResponse.json({ error: 'score exceeds current_index' }, { status: 400 });
        }

        const prefix = isCreator ? 'creator' : 'opponent';
        const updateData: Record<string, number | boolean> = {
            [`${prefix}_score`]: score,
            [`${prefix}_strikes`]: strikes,
            [`${prefix}_current_index`]: current_index,
        };

        // Auto-start if still in 'ready' status (handles race with /start endpoint)
        if (challenge.status === 'ready') {
            (updateData as Record<string, string | number | boolean>).status = 'playing';
            (updateData as Record<string, string | number | boolean>).game_started_at = new Date().toISOString();
        }

        if (finished) {
            updateData[`${prefix}_finished`] = true;
        }

        // Check if both finished after this update
        const otherFinished = isCreator ? challenge.opponent_finished : challenge.creator_finished;
        if (finished && otherFinished) {
            (updateData as Record<string, string | number | boolean>).status = 'finished';
        }

        const { error: updateErr } = await supabase
            .from('challenges')
            .update(updateData)
            .eq('id', challenge_id);

        if (updateErr) {
            console.error('Failed to update challenge score:', updateErr.message);
            return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
        }

        // Fire-and-forget: credit exercises and XP to profile when player finishes
        if (finished && score > 0) {
            getSupabaseAdmin().rpc('credit_competitive_exercises', {
                p_user_id: userId,
                p_correct_count: score,
            }).then(({ error: creditErr }) => {
                if (creditErr) console.error('Failed to credit challenge exercises:', creditErr.message);
            });
        }

        // Fire-and-forget activity log when a player finishes
        if (finished) {
            const logRows: { user_id: string; mode: string; subcategory: string; correct: boolean }[] = [];
            for (let i = 0; i < score; i++) logRows.push({ user_id: userId, mode: 'challenge', subcategory: challenge.module_id, correct: true });
            for (let i = 0; i < strikes; i++) logRows.push({ user_id: userId, mode: 'challenge', subcategory: challenge.module_id, correct: false });
            if (logRows.length > 0) {
                getSupabaseAdmin().from('activity_log').insert(logRows)
                    .then(({ error: logErr }) => { if (logErr) console.error('Failed to log challenge activity:', logErr.message); });
            }
        }

        return NextResponse.json({ success: true, both_finished: finished && otherFinished });
    } catch (err) {
        console.error('Update score error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
