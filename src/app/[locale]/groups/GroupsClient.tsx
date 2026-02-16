'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Loader2, Copy, Check, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type Group = {
    id: string;
    name: string;
    invite_code: string;
    role: string;
    member_count: number;
    active_competitions: number;
};

export default function GroupsClient() {
    const t = useTranslations('Groups');
    const tCommon = useTranslations('Common');

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    async function fetchGroups() {
        try {
            const res = await fetch('/api/groups/list');
            if (res.ok) {
                const data = await res.json();
                setGroups(data.groups);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!groupName.trim() || creating) return;
        setCreating(true);
        try {
            const res = await fetch('/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: groupName.trim() }),
            });
            if (res.ok) {
                setGroupName('');
                setShowCreate(false);
                await fetchGroups();
            }
        } finally {
            setCreating(false);
        }
    }

    function copyInviteLink(group: Group) {
        const url = `${window.location.origin}/groups/join/${group.invite_code}`;
        navigator.clipboard.writeText(url);
        setCopiedId(group.id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function shareWhatsApp(group: Group) {
        const url = `${window.location.origin}/groups/join/${group.invite_code}`;
        const text = `${t('whatsappInvite')} ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
                        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                        {tCommon('backToDashboard')}
                    </Link>
                </div>

                {/* Create Group */}
                {!showCreate ? (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        {t('createGroup')}
                    </button>
                ) : (
                    <form onSubmit={handleCreate} className="mb-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('groupName')}</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            placeholder={t('groupNamePlaceholder')}
                            maxLength={50}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={!groupName.trim() || creating}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {creating ? t('creating') : t('createGroup')}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowCreate(false); setGroupName(''); }}
                                className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                                {tCommon('back')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Groups Grid */}
                {groups.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">{t('noGroups')}</h2>
                        <p className="text-sm text-gray-500">{t('noGroupsHint')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {groups.map(group => (
                            <div key={group.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <Link
                                        href={{ pathname: '/groups/[groupId]', params: { groupId: group.id } }}
                                        className="flex-1 min-w-0"
                                    >
                                        <h3 className="font-bold text-gray-900 text-lg truncate">{group.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span>{t('members', { count: group.member_count })}</span>
                                            {group.active_competitions > 0 && (
                                                <span className="text-green-600 font-medium">
                                                    {t('activeCompetitions', { count: group.active_competitions })}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-1 rounded-md",
                                            group.role === 'admin' ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                                        )}>
                                            {group.role === 'admin' ? t('admin') : t('member')}
                                        </span>
                                        <Link
                                            href={{ pathname: '/groups/[groupId]', params: { groupId: group.id } }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => copyInviteLink(group)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {copiedId === group.id ? (
                                            <><Check className="w-3.5 h-3.5 text-green-500" />{t('linkCopied')}</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" />{t('copyLink')}</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => shareWhatsApp(group)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {t('shareWhatsApp')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
