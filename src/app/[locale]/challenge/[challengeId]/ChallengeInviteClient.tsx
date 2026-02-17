'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Swords, Trophy, Loader2, Users, Clock } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type LeaderboardEntry = {
    rank: number;
    user_id: string;
    name: string | null;
    score: number;
    strikes: number;
    is_creator: boolean;
};

type ChallengeInfo = {
    id: string;
    status: string;
    type: 'duel' | 'public';
    module_id: string;
    module_title: string;
    topic_count: number;
    creator_name: string | null;
    has_opponent: boolean;
    leaderboard?: LeaderboardEntry[];
    attempt_count?: number;
};

export default function ChallengeInviteClient({ challengeId }: { challengeId: string }) {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const t = useTranslations('Challenge');

    const [challenge, setChallenge] = useState<ChallengeInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchChallenge() {
            try {
                const res = await fetch(`/api/public/challenge/${challengeId}`);
                if (res.status === 410) {
                    setError('expired');
                    return;
                }
                if (!res.ok) {
                    setError('not_found');
                    return;
                }
                const data = await res.json();
                setChallenge(data);

                // For duel challenges, check if already accepted
                if (data.type !== 'public' && data.status !== 'waiting') {
                    setError('accepted');
                }
            } catch {
                setError('not_found');
            } finally {
                setLoading(false);
            }
        }
        fetchChallenge();
    }, [challengeId]);

    const handleAccept = async () => {
        setAccepting(true);
        try {
            const res = await fetch('/api/challenge/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challenge_id: challengeId }),
            });

            if (!res.ok) {
                const data = await res.json();
                if (res.status === 409) {
                    setError('accepted');
                } else if (res.status === 410) {
                    setError('expired');
                } else {
                    setError(data.error || 'not_found');
                }
                return;
            }

            // Redirect to gameplay page
            router.push({
                pathname: '/dashboard/[module]/challenge/[challengeId]',
                params: { module: challenge!.module_id, challengeId },
            });
        } catch {
            setError('not_found');
        } finally {
            setAccepting(false);
        }
    };

    const handlePlayPublic = () => {
        router.push({
            pathname: '/dashboard/[module]/challenge/[challengeId]',
            params: { module: challenge!.module_id, challengeId },
        });
    };

    const handleSignUp = () => {
        // Store challenge URL so user comes back after sign-up
        sessionStorage.setItem('challenge_redirect', `/challenge/${challengeId}`);
        router.push({ pathname: '/sign-up/[[...sign-up]]', params: { 'sign-up': undefined } });
    };

    // After sign-in, check if we need to redirect back
    useEffect(() => {
        if (isSignedIn && typeof window !== 'undefined') {
            const redirect = sessionStorage.getItem('challenge_redirect');
            if (redirect) {
                sessionStorage.removeItem('challenge_redirect');
            }
        }
    }, [isSignedIn]);

    if (loading || !isLoaded) {
        return (
            <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Swords className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {error === 'expired' ? t('challengeExpired') :
                         error === 'accepted' ? t('challengeAccepted') :
                         t('challengeNotFound')}
                    </h1>
                    <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                        {t('backToModule')}
                    </Link>
                </div>
            </div>
        );
    }

    // Public challenge — leaderboard view
    if (challenge?.type === 'public') {
        const leaderboard = challenge.leaderboard ?? [];
        const userAlreadyPlayed = isSignedIn && user
            ? leaderboard.some(e => e.user_id === user.id)
            : false;

        return (
            <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 text-center">
                        {/* Challenge icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-orange-600" />
                        </div>

                        {/* Creator name */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {t('scoreAttackBy', { name: challenge.creator_name || 'Someone' })}
                        </h1>

                        {/* Module & topic info */}
                        <div className="flex items-center justify-center gap-4 text-gray-500 mb-6">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">{challenge.module_title}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {t('topicsCount', { count: challenge.topic_count })}
                                </span>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        {leaderboard.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 text-center">{t('leaderboard')}</h3>
                                <div className="space-y-2">
                                    {leaderboard.map((entry) => {
                                        const isCurrentUser = isSignedIn && user && entry.user_id === user.id;
                                        return (
                                            <div
                                                key={entry.user_id}
                                                className={cn(
                                                    "flex items-center justify-between px-3 py-2 rounded-xl",
                                                    isCurrentUser ? "bg-orange-50 border border-orange-200" : "bg-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-sm font-bold w-6 text-center",
                                                        entry.rank <= 3 ? "text-orange-500" : "text-gray-400"
                                                    )}>
                                                        {entry.rank}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {entry.name || '???'}
                                                        {entry.is_creator && (
                                                            <span className="ml-1 text-xs text-gray-400">({t('creatorLabel')})</span>
                                                        )}
                                                        {isCurrentUser && (
                                                            <span className="ml-1 text-xs text-orange-500 font-bold">({t('you')})</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{entry.score}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {(challenge.attempt_count ?? 0) > leaderboard.length && (
                                    <p className="text-xs text-gray-400 mt-2 text-center">
                                        {t('attempts', { count: challenge.attempt_count ?? 0 })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action button */}
                        {userAlreadyPlayed ? (
                            <p className="text-sm text-gray-500 font-medium">{t('alreadyPlayed')}</p>
                        ) : isSignedIn ? (
                            <button
                                onClick={handlePlayPublic}
                                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Trophy className="w-5 h-5" />
                                {challenge.status === 'playing'
                                    ? t('beatThisScore')
                                    : t('beatThisScore')}
                            </button>
                        ) : (
                            <button
                                onClick={handleSignUp}
                                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Trophy className="w-5 h-5" />
                                {t('signUpToPlay')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Duel challenge — original invite view
    return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 text-center">
                    {/* Challenge icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Swords className="w-10 h-10 text-orange-600" />
                    </div>

                    {/* Creator name */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('challengeBy', { name: challenge?.creator_name || 'Someone' })}
                    </h1>

                    {/* Module & topic info */}
                    <div className="flex items-center justify-center gap-4 text-gray-500 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">{challenge?.module_title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t('topicsCount', { count: challenge?.topic_count ?? 0 })}
                            </span>
                        </div>
                    </div>

                    {/* Action button */}
                    {isSignedIn ? (
                        <button
                            onClick={handleAccept}
                            disabled={accepting}
                            className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {accepting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('accepting')}
                                </>
                            ) : (
                                <>
                                    <Swords className="w-5 h-5" />
                                    {t('acceptChallenge')}
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleSignUp}
                            className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Swords className="w-5 h-5" />
                            {t('signUpToAccept')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
