'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, Trophy, Flame, Zap, Target, BarChart3, TrendingUp, TrendingDown, Award, Crown, Users, Building2, Share2, Check as CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { curriculum } from '@/data/curriculum';
import { getInstitutionById } from '@/data/institutions';
import { toast } from 'sonner';
import type { RankingData } from '@/lib/rankings';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    PieChart, Pie,
} from 'recharts';

type MasteryRow = {
    subcategory: string;
    attempts: number;
    correct: number;
    wrong_count: number;
    avg_self_rating: number | null;
    best_streak: number;
    last_practiced: string | null;
};

interface StatsClientProps {
    exercisesSolved: number;
    currentStreak: number;
    longestStreak: number;
    xpTotal: number;
    mastery: MasteryRow[];
    rankingData: RankingData;
    rankingOptIn: boolean;
    blitzBests: Record<string, number>;
    userId: string;
}

const MODULE_COLORS: Record<string, { accent: string; bg: string; text: string; fill: string }> = {
    limites: { accent: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', fill: '#0D9488' },
    derivadas: { accent: 'border-[#7C3AED]', bg: 'bg-purple-50', text: 'text-[#7C3AED]', fill: '#7C3AED' },
    aplicacoes: { accent: 'border-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', fill: '#059669' },
    integrais: { accent: 'border-[#4A1D96]', bg: 'bg-purple-100', text: 'text-[#4A1D96]', fill: '#4A1D96' },
};

const RANK_BADGES = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

function getAccuracy(correct: number, attempts: number): number {
    if (attempts === 0) return 0;
    return Math.round((correct / attempts) * 100);
}

function findModuleForTopic(subcategory: string): string {
    for (const mod of curriculum) {
        if (mod.topics.some(t => t.id === subcategory)) return mod.id;
    }
    return 'derivadas';
}

const TOTAL_TOPICS = curriculum.reduce((sum, m) => sum + m.topics.length, 0);

export default function StatsClient({
    exercisesSolved,
    currentStreak,
    longestStreak,
    xpTotal,
    mastery,
    rankingData,
    rankingOptIn: initialOptIn,
    blitzBests,
    userId,
}: StatsClientProps) {
    const [optIn, setOptIn] = useState(initialOptIn);
    const [togglingOptIn, setTogglingOptIn] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShareProfile = useCallback(async () => {
        const url = `${window.location.origin}/profile/${userId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [userId]);
    const t = useTranslations('Stats');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const locale = useLocale();

    const RATING_LABELS: Record<number, string> = {
        1: t('ratingWrong'),
        2: t('ratingHard'),
        3: t('ratingGood'),
        4: t('ratingEasy'),
    };

    function formatDate(dateStr: string | null): string {
        if (!dateStr) return '\u2014';
        const d = new Date(dateStr);
        return d.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }

    function findTopicTitle(subcategory: string): string {
        return tc.has(`${subcategory}.title`) ? tc(`${subcategory}.title`) : subcategory;
    }

    const masteryMap = new Map(mastery.map(m => [m.subcategory, m]));
    const practicedMastery = mastery.filter(m => m.attempts > 0);
    const topicsPracticed = practicedMastery.length;

    // Insights: only topics with >= 3 attempts qualify
    const qualifiedTopics = mastery.filter(m => m.attempts >= 3);

    const weakestTopic = qualifiedTopics.length > 0
        ? qualifiedTopics.reduce((worst, t) => {
            const worstAcc = getAccuracy(worst.correct, worst.attempts);
            const tAcc = getAccuracy(t.correct, t.attempts);
            return tAcc < worstAcc ? t : worst;
        })
        : null;

    const strongestTopic = qualifiedTopics.length > 0
        ? qualifiedTopics.reduce((best, t) => {
            const bestAcc = getAccuracy(best.correct, best.attempts);
            const tAcc = getAccuracy(t.correct, t.attempts);
            return tAcc > bestAcc ? t : best;
        })
        : null;

    const bestStreakTopic = mastery.length > 0
        ? mastery.reduce((best, t) => t.best_streak > best.best_streak ? t : best)
        : null;

    // --- Chart data ---

    // Bar chart: accuracy per practiced topic
    const accuracyChartData = practicedMastery
        .map(m => ({
            name: findTopicTitle(m.subcategory),
            accuracy: getAccuracy(m.correct, m.attempts),
            module: findModuleForTopic(m.subcategory),
        }))
        .sort((a, b) => b.accuracy - a.accuracy);

    // Radar chart: per-module aggregated accuracy (derivadas + aplicacoes merged)
    const radarData = (() => {
        const mergedGroups: { label: string; moduleIds: string[] }[] = [
            { label: tc('limites.title'), moduleIds: ['limites'] },
            { label: tc('derivadas.title'), moduleIds: ['derivadas', 'aplicacoes'] },
            { label: tc('integrais.title'), moduleIds: ['integrais'] },
        ];
        return mergedGroups.map(group => {
            const mods = group.moduleIds.map(id => curriculum.find(m => m.id === id)!).filter(Boolean);
            const allTopics = mods.flatMap(m => m.topics);
            const practiced = allTopics
                .map(t => masteryMap.get(t.id))
                .filter((m): m is MasteryRow => !!m && m.attempts > 0);
            const totalCorrect = practiced.reduce((s, m) => s + m.correct, 0);
            const totalAttempts = practiced.reduce((s, m) => s + m.attempts, 0);
            return {
                module: group.label,
                accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
                practiced: practiced.length,
                total: allTopics.length,
            };
        });
    })();

    // Donut chart: correct vs wrong overall
    const totalCorrect = practicedMastery.reduce((s, m) => s + m.correct, 0);
    const totalWrong = practicedMastery.reduce((s, m) => s + m.wrong_count, 0);
    const donutData = [
        { name: tCommon('correct'), value: totalCorrect, fill: '#22c55e' },
        { name: tCommon('wrong'), value: totalWrong, fill: '#ef4444' },
    ];
    const overallAccuracy = totalCorrect + totalWrong > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
        : 0;

    const hasAnyData = practicedMastery.length > 0;

    // Munin context-aware message
    const crowMessage = (() => {
        if (!hasAnyData) return { sprite: '/munin/thinking.png', text: t('crowNoData') };
        if (overallAccuracy >= 80) return { sprite: '/munin/congrats.png', text: t('crowHighAccuracy', { accuracy: overallAccuracy }) };
        if (weakestTopic && overallAccuracy < 50) return { sprite: '/munin/bright.png', text: t('crowLowAccuracy', { topic: findTopicTitle(weakestTopic.subcategory) }) };
        if (currentStreak >= 3) return { sprite: '/munin/happy.png', text: t('crowStreak', { days: currentStreak }) };
        return { sprite: '/munin/happy.png', text: t('crowDefault') };
    })();

    const institutionConfig = rankingData.institution ? getInstitutionById(rankingData.institution) : null;

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

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    {tCommon('backToArena')}
                </Link>

                <header className="mb-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                            <p className="text-gray-500 mt-2">{t('subtitle')}</p>
                        </div>
                        {optIn && (
                            <button
                                onClick={handleShareProfile}
                                className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                    copied
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                )}
                            >
                                {copied ? <CheckIcon className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                {copied ? t('linkCopied') : t('shareProfile')}
                            </button>
                        )}
                    </div>
                </header>

                {/* Section 1 -- Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-500">{t('exercisesLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{exercisesSolved}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-500">{t('streakLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {currentStreak}
                            <span className="text-sm font-medium text-gray-400 ml-1">/ {longestStreak} {t('maxSuffix')}</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-500">{t('xpTotalLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{xpTotal}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-[#7C3AED]" />
                            <span className="text-sm font-medium text-gray-500">{t('topicsLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {topicsPracticed}
                            <span className="text-sm font-medium text-gray-400 ml-1">/ {TOTAL_TOPICS}</span>
                        </p>
                    </div>
                </div>

                {/* Munin speech bubble */}
                <div className="flex items-end gap-4 mb-10">
                    <Image
                        src={crowMessage.sprite}
                        alt="Munin the crow"
                        width={150}
                        height={150}
                        className="h-[80px] sm:h-[100px] w-auto shrink-0"
                        unoptimized
                    />
                    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex-1">
                        <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px]">
                            <div className="w-3.5 h-3.5 bg-white border-l border-b border-gray-200 rotate-45" />
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900">{crowMessage.text}</p>
                    </div>
                </div>

                {/* Section 2 -- Charts */}
                {hasAnyData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Overall accuracy donut */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">{t('overallAccuracy')}</h3>
                            <div className="relative h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {donutData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}`, '']}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900">{overallAccuracy}%</p>
                                        <p className="text-xs text-gray-500">{tCommon('accuracy')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-2">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-gray-600">{totalCorrect} {tCommon('correct')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-gray-600">{totalWrong} {tCommon('wrong')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Radar: per-module accuracy */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">{t('accuracyByModule')}</h3>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis
                                            dataKey="module"
                                            tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }}
                                        />
                                        <Radar
                                            dataKey="accuracy"
                                            stroke="#7C3AED"
                                            fill="#7C3AED"
                                            fillOpacity={0.2}
                                            strokeWidth={2}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, tCommon('accuracy')]}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-4 mt-2">
                                {radarData.map(r => (
                                    <span key={r.module} className="text-xs text-gray-500">
                                        {r.module}: {r.practiced}/{r.total} {t('topicsSuffix')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bar chart: accuracy per topic */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">{t('accuracyByTopic')}</h3>
                            <div className="h-48 sm:h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={accuracyChartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={100}
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, tCommon('accuracy')]}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                        <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={18}>
                                            {accuracyChartData.map((entry, i) => (
                                                <Cell key={i} fill={MODULE_COLORS[entry.module]?.fill ?? '#6b7280'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 3 -- Per-topic Breakdown (practiced only) */}
                {hasAnyData && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-bold text-gray-900">{t('performanceByTopic')}</h2>
                            </div>
                        </div>

                        {curriculum.map((mod) => {
                            const colors = MODULE_COLORS[mod.id];
                            // Only topics with attempts > 0, sorted weakest first
                            const practicedTopics = mod.topics
                                .filter(t => {
                                    const m = masteryMap.get(t.id);
                                    return m && m.attempts > 0;
                                })
                                .sort((a, b) => {
                                    const ma = masteryMap.get(a.id)!;
                                    const mb = masteryMap.get(b.id)!;
                                    return getAccuracy(ma.correct, ma.attempts) - getAccuracy(mb.correct, mb.attempts);
                                });

                            if (practicedTopics.length === 0) return null;

                            return (
                                <div key={mod.id}>
                                    <div className={cn("px-6 py-3 border-l-4", colors.accent, colors.bg)}>
                                        <span className={cn("font-bold text-sm", colors.text)}>{tc(`${mod.id}.title`)}</span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {practicedTopics.map((topic) => {
                                            const m = masteryMap.get(topic.id)!;
                                            const accuracy = getAccuracy(m.correct, m.attempts);
                                            const ratingLabel = m.avg_self_rating
                                                ? RATING_LABELS[Math.round(m.avg_self_rating)] ?? '\u2014'
                                                : '\u2014';

                                            return (
                                                <div key={topic.id} className="px-6 py-3 flex items-center gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{tc(`${topic.id}.title`)}</p>
                                                    </div>
                                                    <div className="text-xs text-gray-500 w-20 text-right">
                                                        {m.attempts} {tCommon('attempts')}
                                                    </div>
                                                    <div className="w-24 flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full",
                                                                    accuracy >= 70 ? "bg-green-500" : accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                                                                )}
                                                                style={{ width: `${accuracy}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{accuracy}%</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 w-14 text-center hidden sm:block">{ratingLabel}</div>
                                                    <div className="text-xs text-gray-400 w-16 text-right hidden sm:block">{formatDate(m.last_practiced)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!hasAnyData && (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm mb-10 text-center">
                        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">{t('noTopicsPracticed')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('noTopicsHint')}</p>
                        <Link href="/dashboard" className="inline-block mt-4 text-[#7C3AED] hover:underline font-bold text-sm">
                            {t('goToArena')}
                        </Link>
                    </div>
                )}

                {/* Section 4 -- Insights */}
                {(weakestTopic || strongestTopic || (bestStreakTopic && bestStreakTopic.best_streak > 0)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {weakestTopic && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-medium text-gray-500">{t('hardestTopic')}</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(weakestTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('accuracyIn', { accuracy: getAccuracy(weakestTopic.correct, weakestTopic.attempts), attempts: weakestTopic.attempts })}
                                </p>
                            </div>
                        )}

                        {strongestTopic && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-medium text-gray-500">{t('strongestTopic')}</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(strongestTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('accuracyIn', { accuracy: getAccuracy(strongestTopic.correct, strongestTopic.attempts), attempts: strongestTopic.attempts })}
                                </p>
                            </div>
                        )}

                        {bestStreakTopic && bestStreakTopic.best_streak > 0 && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-500">{t('bestStreak')}</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(bestStreakTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('consecutiveCorrect', { count: bestStreakTopic.best_streak })}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Section 5 -- Blitz Records */}
                {Object.keys(blitzBests).length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-10">
                        <div className="flex items-center gap-2 mb-5">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-lg font-bold text-gray-900">{t('blitzRecords')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {curriculum.map((mod) => {
                                const best = blitzBests[mod.id];
                                if (best === undefined) return null;
                                const colors = MODULE_COLORS[mod.id];
                                return (
                                    <div key={mod.id} className={cn("rounded-xl p-4 border-l-4", colors.accent, colors.bg)}>
                                        <p className={cn("text-sm font-bold", colors.text)}>{tc(`${mod.id}.title`)}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{best}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{t('bestScoreLabel')}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Section 6 -- Rankings */}
                <div className="space-y-6 mb-10">
                    {/* 5a. Global Top 3 */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-lg font-bold text-gray-900">{t('globalTop3')}</h2>
                        </div>

                        {rankingData.global_top_3.length > 0 ? (
                            <div className="space-y-3">
                                {rankingData.global_top_3.map((user) => (
                                    <div
                                        key={user.position}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-xl",
                                            user.is_self ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                                        )}
                                    >
                                        <span className="text-2xl w-8 text-center">{RANK_BADGES[user.position - 1]}</span>
                                        <div className="flex-1">
                                            <p className={cn("font-bold text-sm", user.is_self ? "text-[#7C3AED]" : "text-gray-900")}>
                                                {user.display_name} {user.is_self && `(${t('you')})`}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{user.exercises_solved} {tCommon('exercises')}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">{t('noRankingYet')}</p>
                        )}

                        {/* User's own position or opt-in prompt */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {optIn && rankingData.my_global_position !== null ? (
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold">{t('yourPosition')}</span> #{rankingData.my_global_position} — {exercisesSolved} {tCommon('exercises')}
                                </p>
                            ) : !optIn ? (
                                <button
                                    onClick={handleToggleOptIn}
                                    disabled={togglingOptIn}
                                    className="text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors disabled:opacity-50"
                                >
                                    {togglingOptIn ? t('updating') : t('joinRanking')}
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* 5b. Internal Uni Ranking */}
                    {rankingData.institution && institutionConfig && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Users className="w-5 h-5 text-[#7C3AED]" />
                                <h2 className="text-lg font-bold text-gray-900">{t('uniRanking', { name: institutionConfig.name })}</h2>
                            </div>

                            {rankingData.internal_ranking.length > 0 ? (
                                <div className="space-y-2">
                                    {rankingData.internal_ranking.map((user) => (
                                        <div
                                            key={user.position}
                                            className={cn(
                                                "flex items-center gap-4 p-3 rounded-xl",
                                                user.is_self ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                                            )}
                                        >
                                            <span className="text-sm font-bold text-gray-400 w-8 text-center">#{user.position}</span>
                                            <div className="flex-1">
                                                <p className={cn("font-bold text-sm", user.is_self ? "text-[#7C3AED]" : "text-gray-900")}>
                                                    {user.display_name} {user.is_self && `(${t('you')})`}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">{user.exercises_solved}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">{t('noStudentsYet', { name: institutionConfig.name })}</p>
                            )}

                            {optIn && rankingData.my_internal_position !== null && !rankingData.internal_ranking.some(u => u.is_self) && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">
                                        ... <span className="font-bold">{t('yourPosition')}</span> #{rankingData.my_internal_position} — {exercisesSolved} {tCommon('exercises')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5c. External Uni Ranking */}
                    {rankingData.institution && institutionConfig && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Building2 className="w-5 h-5 text-purple-500" />
                                <h2 className="text-lg font-bold text-gray-900">{t('interUniRanking')}</h2>
                            </div>

                            {rankingData.uni_qualified ? (
                                <div className="space-y-2">
                                    {rankingData.external_ranking.map((uni, i) => {
                                        const uniConfig = getInstitutionById(uni.institution);
                                        return (
                                            <div key={uni.institution} className={cn(
                                                "flex items-center gap-4 p-3 rounded-xl",
                                                uni.institution === rankingData.institution ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                                            )}>
                                                <span className="text-sm font-bold text-gray-400 w-8 text-center">#{i + 1}</span>
                                                <p className="flex-1 font-bold text-sm text-gray-900">{uniConfig?.name ?? uni.institution}</p>
                                                <span className="text-sm font-bold text-gray-600">{uni.total_exercises} {tCommon('exercises')}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">
                                        {t('uniNotQualified', { remaining: 100 - rankingData.uni_total_exercises, name: institutionConfig.name })}
                                    </p>
                                    <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                                        <div
                                            className="h-full rounded-full bg-purple-500"
                                            style={{ width: `${Math.min(100, rankingData.uni_total_exercises)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{rankingData.uni_total_exercises} / 100</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
