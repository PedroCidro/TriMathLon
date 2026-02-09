import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const VALID_RATINGS = ['wrong', 'hard', 'good', 'easy'] as const;
const XP_MAP: Record<string, number> = {
    Easy: 10,
    Medium: 20,
    Hard: 30,
};

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { subcategory, self_rating, difficulty } = body;

        if (!subcategory || typeof subcategory !== 'string') {
            return NextResponse.json({ error: 'subcategory is required' }, { status: 400 });
        }
        if (!VALID_RATINGS.includes(self_rating)) {
            return NextResponse.json({ error: 'Invalid self_rating' }, { status: 400 });
        }

        const xpAmount = XP_MAP[difficulty] || 20;

        const { data, error } = await getSupabaseAdmin().rpc('complete_exercise', {
            p_user_id: userId,
            p_subcategory: subcategory,
            p_self_rating: self_rating,
            p_xp_amount: xpAmount,
        });

        if (error) {
            console.error('Failed to complete exercise:', error.message);
            return NextResponse.json({ error: 'Failed to complete exercise' }, { status: 500 });
        }

        return NextResponse.json({ ...data, xp_earned: xpAmount });
    } catch (err) {
        console.error('Complete exercise error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
