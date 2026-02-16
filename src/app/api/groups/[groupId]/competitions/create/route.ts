import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';
import { ALL_MODULE_IDS, topicIdsForModules } from '@/lib/curriculum-utils';

const MAX_ACTIVE_COMPETITIONS = 5;
const MAX_DURATION_DAYS = 30;

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
        const { title, module_ids, topic_ids, ends_at } = body;

        // Validate ends_at
        if (!ends_at || typeof ends_at !== 'string') {
            return NextResponse.json({ error: 'ends_at is required' }, { status: 400 });
        }

        const endsAtDate = new Date(ends_at);
        const now = new Date();
        if (isNaN(endsAtDate.getTime()) || endsAtDate <= now) {
            return NextResponse.json({ error: 'ends_at must be in the future' }, { status: 400 });
        }

        const diffDays = (endsAtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > MAX_DURATION_DAYS) {
            return NextResponse.json({ error: `Max duration is ${MAX_DURATION_DAYS} days` }, { status: 400 });
        }

        // Validate title
        if (title && (typeof title !== 'string' || title.trim().length > 100)) {
            return NextResponse.json({ error: 'Title must be under 100 chars' }, { status: 400 });
        }

        // Validate module_ids
        if (module_ids) {
            if (!Array.isArray(module_ids) || module_ids.some((id: string) => !ALL_MODULE_IDS.has(id))) {
                return NextResponse.json({ error: 'Invalid module_ids' }, { status: 400 });
            }
        }

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

        // Check active competition count
        const { count } = await supabase
            .from('group_competitions')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', groupId)
            .eq('status', 'active');

        if ((count ?? 0) >= MAX_ACTIVE_COMPETITIONS) {
            return NextResponse.json({ error: 'Maximum active competitions reached' }, { status: 400 });
        }

        // Expand module_ids to topic_ids if needed
        let finalTopicIds: string[] | null = topic_ids ?? null;
        const finalModuleIds: string[] | null = module_ids ?? null;

        if (finalModuleIds && finalModuleIds.length > 0 && !finalTopicIds) {
            finalTopicIds = topicIdsForModules(finalModuleIds);
        }

        const competitionId = nanoid(12);

        const { error: insertErr } = await supabase.from('group_competitions').insert({
            id: competitionId,
            group_id: groupId,
            created_by: userId,
            title: title?.trim() || null,
            module_ids: finalModuleIds,
            topic_ids: finalTopicIds,
            ends_at: endsAtDate.toISOString(),
        });

        if (insertErr) {
            console.error('Failed to create competition:', insertErr.message);
            return NextResponse.json({ error: 'Failed to create competition' }, { status: 500 });
        }

        return NextResponse.json({ competition_id: competitionId });
    } catch (err) {
        console.error('Create competition error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
