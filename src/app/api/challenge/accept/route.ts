import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challenge');
        if (limited) return limited;

        const body = await request.json();
        const { challenge_id } = body;

        if (!challenge_id || typeof challenge_id !== 'string') {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Fetch challenge
        const { data: challenge, error: fetchErr } = await supabase
            .from('challenges')
            .select('id, creator_id, status, expires_at, module_id')
            .eq('id', challenge_id)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Self-challenge prevention
        if (challenge.creator_id === userId) {
            return NextResponse.json({ error: 'Cannot accept your own challenge' }, { status: 400 });
        }

        // Check if expired
        if (new Date(challenge.expires_at) < new Date()) {
            await supabase.from('challenges').update({ status: 'expired' }).eq('id', challenge_id);
            return NextResponse.json({ error: 'Challenge has expired' }, { status: 410 });
        }

        // Only accept if still waiting
        if (challenge.status !== 'waiting') {
            return NextResponse.json({ error: 'Challenge already accepted' }, { status: 409 });
        }

        // Set opponent and status — use .select().single() to verify the update matched a row
        const { data: updated, error: updateErr } = await supabase
            .from('challenges')
            .update({
                opponent_id: userId,
                status: 'ready',
            })
            .eq('id', challenge_id)
            .eq('status', 'waiting') // Optimistic lock
            .select('id')
            .single();

        if (updateErr || !updated) {
            console.error('Failed to accept challenge:', updateErr?.message ?? 'no rows updated');
            return NextResponse.json({ error: 'Challenge already accepted or expired' }, { status: 409 });
        }

        return NextResponse.json({ success: true, module_id: challenge.module_id });
    } catch (err) {
        console.error('Accept challenge error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
