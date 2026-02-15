'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Settings, Building2, ArrowRight } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import UpgradeButton from '@/components/UpgradeButton';
import LocaleToggle from '@/components/ui/LocaleToggle';
import { curriculum } from '@/data/curriculum';

const modules = curriculum;

const DAILY_XP_GOAL = 50;

interface DashboardClientProps {
    isPremium: boolean;
    exercisesSolved: number;
    currentStreak: number;
    xpTotal: number;
    xpToday: number;
    moduleProgress: Record<string, { practiced: number; total: number }>;
    uniRankingBalloon: { institutionName: string; totalExercises: number; qualified: boolean } | null;
}

export default function DashboardClient({
    isPremium,
    exercisesSolved,
    currentStreak,
    xpTotal,
    xpToday,
    moduleProgress,
    uniRankingBalloon,
}: DashboardClientProps) {
    const t = useTranslations('Dashboard');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');

    const xpPercent = Math.min(100, Math.round((xpToday / DAILY_XP_GOAL) * 100));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10 overflow-hidden">
                <div className="flex items-center gap-3">
                    <Image src="/logo-icon.png" alt="JustMathing Logo" width={261} height={271} priority className="h-8 sm:h-10 w-auto" />
                    <Link
                        href="/dashboard/stats"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl font-bold text-sm text-green-700 transition-colors"
                    >
                        <Trophy className="w-4 h-4 text-green-600" />
                        <span>{exercisesSolved}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                    {!isPremium && <UpgradeButton />}

                    {/* Streak */}
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                        <Flame className={cn("w-5 h-5", currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-300")} />
                        <span className={currentStreak > 0 ? "text-orange-600" : "text-gray-400"}>
                            {currentStreak}
                        </span>
                    </div>

                    {/* XP Total */}
                    <div className="flex items-center gap-1.5 font-bold text-sm text-yellow-600">
                        <Zap className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="hidden sm:inline">{xpTotal}</span>
                    </div>

                    {/* Settings */}
                    <Link href="/dashboard/settings" className="hidden sm:block text-gray-400 hover:text-gray-700 transition-colors">
                        <Settings className="w-4.5 h-4.5" />
                    </Link>

                    <LocaleToggle />

                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-12">

                <header className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('yourArena')}</h1>
                    <p className="text-gray-500 mt-2">{t('chooseModule')}</p>
                </header>

                {/* Daily XP goal bar */}
                <div className="mb-10 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                            <span className="font-bold text-gray-900 text-sm">{t('dailyGoal')}</span>
                        </div>
                        <span className="text-sm font-bold">
                            <span className={xpToday >= DAILY_XP_GOAL ? "text-green-600" : "text-gray-700"}>
                                {xpToday}
                            </span>
                            <span className="text-gray-400"> / {DAILY_XP_GOAL} XP</span>
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpPercent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={cn(
                                "h-full rounded-full",
                                xpToday >= DAILY_XP_GOAL ? "bg-green-500" : "bg-yellow-500"
                            )}
                        />
                    </div>
                    {xpToday >= DAILY_XP_GOAL && (
                        <p className="text-sm text-green-600 font-bold mt-2">{t('dailyGoalDone')}</p>
                    )}
                </div>

                {/* Uni Ranking Balloon */}
                {uniRankingBalloon && (
                    <Link href="/dashboard/stats" className="block mb-10">
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                            <div className="p-2.5 bg-purple-50 rounded-xl shrink-0">
                                <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                {uniRankingBalloon.qualified ? (
                                    <p className="text-sm font-bold text-gray-900">
                                        {t('uniQualified', { name: uniRankingBalloon.institutionName, count: uniRankingBalloon.totalExercises })}{' '}
                                        <span className="text-purple-600">{t('uniQualifiedCta')}</span>
                                    </p>
                                ) : (
                                    <p className="text-sm font-bold text-gray-900">
                                        {t('uniNotQualified', { remaining: 100 - uniRankingBalloon.totalExercises, name: uniRankingBalloon.institutionName })}
                                    </p>
                                )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                    </Link>
                )}

                {/* Module Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const progress = moduleProgress[module.id];
                        const progressPercent = progress
                            ? Math.round((progress.practiced / progress.total) * 100)
                            : 0;

                        return (
                            <Link href={{ pathname: '/dashboard/[module]', params: { module: module.id } }} key={module.id} className="block">
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className={cn(
                                        "h-full p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
                                        module.color
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <MathRenderer latex={module.iconLatex} className={cn("text-3xl", module.id === 'derivadas' ? 'text-blue-600' : module.id === 'integrais' ? 'text-purple-600' : 'text-yellow-600')} />
                                        </div>
                                        <div className="text-sm font-bold text-gray-400 bg-white/50 px-2 py-1 rounded-md">
                                            {module.topics.length} {tCommon('topics')}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{tc(`${module.id}.title`)}</h2>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                                            className={cn("h-full rounded-full", module.barColor)}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500 font-medium text-right">
                                        {progressPercent}% {tCommon('complete')}
                                    </div>
                                    <div className="mt-4 space-y-1 hidden sm:block">
                                        {module.topics.map((topic) => (
                                            <div key={topic.id} className="text-xs text-gray-500 flex items-center gap-1">
                                                <div className={cn("w-1 h-1 rounded-full", module.barColor)} />
                                                {tc(`${topic.id}.title`)}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

            </main>
        </div>
    );
}
