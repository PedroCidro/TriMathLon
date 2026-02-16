import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

const MAX_MEMBERS = 50;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const body = await request.json();
        const { invite_code } = body;

        if (!invite_code || typeof invite_code !== 'string') {
            return NextResponse.json({ error: 'invite_code is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Find group by invite code
        const { data: group, error: fetchErr } = await supabase
            .from('groups')
            .select('id')
            .eq('invite_code', invite_code)
            .single();

        if (fetchErr || !group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Check if already a member
        const { data: existing } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', group.id)
            .eq('user_id', userId)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Already a member', group_id: group.id }, { status: 409 });
        }

        // Check member count
        const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

        if ((count ?? 0) >= MAX_MEMBERS) {
            return NextResponse.json({ error: 'Group is full' }, { status: 400 });
        }

        const { error: insertErr } = await supabase.from('group_members').insert({
            group_id: group.id,
            user_id: userId,
            role: 'member',
        });

        if (insertErr) {
            if (insertErr.code === '23505') {
                return NextResponse.json({ error: 'Already a member', group_id: group.id }, { status: 409 });
            }
            console.error('Failed to join group:', insertErr.message);
            return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
        }

        return NextResponse.json({ group_id: group.id });
    } catch (err) {
        console.error('Join group error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
