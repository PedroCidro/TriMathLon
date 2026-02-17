'use client';

import { useState } from 'react';
import { ArrowLeft, Check, User, GraduationCap, School, BookOpen, Brain, Users, CreditCard, Trophy, Building2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { formatDisplayName } from '@/lib/rankings';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type Level = {
    id: string;
    title: string;
    icon: React.ReactNode;
};

interface SettingsClientProps {
    academicLevel: string | null;
    email: string | null;
    fullName: string | null;
    isPremium: boolean;
    hasSubscription: boolean;
    rankingOptIn: boolean;
    institutionName: string | null;
    institutionDepartment: string | null;
    institutionDepartmentName: string | null;
}

export default function SettingsClient({
    academicLevel,
    email,
    fullName,
    isPremium,
    hasSubscription,
    rankingOptIn: initialOptIn,
    institutionName,
    institutionDepartmentName,
}: SettingsClientProps) {
    const t = useTranslations('Settings');
    const tCommon = useTranslations('Common');

    const levels: Level[] = [
        { id: 'fundamental', title: t('levelFundamental'), icon: <School className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { id: 'medio', title: t('levelMedio'), icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { id: 'graduacao', title: t('levelGraduacao'), icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { id: 'pos', title: t('levelPos'), icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { id: 'enthusiast', title: t('levelEnthusiast'), icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    ];

    const [selectedLevel, setSelectedLevel] = useState<string | null>(academicLevel);
    const [saving, setSaving] = useState(false);
    const [optIn, setOptIn] = useState(initialOptIn);
    const [togglingOptIn, setTogglingOptIn] = useState(false);
    const [cancellingSubscription, setCancellingSubscription] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const hasChanged = selectedLevel !== academicLevel;

    const handleSave = async () => {
        if (!selectedLevel || !hasChanged) return;
        setSaving(true);

        try {
            const res = await fetch('/api/profile/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ academic_level: selectedLevel }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            toast.success(t('levelSaved'));
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error(t('levelSaveError', { msg }));
        } finally {
            setSaving(false);
        }
    };

    const handleToggleOptIn = async () => {
        setTogglingOptIn(true);
        try {
            const res = await fetch('/api/profile/ranking-opt-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setOptIn(data.ranking_opt_in);
            toast.success(data.ranking_opt_in ? t('joinedRanking') : t('leftRanking'));
        } catch {
            toast.error(t('updateError'));
        } finally {
            setTogglingOptIn(false);
        }
    };

    const handleCancelSubscription = async () => {
        setCancellingSubscription(true);
        try {
            const res = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error();
            setCancelled(true);
            setShowCancelConfirm(false);
            toast.success(t('cancelSuccess'));
        } catch {
            toast.error(t('cancelError'));
        } finally {
            setCancellingSubscription(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-4 sm:p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    {tCommon('backToArena')}
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-2">{t('subtitle')}</p>
                </header>

                {/* Section 1 -- Account Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">{t('accountSection')}</h2>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-500">{t('nameLabel')}</span>
                            <p className="font-medium text-gray-900">{fullName || '\u2014'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">{t('emailLabel')}</span>
                            <p className="font-medium text-gray-900">{email || '\u2014'}</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                        {t('accountHint')}
                    </p>
                </div>

                {/* Section 2 -- Academic Level */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">{t('academicLevel')}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all",
                                    selectedLevel === level.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                )}
                            >
                                {level.icon}
                                {level.title}
                                {selectedLevel === level.id && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                    {hasChanged && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                                saving
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {saving ? tCommon('saving') : tCommon('save')}
                        </button>
                    )}
                </div>

                {/* Section 3 -- Subscription */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">{t('subscriptionSection')}</h2>
                    </div>
                    {isPremium ? (
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                                <Check className="w-4 h-4" />
                                {cancelled ? t('cancelledBadge') : t('premiumActive')}
                            </span>
                            {cancelled && (
                                <p className="text-sm text-gray-500 mt-3">{t('cancelledHint')}</p>
                            )}
                            {hasSubscription && !cancelled && (
                                <div className="mt-4">
                                    {!showCancelConfirm ? (
                                        <button
                                            onClick={() => setShowCancelConfirm(true)}
                                            className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
                                        >
                                            {t('cancelSubscription')}
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <p className="text-sm font-medium text-red-800 mb-3">{t('cancelConfirm')}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCancelSubscription}
                                                    disabled={cancellingSubscription}
                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                                >
                                                    {cancellingSubscription ? tCommon('loading') : t('cancelConfirmButton')}
                                                </button>
                                                <button
                                                    onClick={() => setShowCancelConfirm(false)}
                                                    className="px-4 py-2 bg-white text-gray-600 text-sm font-bold rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                                                >
                                                    {t('cancelKeep')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">
                                {t('freePlan')}
                            </span>
                            <p className="text-sm text-gray-500 mt-3">
                                {t('freeHint')}
                            </p>
                            <Link
                                href="/premium"
                                className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                            >
                                {t('viewPremium')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Section 4 -- Ranking */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">{t('rankingSection')}</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{t('joinRanking')}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {t('displayNameHint', { name: formatDisplayName(fullName) })}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleOptIn}
                            disabled={togglingOptIn}
                            className={cn(
                                "relative w-12 h-7 rounded-full transition-colors",
                                optIn ? "bg-blue-600" : "bg-gray-300",
                                togglingOptIn && "opacity-50"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                                optIn ? "translate-x-5.5" : "translate-x-0.5"
                            )} />
                        </button>
                    </div>

                    {institutionName && (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">{t('institutionSection')}</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{institutionName}</p>
                            {institutionDepartmentName && (
                                <p className="text-xs text-gray-500 mt-1">{institutionDepartmentName}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
