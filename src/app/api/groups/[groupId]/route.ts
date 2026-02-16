import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { ALL_MODULE_IDS, topicIdsForModules } from '@/lib/curriculum-utils';

type RouteParams = { params: Promise<{ groupId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const { groupId } = await params;
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

        // Fetch group
        const { data: group, error: groupErr } = await supabase
            .from('groups')
            .select('id, name, creator_id, invite_code, created_at')
            .eq('id', groupId)
            .single();

        if (groupErr || !group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Fetch members with profiles
        const { data: members } = await supabase
            .from('group_members')
            .select('user_id, role, joined_at')
            .eq('group_id', groupId);

        const memberUserIds = (members ?? []).map(m => m.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', memberUserIds);

        const nameMap = new Map((profiles ?? []).map(p => [p.id, p.full_name]));
        const membersWithNames = (members ?? []).map(m => ({
            user_id: m.user_id,
            name: nameMap.get(m.user_id) ?? null,
            role: m.role,
            joined_at: m.joined_at,
        }));

        // Fetch competitions — lazy-finalize any past deadline
        const { data: competitions } = await supabase
            .from('group_competitions')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });

        const now = new Date().toISOString();
        const activeComps = [];
        const pastComps = [];

        for (const comp of competitions ?? []) {
            if (comp.status === 'active' && comp.ends_at < now) {
                // Lazy finalize
                await supabase
                    .from('group_competitions')
                    .update({ status: 'finished' })
                    .eq('id', comp.id);
                comp.status = 'finished';
            }
            if (comp.status === 'active') {
                activeComps.push(comp);
            } else {
                pastComps.push(comp);
            }
        }

        // Compute leaderboards for active competitions
        const activeWithLeaderboards = await Promise.all(
            activeComps.map(async (comp) => {
                const leaderboard = await computeLeaderboard(supabase, comp, memberUserIds);
                return { ...comp, leaderboard };
            })
        );

        return NextResponse.json({
            group: {
                ...group,
                your_role: membership.role,
            },
            members: membersWithNames,
            active_competitions: activeWithLeaderboards,
            past_competitions: pastComps.map(c => ({
                id: c.id,
                title: c.title,
                module_ids: c.module_ids,
                topic_ids: c.topic_ids,
                starts_at: c.starts_at,
                ends_at: c.ends_at,
                status: c.status,
            })),
        });
    } catch (err) {
        console.error('Get group error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const { groupId } = await params;
        const supabase = getSupabaseAdmin();

        // Verify creator
        const { data: group } = await supabase
            .from('groups')
            .select('creator_id')
            .eq('id', groupId)
            .single();

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        if (group.creator_id !== userId) {
            return NextResponse.json({ error: 'Only the creator can delete the group' }, { status: 403 });
        }

        const { error: deleteErr } = await supabase
            .from('groups')
            .delete()
            .eq('id', groupId);

        if (deleteErr) {
            console.error('Failed to delete group:', deleteErr.message);
            return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Delete group error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

type ProfileInfo = { id: string; full_name: string; current_streak: number; last_active_date: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function computeLeaderboard(supabase: any, comp: any, memberUserIds: string[]) {
    // Build subcategory filter
    let subcategoryFilter: string[] | null = null;
    if (comp.topic_ids && comp.topic_ids.length > 0) {
        subcategoryFilter = [...comp.topic_ids];
        // Also include parent module IDs for blitz/challenge entries
        if (comp.module_ids && comp.module_ids.length > 0) {
            subcategoryFilter.push(...comp.module_ids);
        } else {
            // Derive module IDs from topic_ids
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

    const profileMap = new Map<string, ProfileInfo>((profiles ?? []).map((p: ProfileInfo) => [p.id, p]));

    const leaderboard = memberUserIds.map(uid => {
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
    return leaderboard;
}
