import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

type RouteParams = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'groups');
        if (limited) return limited;

        const { groupId } = await params;
        const body = await request.json();
        const { user_id: targetUserId } = body;

        if (!targetUserId || typeof targetUserId !== 'string') {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Verify caller is admin
        const { data: callerMembership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (!callerMembership || callerMembership.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 });
        }

        // Can't remove yourself (use delete group instead)
        if (targetUserId === userId) {
            return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
        }

        const { error: deleteErr } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', targetUserId);

        if (deleteErr) {
            console.error('Failed to remove member:', deleteErr.message);
            return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Remove member error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
