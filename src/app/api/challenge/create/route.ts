import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { curriculum } from '@/data/curriculum';
import { nanoid } from 'nanoid';
import { GAME_DURATION } from '@/lib/blitz-constants';

const VALID_MODULES = new Set(curriculum.map(m => m.id));
const ALL_TOPIC_IDS = new Set(curriculum.flatMap(m => m.topics.map(t => t.id)));

// Build module → topic mapping
const MODULE_TOPICS = new Map<string, Set<string>>();
for (const mod of curriculum) {
    MODULE_TOPICS.set(mod.id, new Set(mod.topics.map(t => t.id)));
}

// Topic IDs that are premium (index >= 3 in their module)
const PREMIUM_TOPICS = new Set<string>();
for (const mod of curriculum) {
    mod.topics.forEach((t, i) => {
        if (i >= 3) PREMIUM_TOPICS.add(t.id);
    });
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'challenge');
        if (limited) return limited;

        const body = await request.json();
        const { module_id, topic_ids, type = 'duel' } = body;

        if (type !== 'duel' && type !== 'public') {
            return NextResponse.json({ error: 'Invalid type (must be duel or public)' }, { status: 400 });
        }

        // Validate module
        if (!module_id || !VALID_MODULES.has(module_id)) {
            return NextResponse.json({ error: 'Invalid module_id' }, { status: 400 });
        }

        // Validate topic_ids
        if (!Array.isArray(topic_ids) || topic_ids.length === 0) {
            return NextResponse.json({ error: 'topic_ids must be a non-empty array' }, { status: 400 });
        }

        const moduleTops = MODULE_TOPICS.get(module_id)!;
        for (const tid of topic_ids) {
            if (!ALL_TOPIC_IDS.has(tid) || !moduleTops.has(tid)) {
                return NextResponse.json({ error: `Invalid topic_id: ${tid}` }, { status: 400 });
            }
        }

        const supabase = getSupabaseAdmin();

        // Seed questions: fetch from selected topics, with distractors, sorted by difficulty
        const { data: questions, error: qErr } = await supabase
            .from('questions')
            .select('id, difficulty')
            .in('subcategory', topic_ids)
            .not('distractors', 'is', null)
            .limit(50);

        if (qErr) {
            console.error('Failed to fetch questions for challenge:', qErr.message);
            return NextResponse.json({ error: 'Failed to seed questions' }, { status: 500 });
        }

        if (!questions || questions.length < 5) {
            return NextResponse.json({ error: 'Not enough questions for selected topics' }, { status: 400 });
        }

        // Sort by difficulty ascending
        const sortedIds = questions
            .sort((a, b) => a.difficulty - b.difficulty)
            .map(q => q.id);

        // Identify premium topics used
        const premiumTopics = topic_ids.filter((t: string) => PREMIUM_TOPICS.has(t));

        const challengeId = nanoid(12);
        const gameDuration = GAME_DURATION[module_id] ?? 180;

        const isPublic = type === 'public';

        const { error: insertErr } = await supabase
            .from('challenges')
            .insert({
                id: challengeId,
                creator_id: userId,
                status: isPublic ? 'playing' : 'waiting',
                type,
                module_id,
                topic_ids,
                question_ids: sortedIds,
                game_duration_seconds: gameDuration,
                unlocked_premium_topics: premiumTopics,
                ...(isPublic ? { game_started_at: new Date().toISOString(), creator_finished: false } : {}),
            });

        if (insertErr) {
            console.error('Failed to create challenge:', insertErr.message);
            return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
        }

        return NextResponse.json({
            challenge_id: challengeId,
            question_count: sortedIds.length,
        });
    } catch (err) {
        console.error('Create challenge error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
