import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challenge');
        if (limited) return limited;

        const { searchParams } = new URL(request.url);
        const challengeId = searchParams.get('challenge_id');

        if (!challengeId) {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Fetch challenge
        const { data: challenge, error: fetchErr } = await supabase
            .from('challenges')
            .select('creator_id, opponent_id, status, question_ids, type, game_started_at')
            .eq('id', challengeId)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        const isPublic = challenge.type === 'public';

        if (isPublic) {
            // Stale cleanup: if public + playing + game_started_at > 1 hour ago, auto-expire
            if (challenge.status === 'playing' && challenge.game_started_at) {
                const elapsed = Date.now() - new Date(challenge.game_started_at).getTime();
                if (elapsed > ONE_HOUR_MS) {
                    await supabase.from('challenges').update({ status: 'expired' }).eq('id', challengeId);
                    return NextResponse.json({ error: 'Challenge has expired' }, { status: 410 });
                }
            }

            // Public challenges: allow when status is 'playing' or 'open'
            if (challenge.status !== 'playing' && challenge.status !== 'open') {
                return NextResponse.json({ error: 'Challenge is not available' }, { status: 400 });
            }

            // For 'open' status: check user hasn't already played
            if (challenge.status === 'open') {
                const { data: existing } = await supabase
                    .from('challenge_attempts')
                    .select('id')
                    .eq('challenge_id', challengeId)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (existing) {
                    return NextResponse.json({ error: 'You have already played this challenge' }, { status: 409 });
                }
            }
        } else {
            // Duel: only participants
            if (challenge.creator_id !== userId && challenge.opponent_id !== userId) {
                return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
            }

            // Only serve questions when status >= ready (not 'waiting')
            if (challenge.status === 'waiting') {
                return NextResponse.json({ error: 'Challenge not ready yet' }, { status: 400 });
            }
        }

        // Fetch full question data in seeded order
        const { data: questions, error: qErr } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, distractors, difficulty')
            .in('id', challenge.question_ids);

        if (qErr) {
            console.error('Failed to fetch challenge questions:', qErr.message);
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
        }

        // Re-order to match seeded order
        const questionMap = new Map(questions?.map(q => [q.id, q]) ?? []);
        const ordered = challenge.question_ids
            .map((id: string) => questionMap.get(id))
            .filter(Boolean);

        return NextResponse.json({ questions: ordered });
    } catch (err) {
        console.error('Challenge questions error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
