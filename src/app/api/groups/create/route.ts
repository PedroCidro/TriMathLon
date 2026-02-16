import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';

const MAX_GROUPS_PER_USER = 10;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const body = await request.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 50) {
            return NextResponse.json({ error: 'Name is required (max 50 chars)' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Check how many groups the user has created
        const { count } = await supabase
            .from('groups')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', userId);

        if ((count ?? 0) >= MAX_GROUPS_PER_USER) {
            return NextResponse.json({ error: 'Maximum groups reached' }, { status: 400 });
        }

        const groupId = nanoid(12);
        const inviteCode = nanoid(8);

        const { error: insertErr } = await supabase.from('groups').insert({
            id: groupId,
            name: name.trim(),
            creator_id: userId,
            invite_code: inviteCode,
        });

        if (insertErr) {
            console.error('Failed to create group:', insertErr.message);
            return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
        }

        // Add creator as admin member
        await supabase.from('group_members').insert({
            group_id: groupId,
            user_id: userId,
            role: 'admin',
        });

        return NextResponse.json({ group_id: groupId, invite_code: inviteCode });
    } catch (err) {
        console.error('Create group error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
