import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

type RouteParams = { params: Promise<{ inviteCode: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { inviteCode } = await params;

        // Rate limit by IP for public endpoint
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
        const limited = rateLimit(ip, 'public');
        if (limited) return limited;

        const supabase = getSupabaseAdmin();

        const { data: group, error } = await supabase
            .from('groups')
            .select('id, name, creator_id')
            .eq('invite_code', inviteCode)
            .single();

        if (error || !group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Get member count
        const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

        // Get creator name
        const { data: creator } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', group.creator_id)
            .single();

        return NextResponse.json({
            group_id: group.id,
            name: group.name,
            member_count: count ?? 0,
            creator_name: creator?.full_name ?? null,
        });
    } catch (err) {
        console.error('Public group info error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
