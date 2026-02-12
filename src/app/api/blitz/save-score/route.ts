import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const VALID_MODULES = ['derivadas', 'integrais', 'edos'];

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { module_id, score, strikes, duration_seconds } = body;

        if (!module_id || !VALID_MODULES.includes(module_id)) {
            return NextResponse.json({ error: 'Invalid module_id' }, { status: 400 });
        }
        if (typeof score !== 'number' || score < 0) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }
        if (typeof strikes !== 'number' || strikes < 0) {
            return NextResponse.json({ error: 'Invalid strikes' }, { status: 400 });
        }
        if (typeof duration_seconds !== 'number' || duration_seconds < 0) {
            return NextResponse.json({ error: 'Invalid duration_seconds' }, { status: 400 });
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

        return NextResponse.json(data);
    } catch (err) {
        console.error('Save blitz score error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
