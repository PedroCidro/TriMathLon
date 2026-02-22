import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challengeGameplay');
        if (limited) return limited;

        const { searchParams } = new URL(request.url);
        const challengeId = searchParams.get('challenge_id');

        if (!challengeId) {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        const { data: challenge, error } = await supabase
            .from('challenges')
            .select(`
                status, game_started_at, game_duration_seconds,
                creator_id, creator_score, creator_strikes, creator_current_index, creator_finished,
                opponent_id, opponent_score, opponent_strikes, opponent_current_index, opponent_finished,
                expires_at, rematch_challenge_id
            `)
            .eq('id', challengeId)
            .single();

        if (error || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Only participants can poll
        if (challenge.creator_id !== userId && challenge.opponent_id !== userId) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // Check if expired
        if (challenge.status === 'waiting' && new Date(challenge.expires_at) < new Date()) {
            await supabase.from('challenges').update({ status: 'expired' }).eq('id', challengeId);
            return NextResponse.json({ status: 'expired' });
        }

        // Check if game time expired (server-side timer check)
        if (challenge.status === 'playing' && challenge.game_started_at) {
            const elapsed = (Date.now() - new Date(challenge.game_started_at).getTime()) / 1000;
            if (elapsed > challenge.game_duration_seconds + 10) { // 10s grace
                // Force finish if both haven't already
                if (!challenge.creator_finished || !challenge.opponent_finished) {
                    await supabase.from('challenges').update({
                        status: 'finished',
                        creator_finished: true,
                        opponent_finished: true,
                    }).eq('id', challengeId);
                }
                challenge.status = 'finished';
                challenge.creator_finished = true;
                challenge.opponent_finished = true;
            }
        }

        const isCreator = challenge.creator_id === userId;

        // Fetch rematch status if rematch exists
        let rematchStatus: string | null = null;
        if (challenge.rematch_challenge_id) {
            const { data: rematch } = await supabase
                .from('challenges')
                .select('status, creator_id')
                .eq('id', challenge.rematch_challenge_id)
                .single();
            if (rematch) {
                rematchStatus = rematch.status;
            }
        }

        return NextResponse.json({
            status: challenge.status,
            game_started_at: challenge.game_started_at,
            game_duration_seconds: challenge.game_duration_seconds,
            my_score: isCreator ? challenge.creator_score : challenge.opponent_score,
            my_strikes: isCreator ? challenge.creator_strikes : challenge.opponent_strikes,
            my_current_index: isCreator ? challenge.creator_current_index : challenge.opponent_current_index,
            my_finished: isCreator ? challenge.creator_finished : challenge.opponent_finished,
            opponent_score: isCreator ? challenge.opponent_score : challenge.creator_score,
            opponent_strikes: isCreator ? challenge.opponent_strikes : challenge.creator_strikes,
            opponent_current_index: isCreator ? challenge.opponent_current_index : challenge.creator_current_index,
            opponent_finished: isCreator ? challenge.opponent_finished : challenge.creator_finished,
            rematch_challenge_id: challenge.rematch_challenge_id,
            rematch_status: rematchStatus,
        });
    } catch (err) {
        console.error('Poll challenge error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
