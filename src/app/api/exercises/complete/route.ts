import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { curriculum } from '@/data/curriculum';

const VALID_RATINGS = ['wrong', 'hard', 'good', 'easy'] as const;
const XP_MAP: Record<string, number> = {
    Easy: 10,
    Medium: 20,
    Hard: 30,
};

// Build a lookup map from subcategory ID → difficulty at startup
const TOPIC_DIFFICULTY = new Map<string, string>();
for (const mod of curriculum) {
    for (const topic of mod.topics) {
        TOPIC_DIFFICULTY.set(topic.id, topic.difficulty);
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'exercise');
        if (limited) return limited;

        const body = await request.json();
        const { subcategory, self_rating } = body;

        if (!subcategory || typeof subcategory !== 'string') {
            return NextResponse.json({ error: 'subcategory is required' }, { status: 400 });
        }

        // Validate subcategory against known curriculum topics
        const topicDifficulty = TOPIC_DIFFICULTY.get(subcategory);
        if (!topicDifficulty) {
            return NextResponse.json({ error: 'Invalid subcategory' }, { status: 400 });
        }

        if (!VALID_RATINGS.includes(self_rating)) {
            return NextResponse.json({ error: 'Invalid self_rating' }, { status: 400 });
        }

        // Use server-side difficulty lookup instead of trusting client
        const xpAmount = XP_MAP[topicDifficulty] || 20;

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
