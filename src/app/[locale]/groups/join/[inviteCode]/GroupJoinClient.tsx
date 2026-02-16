'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Users, Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

type GroupInfo = {
    group_id: string;
    name: string;
    member_count: number;
    creator_name: string | null;
};

export default function GroupJoinClient({ inviteCode }: { inviteCode: string }) {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const t = useTranslations('Groups');

    const [group, setGroup] = useState<GroupInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGroup() {
            try {
                const res = await fetch(`/api/public/groups/join/${inviteCode}`);
                if (!res.ok) {
                    setError('not_found');
                    return;
                }
                const data = await res.json();
                setGroup(data);
            } catch {
                setError('not_found');
            } finally {
                setLoading(false);
            }
        }
        fetchGroup();
    }, [inviteCode]);

    const handleJoin = async () => {
        setJoining(true);
        try {
            const res = await fetch('/api/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invite_code: inviteCode }),
            });

            const data = await res.json();

            if (res.status === 409) {
                // Already a member — redirect to group
                router.push({ pathname: '/groups/[groupId]', params: { groupId: data.group_id } });
                return;
            }

            if (!res.ok) {
                if (data.error === 'Group is full') {
                    setError('full');
                } else {
                    setError('join_failed');
                }
                return;
            }

            router.push({ pathname: '/groups/[groupId]', params: { groupId: data.group_id } });
        } catch {
            setError('join_failed');
        } finally {
            setJoining(false);
        }
    };

    const handleSignUp = () => {
        sessionStorage.setItem('group_redirect', `/groups/join/${inviteCode}`);
        router.push({ pathname: '/sign-up/[[...sign-up]]', params: { 'sign-up': undefined } });
    };

    // After sign-in, check if we need to redirect back
    useEffect(() => {
        if (isSignedIn && typeof window !== 'undefined') {
            const redirect = sessionStorage.getItem('group_redirect');
            if (redirect) {
                sessionStorage.removeItem('group_redirect');
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
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {error === 'full' ? t('groupFull') :
                         error === 'already_member' ? t('alreadyMember') :
                         t('groupNotFound')}
                    </h1>
                    <Link href="/groups" className="text-blue-600 hover:underline mt-4 inline-block">
                        {t('title')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 text-center">
                    {/* Group icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-blue-600" />
                    </div>

                    {/* Group name */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {group?.name}
                    </h1>

                    {/* Info */}
                    <div className="flex items-center justify-center gap-4 text-gray-500 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t('members', { count: group?.member_count ?? 0 })}
                            </span>
                        </div>
                        {group?.creator_name && (
                            <span className="text-sm text-gray-400">
                                by {group.creator_name}
                            </span>
                        )}
                    </div>

                    {/* Action button */}
                    {isSignedIn ? (
                        <button
                            onClick={handleJoin}
                            disabled={joining}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {joining ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('joining')}
                                </>
                            ) : (
                                <>
                                    <Users className="w-5 h-5" />
                                    {t('joinGroup')}
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleSignUp}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Users className="w-5 h-5" />
                            {t('signUpToJoin')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
