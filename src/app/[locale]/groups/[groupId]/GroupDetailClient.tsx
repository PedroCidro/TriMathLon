'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Users, Trophy, Copy, Check, Loader2, Trash2, LogOut, ChevronDown, Plus, X } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { curriculum } from '@/data/curriculum';

type Member = {
    user_id: string;
    name: string | null;
    role: string;
    joined_at: string;
};

type LeaderboardEntry = {
    user_id: string;
    name: string | null;
    solved: number;
    accuracy: number;
    current_streak: number;
    last_active_date: string | null;
};

type Competition = {
    id: string;
    title: string | null;
    module_ids: string[] | null;
    topic_ids: string[] | null;
    starts_at: string;
    ends_at: string;
    status: string;
    leaderboard?: LeaderboardEntry[];
};

type GroupData = {
    group: {
        id: string;
        name: string;
        creator_id: string;
        invite_code: string;
        your_role: string;
    };
    members: Member[];
    active_competitions: Competition[];
    past_competitions: Competition[];
};

export default function GroupDetailClient({ groupId }: { groupId: string }) {
    const { user } = useUser();
    const router = useRouter();
    const t = useTranslations('Groups');
    const tc = useTranslations('Curriculum');

    const [data, setData] = useState<GroupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showCreateComp, setShowCreateComp] = useState(false);
    const [expandedPast, setExpandedPast] = useState<string | null>(null);
    const [pastLeaderboards, setPastLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});

    // Create competition form
    const [compTitle, setCompTitle] = useState('');
    const [compDeadline, setCompDeadline] = useState('');
    const [compModules, setCompModules] = useState<string[]>([]);
    const [creatingComp, setCreatingComp] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${groupId}`);
            if (!res.ok) {
                setError(true);
                return;
            }
            const json = await res.json();
            setData(json);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
        // Poll every 60s for active competitions
        const interval = setInterval(fetchData, 60_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    function copyInviteLink() {
        if (!data) return;
        const url = `${window.location.origin}/groups/join/${data.group.invite_code}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function shareWhatsApp() {
        if (!data) return;
        const url = `${window.location.origin}/groups/join/${data.group.invite_code}`;
        const text = `${t('whatsappInvite')} ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    async function handleDeleteGroup() {
        const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
        if (res.ok) {
            router.push('/groups');
        }
    }

    async function handleLeaveGroup() {
        const res = await fetch(`/api/groups/${groupId}/members/leave`, { method: 'POST' });
        if (res.ok) {
            router.push('/groups');
        }
    }

    async function handleRemoveMember(targetUserId: string) {
        const res = await fetch(`/api/groups/${groupId}/members/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: targetUserId }),
        });
        if (res.ok) {
            await fetchData();
        }
    }

    async function handleCreateCompetition(e: React.FormEvent) {
        e.preventDefault();
        if (!compDeadline || creatingComp) return;
        setCreatingComp(true);
        try {
            const body: Record<string, unknown> = {
                ends_at: new Date(compDeadline).toISOString(),
            };
            if (compTitle.trim()) body.title = compTitle.trim();
            if (compModules.length > 0) body.module_ids = compModules;

            const res = await fetch(`/api/groups/${groupId}/competitions/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setShowCreateComp(false);
                setCompTitle('');
                setCompDeadline('');
                setCompModules([]);
                await fetchData();
            }
        } finally {
            setCreatingComp(false);
        }
    }

    async function fetchPastLeaderboard(competitionId: string) {
        if (pastLeaderboards[competitionId]) {
            setExpandedPast(expandedPast === competitionId ? null : competitionId);
            return;
        }
        setExpandedPast(competitionId);
        const res = await fetch(`/api/groups/${groupId}/competitions/${competitionId}/leaderboard`);
        if (res.ok) {
            const json = await res.json();
            setPastLeaderboards(prev => ({ ...prev, [competitionId]: json.leaderboard }));
        }
    }

    function formatTimeLeft(endsAt: string): string {
        const diff = new Date(endsAt).getTime() - Date.now();
        if (diff <= 0) return t('finished');
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return t('endsIn', { time: `${days}d ${hours}h` });
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return t('endsIn', { time: `${hours}h ${minutes}m` });
    }

    function formatLastActive(date: string | null): string {
        if (!date) return '—';
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (date === today) return t('today');
        if (date === yesterday) return t('yesterday');
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
        return t('daysAgo', { count: diff });
    }

    function getCompFilterLabel(comp: Competition): string {
        if (comp.module_ids && comp.module_ids.length > 0) {
            return comp.module_ids.map(id => {
                try { return tc(`${id}.title`); } catch { return id; }
            }).join(', ');
        }
        return t('allTopics');
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('groupNotFound')}</h1>
                    <Link href="/groups" className="text-blue-600 hover:underline">{t('title')}</Link>
                </div>
            </div>
        );
    }

    const isAdmin = data.group.your_role === 'admin';
    const userId = user?.id;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-12">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/groups" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
                        &larr; {t('title')}
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{data.group.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={copyInviteLink}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {copied ? (
                                <><Check className="w-4 h-4 text-green-500" />{t('linkCopied')}</>
                            ) : (
                                <><Copy className="w-4 h-4" />{t('copyLink')}</>
                            )}
                        </button>
                        <button
                            onClick={shareWhatsApp}
                            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                        >
                            {t('shareWhatsApp')}
                        </button>
                    </div>
                </div>

                {/* Members */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {t('members', { count: data.members.length })}
                    </h2>
                    <div className="space-y-2">
                        {data.members.map(member => (
                            <div key={member.user_id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800">
                                        {member.name ?? '???'}
                                    </span>
                                    {member.user_id === userId && (
                                        <span className="text-xs text-blue-500 font-bold">({t('you')})</span>
                                    )}
                                    {member.role === 'admin' && (
                                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{t('admin')}</span>
                                    )}
                                </div>
                                {isAdmin && member.user_id !== userId && member.role !== 'admin' && (
                                    <button
                                        onClick={() => handleRemoveMember(member.user_id)}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                                    >
                                        {t('removeMember')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Active Competitions */}
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            {t('activeCompetitions', { count: data.active_competitions.length })}
                        </h2>
                        {data.active_competitions.length < 5 && !showCreateComp && (
                            <button
                                onClick={() => setShowCreateComp(true)}
                                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                {t('createCompetition')}
                            </button>
                        )}
                    </div>

                    {/* Create Competition Form */}
                    {showCreateComp && (
                        <form onSubmit={handleCreateCompetition} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">{t('createCompetition')}</h3>
                                <button type="button" onClick={() => setShowCreateComp(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('competitionTitle')}</label>
                                    <input
                                        type="text"
                                        value={compTitle}
                                        onChange={e => setCompTitle(e.target.value)}
                                        placeholder={t('competitionTitlePlaceholder')}
                                        maxLength={100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('deadline')}</label>
                                    <input
                                        type="datetime-local"
                                        value={compDeadline}
                                        onChange={e => setCompDeadline(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('filterModules')}</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {curriculum.map(mod => (
                                            <button
                                                key={mod.id}
                                                type="button"
                                                onClick={() => {
                                                    setCompModules(prev =>
                                                        prev.includes(mod.id)
                                                            ? prev.filter(m => m !== mod.id)
                                                            : [...prev, mod.id]
                                                    );
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                                                    compModules.includes(mod.id)
                                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                {tc(`${mod.id}.title`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!compDeadline || creatingComp}
                                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {creatingComp ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t('startCompetition')}
                                </button>
                            </div>
                        </form>
                    )}

                    {data.active_competitions.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500 text-sm">
                            {t('noActiveCompetitions')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.active_competitions.map(comp => (
                                <CompetitionCard
                                    key={comp.id}
                                    comp={comp}
                                    userId={userId}
                                    formatTimeLeft={formatTimeLeft}
                                    formatLastActive={formatLastActive}
                                    getFilterLabel={getCompFilterLabel}
                                    t={t}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Past Competitions */}
                {data.past_competitions.length > 0 && (
                    <section className="mb-6">
                        <h2 className="font-bold text-gray-900 mb-3">{t('pastCompetitions')}</h2>
                        <div className="space-y-2">
                            {data.past_competitions.map(comp => (
                                <div key={comp.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => fetchPastLeaderboard(comp.id)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <span className="font-medium text-gray-900 text-sm">
                                                {comp.title || getCompFilterLabel(comp)}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2">{t('finished')}</span>
                                        </div>
                                        <ChevronDown className={cn(
                                            "w-4 h-4 text-gray-400 transition-transform",
                                            expandedPast === comp.id && "rotate-180"
                                        )} />
                                    </button>
                                    {expandedPast === comp.id && pastLeaderboards[comp.id] && (
                                        <div className="px-4 pb-4">
                                            <LeaderboardTable
                                                entries={pastLeaderboards[comp.id]}
                                                userId={userId}
                                                formatLastActive={formatLastActive}
                                                t={t}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Admin Actions */}
                <section className="mt-8 pt-6 border-t border-gray-200">
                    {isAdmin ? (
                        <>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t('deleteGroup')}
                                </button>
                            ) : (
                                <div className="bg-red-50 rounded-xl p-4">
                                    <p className="text-sm text-red-700 mb-3">{t('deleteConfirm')}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteGroup}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                        >
                                            {t('deleteGroup')}
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-4 py-2 text-gray-600 text-sm font-medium"
                                        >
                                            {t('member')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {!showLeaveConfirm ? (
                                <button
                                    onClick={() => setShowLeaveConfirm(true)}
                                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t('leaveGroup')}
                                </button>
                            ) : (
                                <div className="bg-red-50 rounded-xl p-4">
                                    <p className="text-sm text-red-700 mb-3">{t('leaveConfirm')}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleLeaveGroup}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                        >
                                            {t('leaveGroup')}
                                        </button>
                                        <button
                                            onClick={() => setShowLeaveConfirm(false)}
                                            className="px-4 py-2 text-gray-600 text-sm font-medium"
                                        >
                                            {t('member')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

function CompetitionCard({
    comp,
    userId,
    formatTimeLeft,
    formatLastActive,
    getFilterLabel,
    t,
}: {
    comp: Competition;
    userId: string | undefined;
    formatTimeLeft: (endsAt: string) => string;
    formatLastActive: (date: string | null) => string;
    getFilterLabel: (comp: Competition) => string;
    t: ReturnType<typeof useTranslations>;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-bold text-gray-900">
                        {comp.title || getFilterLabel(comp)}
                    </h3>
                    <span className="text-xs text-gray-500">{getFilterLabel(comp)}</span>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                    {formatTimeLeft(comp.ends_at)}
                </span>
            </div>
            {comp.leaderboard && (
                <LeaderboardTable
                    entries={comp.leaderboard}
                    userId={userId}
                    formatLastActive={formatLastActive}
                    t={t}
                />
            )}
        </div>
    );
}

function LeaderboardTable({
    entries,
    userId,
    formatLastActive,
    t,
}: {
    entries: LeaderboardEntry[];
    userId: string | undefined;
    formatLastActive: (date: string | null) => string;
    t: ReturnType<typeof useTranslations>;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="text-left py-2 pl-2 w-8">{t('rank')}</th>
                        <th className="text-left py-2">{t('name')}</th>
                        <th className="text-right py-2">{t('solved')}</th>
                        <th className="text-right py-2">{t('accuracy')}</th>
                        <th className="text-right py-2 hidden sm:table-cell">{t('streak')}</th>
                        <th className="text-right py-2 pr-2 hidden sm:table-cell">{t('lastActive')}</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => {
                        const isYou = entry.user_id === userId;
                        return (
                            <tr
                                key={entry.user_id}
                                className={cn(
                                    "border-b border-gray-50",
                                    isYou && "bg-blue-50"
                                )}
                            >
                                <td className="py-2 pl-2 font-bold text-gray-400">{i + 1}</td>
                                <td className="py-2 font-medium text-gray-800">
                                    {entry.name ?? '???'}
                                    {isYou && <span className="ml-1 text-xs text-blue-500 font-bold">({t('you')})</span>}
                                </td>
                                <td className="py-2 text-right font-bold text-gray-900">{entry.solved}</td>
                                <td className="py-2 text-right text-gray-600">{entry.accuracy}%</td>
                                <td className="py-2 text-right text-gray-600 hidden sm:table-cell">{entry.current_streak}</td>
                                <td className="py-2 pr-2 text-right text-gray-400 text-xs hidden sm:table-cell">
                                    {formatLastActive(entry.last_active_date)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
