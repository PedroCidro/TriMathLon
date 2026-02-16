import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

type RouteParams = { params: Promise<{ groupId: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const { groupId } = await params;
        const supabase = getSupabaseAdmin();

        // Verify membership and that user is not admin
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (!membership) {
            return NextResponse.json({ error: 'Not a member' }, { status: 404 });
        }

        if (membership.role === 'admin') {
            return NextResponse.json({ error: 'Admin cannot leave. Delete the group instead.' }, { status: 400 });
        }

        const { error: deleteErr } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId);

        if (deleteErr) {
            console.error('Failed to leave group:', deleteErr.message);
            return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Leave group error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
