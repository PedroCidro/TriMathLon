import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const supabase = getSupabaseAdmin();

        // Get all groups the user is a member of
        const { data: memberships, error: memErr } = await supabase
            .from('group_members')
            .select('group_id, role')
            .eq('user_id', userId);

        if (memErr) {
            console.error('Failed to fetch memberships:', memErr.message);
            return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
        }

        if (!memberships || memberships.length === 0) {
            return NextResponse.json({ groups: [] });
        }

        const groupIds = memberships.map(m => m.group_id);
        const roleMap = new Map(memberships.map(m => [m.group_id, m.role]));

        // Fetch group details
        const { data: groups } = await supabase
            .from('groups')
            .select('id, name, invite_code, created_at')
            .in('id', groupIds);

        // Fetch member counts
        const { data: memberCounts } = await supabase
            .from('group_members')
            .select('group_id')
            .in('group_id', groupIds);

        const countMap = new Map<string, number>();
        for (const mc of memberCounts ?? []) {
            countMap.set(mc.group_id, (countMap.get(mc.group_id) ?? 0) + 1);
        }

        // Fetch active competition counts
        const { data: activeComps } = await supabase
            .from('group_competitions')
            .select('group_id')
            .in('group_id', groupIds)
            .eq('status', 'active');

        const activeCompMap = new Map<string, number>();
        for (const ac of activeComps ?? []) {
            activeCompMap.set(ac.group_id, (activeCompMap.get(ac.group_id) ?? 0) + 1);
        }

        const result = (groups ?? []).map(g => ({
            id: g.id,
            name: g.name,
            invite_code: g.invite_code,
            role: roleMap.get(g.id) ?? 'member',
            member_count: countMap.get(g.id) ?? 0,
            active_competitions: activeCompMap.get(g.id) ?? 0,
            created_at: g.created_at,
        }));

        return NextResponse.json({ groups: result });
    } catch (err) {
        console.error('List groups error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
