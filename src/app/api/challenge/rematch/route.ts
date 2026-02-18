import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';
import { GAME_DURATION } from '@/lib/blitz-constants';

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

        // Fetch original challenge
        const { data: original, error: fetchErr } = await supabase
            .from('challenges')
            .select('id, creator_id, opponent_id, status, type, module_id, topic_ids, rematch_challenge_id, game_duration_seconds')
            .eq('id', challenge_id)
            .single();

        if (fetchErr || !original) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        if (original.status !== 'finished') {
            return NextResponse.json({ error: 'Challenge is not finished' }, { status: 400 });
        }

        // Caller must be a participant
        const isCreator = original.creator_id === userId;
        const isOpponent = original.opponent_id === userId;
        if (!isCreator && !isOpponent) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // === PUBLIC: create a new Score Attack and redirect ===
        if (original.type === 'public') {
            const newId = nanoid(12);

            // Fetch fresh questions for the same topics
            const { data: questions, error: qErr } = await supabase
                .from('questions')
                .select('id, difficulty')
                .in('subcategory', original.topic_ids)
                .not('distractors', 'is', null)
                .limit(50);

            if (qErr || !questions || questions.length < 5) {
                return NextResponse.json({ error: 'Not enough questions' }, { status: 400 });
            }

            // Shuffle
            const arr = [...questions];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            const orderedIds = arr.map(q => q.id);

            const { error: insertErr } = await supabase
                .from('challenges')
                .insert({
                    id: newId,
                    creator_id: userId,
                    status: 'playing',
                    type: 'public',
                    module_id: original.module_id,
                    topic_ids: original.topic_ids,
                    question_ids: orderedIds,
                    game_duration_seconds: original.game_duration_seconds,
                    unlocked_premium_topics: [],
                    game_started_at: new Date().toISOString(),
                    creator_finished: false,
                });

            if (insertErr) {
                console.error('Failed to create public rematch:', insertErr.message);
                return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
            }

            return NextResponse.json({
                challenge_id: newId,
                action: 'created',
                module_id: original.module_id,
            });
        }

        // === DUEL: rematch already exists ===
        if (original.rematch_challenge_id) {
            const { data: existingRematch } = await supabase
                .from('challenges')
                .select('id, status, creator_id, expires_at')
                .eq('id', original.rematch_challenge_id)
                .single();

            // Stale or deleted rematch — clear and fall through to create
            if (!existingRematch || existingRematch.status === 'expired' ||
                (existingRematch.status === 'waiting' && new Date(existingRematch.expires_at) < new Date())) {
                // Mark expired if needed
                if (existingRematch?.status === 'waiting') {
                    await supabase.from('challenges').update({ status: 'expired' }).eq('id', existingRematch.id);
                }
                // Clear stale reference
                await supabase.from('challenges')
                    .update({ rematch_challenge_id: null })
                    .eq('id', challenge_id);
                // Fall through to create new rematch below
            } else {
                // Rematch is still valid
                if (existingRematch.creator_id === userId) {
                    // I created it, still waiting
                    return NextResponse.json({
                        challenge_id: existingRematch.id,
                        action: 'already_requested',
                    });
                } else {
                    // Other player created it — I accept
                    const { error: acceptErr } = await supabase
                        .from('challenges')
                        .update({
                            opponent_id: userId,
                            status: 'ready',
                        })
                        .eq('id', existingRematch.id)
                        .eq('status', 'waiting'); // optimistic lock

                    if (acceptErr) {
                        console.error('Failed to accept rematch:', acceptErr.message);
                        return NextResponse.json({ error: 'Failed to accept rematch' }, { status: 500 });
                    }

                    return NextResponse.json({
                        challenge_id: existingRematch.id,
                        action: 'accepted',
                        module_id: original.module_id,
                    });
                }
            }
        }

        // === DUEL: create new rematch ===
        const newId = nanoid(12);
        const gameDuration = GAME_DURATION[original.module_id] ?? 180;

        // Fetch fresh questions
        const { data: questions, error: qErr } = await supabase
            .from('questions')
            .select('id, difficulty')
            .in('subcategory', original.topic_ids)
            .not('distractors', 'is', null)
            .limit(50);

        if (qErr || !questions || questions.length < 5) {
            return NextResponse.json({ error: 'Not enough questions' }, { status: 400 });
        }

        // Shuffle
        const arr = [...questions];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const orderedIds = arr.map(q => q.id);

        // Insert new duel challenge
        const { error: insertErr } = await supabase
            .from('challenges')
            .insert({
                id: newId,
                creator_id: userId,
                status: 'waiting',
                type: 'duel',
                module_id: original.module_id,
                topic_ids: original.topic_ids,
                question_ids: orderedIds,
                game_duration_seconds: gameDuration,
                unlocked_premium_topics: [],
                expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
            });

        if (insertErr) {
            console.error('Failed to create duel rematch:', insertErr.message);
            return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
        }

        // Set rematch_challenge_id on original with optimistic lock
        const { data: lockResult } = await supabase
            .from('challenges')
            .update({ rematch_challenge_id: newId })
            .eq('id', challenge_id)
            .is('rematch_challenge_id', null)
            .select('rematch_challenge_id')
            .single();

        if (!lockResult || lockResult.rematch_challenge_id !== newId) {
            // Race condition: another player created a rematch first
            // Delete our orphan
            await supabase.from('challenges').delete().eq('id', newId);

            // Fetch the winner's rematch and accept it
            const { data: refreshed } = await supabase
                .from('challenges')
                .select('rematch_challenge_id')
                .eq('id', challenge_id)
                .single();

            if (refreshed?.rematch_challenge_id) {
                const { error: acceptErr } = await supabase
                    .from('challenges')
                    .update({
                        opponent_id: userId,
                        status: 'ready',
                    })
                    .eq('id', refreshed.rematch_challenge_id)
                    .eq('status', 'waiting');

                if (!acceptErr) {
                    return NextResponse.json({
                        challenge_id: refreshed.rematch_challenge_id,
                        action: 'accepted',
                        module_id: original.module_id,
                    });
                }
            }

            return NextResponse.json({ error: 'Rematch conflict, try again' }, { status: 409 });
        }

        return NextResponse.json({
            challenge_id: newId,
            action: 'created',
        });
    } catch (err) {
        console.error('Rematch error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
