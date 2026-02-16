import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { ALL_MODULE_IDS, topicIdsForModules } from '@/lib/curriculum-utils';

type RouteParams = { params: Promise<{ groupId: string; competitionId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const { groupId, competitionId } = await params;
        const supabase = getSupabaseAdmin();

        // Verify membership
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (!membership) {
            return NextResponse.json({ error: 'Not a member' }, { status: 403 });
        }

        // Fetch competition
        const { data: comp, error: compErr } = await supabase
            .from('group_competitions')
            .select('*')
            .eq('id', competitionId)
            .eq('group_id', groupId)
            .single();

        if (compErr || !comp) {
            return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
        }

        // Lazy finalization
        const now = new Date().toISOString();
        if (comp.status === 'active' && comp.ends_at < now) {
            await supabase
                .from('group_competitions')
                .update({ status: 'finished' })
                .eq('id', competitionId);
            comp.status = 'finished';
        }

        // Fetch group member IDs
        const { data: members } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);

        const memberUserIds = (members ?? []).map((m: { user_id: string }) => m.user_id);

        // Build subcategory filter
        let subcategoryFilter: string[] | null = null;
        if (comp.topic_ids && comp.topic_ids.length > 0) {
            subcategoryFilter = [...comp.topic_ids];
            if (comp.module_ids && comp.module_ids.length > 0) {
                subcategoryFilter.push(...comp.module_ids);
            } else {
                for (const mid of ALL_MODULE_IDS) {
                    const expanded = topicIdsForModules([mid]);
                    if (comp.topic_ids.some((t: string) => expanded.includes(t))) {
                        subcategoryFilter.push(mid);
                    }
                }
            }
        }

        let query = supabase
            .from('activity_log')
            .select('user_id, correct')
            .in('user_id', memberUserIds)
            .gte('created_at', comp.starts_at)
            .lte('created_at', comp.ends_at);

        if (subcategoryFilter) {
            query = query.in('subcategory', subcategoryFilter);
        }

        const { data: activity } = await query;

        // Aggregate per user
        const stats = new Map<string, { solved: number; correct: number }>();
        for (const uid of memberUserIds) {
            stats.set(uid, { solved: 0, correct: 0 });
        }
        for (const row of activity ?? []) {
            const s = stats.get(row.user_id);
            if (s) {
                s.solved++;
                if (row.correct) s.correct++;
            }
        }

        // Get profile info
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, current_streak, last_active_date')
            .in('id', memberUserIds);

        const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string; current_streak: number; last_active_date: string }) => [p.id, p]));

        const leaderboard = memberUserIds.map((uid: string) => {
            const s = stats.get(uid) ?? { solved: 0, correct: 0 };
            const profile = profileMap.get(uid);
            return {
                user_id: uid,
                name: profile?.full_name ?? null,
                solved: s.solved,
                accuracy: s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0,
                current_streak: profile?.current_streak ?? 0,
                last_active_date: profile?.last_active_date ?? null,
            };
        });

        leaderboard.sort((a: { solved: number }, b: { solved: number }) => b.solved - a.solved);

        return NextResponse.json({
            competition: {
                id: comp.id,
                title: comp.title,
                module_ids: comp.module_ids,
                topic_ids: comp.topic_ids,
                starts_at: comp.starts_at,
                ends_at: comp.ends_at,
                status: comp.status,
            },
            leaderboard,
        });
    } catch (err) {
        console.error('Leaderboard error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
