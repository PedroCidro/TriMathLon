import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challenge');
        if (limited) return limited;

        const { searchParams } = new URL(request.url);
        const challengeId = searchParams.get('challenge_id');

        if (!challengeId) {
            return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Fetch challenge
        const { data: challenge, error: fetchErr } = await supabase
            .from('challenges')
            .select('creator_id, opponent_id, status, question_ids')
            .eq('id', challengeId)
            .single();

        if (fetchErr || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Only participants
        if (challenge.creator_id !== userId && challenge.opponent_id !== userId) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // Only serve questions when status >= ready (not 'waiting')
        if (challenge.status === 'waiting') {
            return NextResponse.json({ error: 'Challenge not ready yet' }, { status: 400 });
        }

        // Fetch full question data in seeded order
        const { data: questions, error: qErr } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, distractors, difficulty')
            .in('id', challenge.question_ids);

        if (qErr) {
            console.error('Failed to fetch challenge questions:', qErr.message);
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
        }

        // Re-order to match seeded order
        const questionMap = new Map(questions?.map(q => [q.id, q]) ?? []);
        const ordered = challenge.question_ids
            .map((id: string) => questionMap.get(id))
            .filter(Boolean);

        return NextResponse.json({ questions: ordered });
    } catch (err) {
        console.error('Challenge questions error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
