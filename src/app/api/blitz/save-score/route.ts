import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

const VALID_MODULES = ['derivadas', 'integrais', 'edos'];
const MAX_STRIKES = 3;
const GAME_DURATION: Record<string, number> = {
    derivadas: 180,  // 3 minutes
    integrais: 180,  // 3 minutes
    edos: 600,       // 10 minutes
};
const MAX_SCORE_PER_SECOND = 1; // at most 1 correct answer per second

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'blitz');
        if (limited) return limited;

        const body = await request.json();
        const { module_id, score, strikes, duration_seconds } = body;

        if (!module_id || !VALID_MODULES.includes(module_id)) {
            return NextResponse.json({ error: 'Invalid module_id' }, { status: 400 });
        }
        if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }
        if (typeof strikes !== 'number' || !Number.isInteger(strikes) || strikes < 0 || strikes > MAX_STRIKES) {
            return NextResponse.json({ error: 'Invalid strikes' }, { status: 400 });
        }
        const maxDuration = GAME_DURATION[module_id] ?? 180;
        if (typeof duration_seconds !== 'number' || !Number.isInteger(duration_seconds) || duration_seconds < 1 || duration_seconds > maxDuration + 5) {
            return NextResponse.json({ error: 'Invalid duration_seconds' }, { status: 400 });
        }

        // Sanity: score can't exceed what's physically possible in the elapsed time
        const maxPossibleScore = Math.ceil(duration_seconds * MAX_SCORE_PER_SECOND);
        if (score > maxPossibleScore) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }

        const { data, error } = await getSupabaseAdmin().rpc('save_blitz_score', {
            p_user_id: userId,
            p_module_id: module_id,
            p_score: score,
            p_strikes: strikes,
            p_duration_seconds: duration_seconds,
        });

        if (error) {
            console.error('Failed to save blitz score:', error.message);
            return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
        }

        // Fire-and-forget activity log for group competitions
        const logRows: { user_id: string; mode: string; subcategory: string; correct: boolean }[] = [];
        for (let i = 0; i < score; i++) logRows.push({ user_id: userId, mode: 'blitz', subcategory: module_id, correct: true });
        for (let i = 0; i < strikes; i++) logRows.push({ user_id: userId, mode: 'blitz', subcategory: module_id, correct: false });
        if (logRows.length > 0) {
            getSupabaseAdmin().from('activity_log').insert(logRows)
                .then(({ error: logErr }) => { if (logErr) console.error('Failed to log blitz activity:', logErr.message); });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Save blitz score error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
