import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { curriculum } from '@/data/curriculum';

const ONE_HOUR_MS = 60 * 60 * 1000;

type Context = { params: Promise<{ challengeId: string }> };

export async function GET(request: Request, context: Context) {
    try {
        // Rate limit by IP since this is a public endpoint
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
        const limited = rateLimit(ip, 'public');
        if (limited) return limited;

        const { challengeId } = await context.params;

        if (!challengeId) {
            return NextResponse.json({ error: 'challengeId is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        const { data: challenge, error } = await supabase
            .from('challenges')
            .select('id, creator_id, opponent_id, status, module_id, topic_ids, expires_at, created_at, type, game_started_at')
            .eq('id', challengeId)
            .single();

        if (error || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        const isPublic = challenge.type === 'public';

        // Stale cleanup for public challenges stuck in 'playing'
        if (isPublic && challenge.status === 'playing' && challenge.game_started_at) {
            const elapsed = Date.now() - new Date(challenge.game_started_at).getTime();
            if (elapsed > ONE_HOUR_MS) {
                await supabase.from('challenges').update({ status: 'expired' }).eq('id', challengeId);
                return NextResponse.json({ error: 'Challenge has expired' }, { status: 410 });
            }
        }

        // Check if expired (duel expiry)
        if (challenge.status === 'waiting' && new Date(challenge.expires_at) < new Date()) {
            await supabase.from('challenges').update({ status: 'expired' }).eq('id', challengeId);
            return NextResponse.json({ error: 'Challenge has expired' }, { status: 410 });
        }

        // Fetch creator's name
        const { data: creator } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', challenge.creator_id)
            .single();

        // Resolve module and topic names from curriculum
        const moduleData = curriculum.find(m => m.id === challenge.module_id);

        const baseResponse = {
            id: challenge.id,
            status: challenge.status,
            type: challenge.type ?? 'duel',
            module_id: challenge.module_id,
            module_title: moduleData?.title ?? challenge.module_id,
            topic_count: challenge.topic_ids.length,
            creator_name: creator?.full_name ?? null,
            has_opponent: !!challenge.opponent_id,
            created_at: challenge.created_at,
        };

        // For public challenges, also return leaderboard
        if (isPublic) {
            const { data: attempts } = await supabase
                .from('challenge_attempts')
                .select('user_id, score, strikes, finished_at')
                .eq('challenge_id', challengeId)
                .order('score', { ascending: false })
                .order('finished_at', { ascending: true })
                .limit(20);

            const userIds = (attempts ?? []).map(a => a.user_id);
            let nameMap = new Map<string, string | null>();
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds);
                nameMap = new Map((profiles ?? []).map(p => [p.id, p.full_name]));
            }

            const leaderboard = (attempts ?? []).map((entry, index) => ({
                rank: index + 1,
                user_id: entry.user_id,
                name: nameMap.get(entry.user_id) ?? null,
                score: entry.score,
                strikes: entry.strikes,
                is_creator: entry.user_id === challenge.creator_id,
            }));

            const { count } = await supabase
                .from('challenge_attempts')
                .select('*', { count: 'exact', head: true })
                .eq('challenge_id', challengeId);

            return NextResponse.json({
                ...baseResponse,
                leaderboard,
                attempt_count: count ?? leaderboard.length,
            });
        }

        return NextResponse.json(baseResponse);
    } catch (err) {
        console.error('Public challenge info error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
