import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { curriculum } from '@/data/curriculum';

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
            .select('id, creator_id, opponent_id, status, module_id, topic_ids, expires_at, created_at')
            .eq('id', challengeId)
            .single();

        if (error || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Check if expired
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

        return NextResponse.json({
            id: challenge.id,
            status: challenge.status,
            module_id: challenge.module_id,
            module_title: moduleData?.title ?? challenge.module_id,
            topic_count: challenge.topic_ids.length,
            creator_name: creator?.full_name ?? null,
            has_opponent: !!challenge.opponent_id,
            created_at: challenge.created_at,
        });
    } catch (err) {
        console.error('Public challenge info error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
