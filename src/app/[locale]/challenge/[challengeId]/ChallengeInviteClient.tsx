'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Swords, Loader2, Users, Clock } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

type ChallengeInfo = {
    id: string;
    status: string;
    module_id: string;
    module_title: string;
    topic_count: number;
    creator_name: string | null;
    has_opponent: boolean;
};

export default function ChallengeInviteClient({ challengeId }: { challengeId: string }) {
    const { isSignedIn, isLoaded } = useUser();
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

                if (data.status !== 'waiting') {
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
