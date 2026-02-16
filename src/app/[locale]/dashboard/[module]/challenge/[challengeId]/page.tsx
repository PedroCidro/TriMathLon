import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import ChallengeBlitzClient from './ChallengeBlitzClient';

type Params = Promise<{ module: string; challengeId: string }>;

export default async function ChallengeGameplayPage({ params }: { params: Params }) {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    const { module: moduleId, challengeId } = await params;

    const supabase = getSupabaseAdmin();

    // Fetch challenge
    const { data: challenge } = await supabase
        .from('challenges')
        .select('id, creator_id, opponent_id, status, module_id, game_duration_seconds, unlocked_premium_topics, type')
        .eq('id', challengeId)
        .single();

    if (!challenge) {
        return redirect(`/dashboard/${moduleId}`);
    }

    const isPublic = challenge.type === 'public';

    if (isPublic) {
        // Public challenges: any authenticated user can access,
        // UNLESS they already have an attempt
        const { data: existingAttempt } = await supabase
            .from('challenge_attempts')
            .select('id')
            .eq('challenge_id', challengeId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingAttempt) {
            // Already played — redirect to leaderboard page
            return redirect(`/challenge/${challengeId}`);
        }
    } else {
        // Duel: only participants can access
        const isParticipant =
            challenge.creator_id === userId || challenge.opponent_id === userId;

        if (!isParticipant) {
            return redirect(`/dashboard/${moduleId}`);
        }
    }

    // Module mismatch check
    if (challenge.module_id !== moduleId) {
        return redirect(`/dashboard/${challenge.module_id}/challenge/${challengeId}`);
    }

    // Fetch user's premium status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

    // Fetch opponent's name (duel only)
    let opponentName: string | null = null;
    if (!isPublic) {
        const opponentId = challenge.creator_id === userId ? challenge.opponent_id : challenge.creator_id;
        if (opponentId) {
            const { data: opponentProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', opponentId)
                .single();
            opponentName = opponentProfile?.full_name ?? null;
        }
    }

    return (
        <ChallengeBlitzClient
            challengeId={challengeId}
            moduleId={moduleId}
            isCreator={challenge.creator_id === userId}
            gameDuration={challenge.game_duration_seconds}
            challengeStatus={challenge.status}
            challengeType={challenge.type ?? 'duel'}
            opponentName={opponentName}
            isPremium={profile?.is_premium ?? false}
            unlockedPremiumTopics={challenge.unlocked_premium_topics ?? []}
        />
    );
}
