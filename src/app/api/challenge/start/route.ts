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
            .select('id, creator_id, opponent_id, status')
            .eq('id', challenge_id)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Only participants can start
        if (challenge.creator_id !== userId && challenge.opponent_id !== userId) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // Must be in ready status
        if (challenge.status !== 'ready') {
            if (challenge.status === 'playing') {
                // Already started — just return success so both clients proceed
                return NextResponse.json({ success: true, already_started: true });
            }
            return NextResponse.json({ error: `Cannot start challenge in status: ${challenge.status}` }, { status: 400 });
        }

        const { error: updateErr } = await supabase
            .from('challenges')
            .update({
                status: 'playing',
                game_started_at: new Date().toISOString(),
            })
            .eq('id', challenge_id)
            .eq('status', 'ready'); // Optimistic lock

        if (updateErr) {
            console.error('Failed to start challenge:', updateErr.message);
            return NextResponse.json({ error: 'Failed to start challenge' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Start challenge error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
