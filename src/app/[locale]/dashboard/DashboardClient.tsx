'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Zap, Settings, Building2, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import UpgradeButton from '@/components/UpgradeButton';
import LocaleToggle from '@/components/ui/LocaleToggle';
import CrowGreeting from '@/components/ui/CrowGreeting';
import ModuleCard from '@/components/ui/ModuleCard';
import { curriculum } from '@/data/curriculum';

const RANKING_TOOLTIP_KEY = 'dashboard_ranking_tooltip_seen';
const GROUPS_TOOLTIP_KEY = 'dashboard_groups_tooltip_seen';

const modules = curriculum;

interface DashboardClientProps {
    isPremium: boolean;
    exercisesSolved: number;
    currentStreak: number;
    xpTotal: number;
    xpToday: number;
    moduleProgress: Record<string, { practiced: number; total: number }>;
    uniRankingBalloon: { institutionName: string; totalExercises: number; qualified: boolean } | null;
    lastActiveDate: string | null;
    motivation: string | null;
    dailyGoal: number;
}

export default function DashboardClient({
    isPremium,
    exercisesSolved,
    currentStreak,
    xpTotal,
    xpToday,
    moduleProgress,
    uniRankingBalloon,
    lastActiveDate,
    motivation,
    dailyGoal,
}: DashboardClientProps) {
    const t = useTranslations('Dashboard');
    const tc = useTranslations('Curriculum');
    const tCrow = useTranslations('Crow');

    const [showAplicacoes, setShowAplicacoes] = useState(false);
    const isFirstVisit = exercisesSolved === 0;

    // Compute per-module progress percentages
    const moduleProgressPercents: Record<string, number> = {};
    for (const mod of modules) {
        const progress = moduleProgress[mod.id];
        moduleProgressPercents[mod.id] = progress
            ? Math.round((progress.practiced / progress.total) * 100)
            : 0;
    }
    const totalProgress = Object.values(moduleProgressPercents).reduce((a, b) => a + b, 0);

    // Find module with lowest progress for glow animation
    let lowestProgressModuleId = 'derivadas';
    let lowestVal = Infinity;
    for (const mod of modules) {
        const pct = moduleProgressPercents[mod.id];
        if (pct < lowestVal) {
            lowestVal = pct;
            lowestProgressModuleId = mod.id;
        }
    }

    const [showRankingTooltip, setShowRankingTooltip] = useState(false);
    const [showGroupsTooltip, setShowGroupsTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const groupsTooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!localStorage.getItem(RANKING_TOOLTIP_KEY)) {
            setShowRankingTooltip(true);
        } else if (!localStorage.getItem(GROUPS_TOOLTIP_KEY)) {
            // Ranking already seen — show groups tooltip directly
            setShowGroupsTooltip(true);
        }
    }, []);

    useEffect(() => {
        if (!showRankingTooltip) return;
        function handleClick(e: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                dismissRankingTooltip();
            }
        }
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [showRankingTooltip]);

    useEffect(() => {
        if (!showGroupsTooltip) return;
        function handleClick(e: MouseEvent) {
            if (groupsTooltipRef.current && !groupsTooltipRef.current.contains(e.target as Node)) {
                dismissGroupsTooltip();
            }
        }
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [showGroupsTooltip]);

    function dismissRankingTooltip() {
        setShowRankingTooltip(false);
        localStorage.setItem(RANKING_TOOLTIP_KEY, '1');
        // Chain: show groups tooltip next if not yet seen
        if (!localStorage.getItem(GROUPS_TOOLTIP_KEY)) {
            setTimeout(() => setShowGroupsTooltip(true), 300);
        }
    }

    function dismissGroupsTooltip() {
        setShowGroupsTooltip(false);
        localStorage.setItem(GROUPS_TOOLTIP_KEY, '1');
    }

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col">

            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-lg sm:text-xl font-medium tracking-tight text-gray-400">Justmathing</span>
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

                {/* Crow Greeting + XP Bar */}
                <CrowGreeting
                    currentStreak={currentStreak}
                    xpToday={xpToday}
                    exercisesSolved={exercisesSolved}
                    lastActiveDate={lastActiveDate}
                    totalProgress={totalProgress}
                    motivation={motivation}
                    dailyGoal={dailyGoal}
                />

                {/* Action buttons row — hidden during tutorial */}
                <div className={cn("flex items-center gap-3 mb-8", isFirstVisit && "hidden")}>
                    {/* Groups */}
                    <div className="relative" ref={groupsTooltipRef}>
                        <Link
                            href="/groups"
                            onClick={showGroupsTooltip ? dismissGroupsTooltip : undefined}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold text-sm text-blue-700 transition-colors"
                        >
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="hidden sm:inline">{t('groupsLabel')}</span>
                        </Link>
                        <AnimatePresence>
                            {showGroupsTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-0 top-full mt-2 z-50 w-52 bg-gray-900 text-white text-xs font-medium rounded-lg px-3 py-2 shadow-lg text-center"
                                >
                                    <div className="absolute left-4 -top-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />
                                    <span className="relative">{t('groupsTooltip')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Stats / Ranking */}
                    <div className="relative" ref={tooltipRef}>
                        <Link
                            href="/dashboard/stats"
                            onClick={showRankingTooltip ? dismissRankingTooltip : undefined}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl font-bold text-sm text-green-700 transition-colors"
                        >
                            <Trophy className="w-4 h-4 text-green-600" />
                            <span>{exercisesSolved}</span>
                        </Link>
                        <AnimatePresence>
                            {showRankingTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-52 bg-gray-900 text-white text-xs font-medium rounded-lg px-3 py-2 shadow-lg text-center"
                                >
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />
                                    <span className="relative">{t('rankingTooltip')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Uni Ranking Balloon — hidden during tutorial */}
                {uniRankingBalloon && !isFirstVisit && (
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

                {/* Dark overlay for first-visit tutorial */}
                {isFirstVisit && (
                    <div className="fixed inset-0 bg-black/50 z-20 pointer-events-none" />
                )}

                {/* Module Cards */}
                <div className={cn("relative", isFirstVisit && "relative z-30")}>
                    <div className="flex flex-col gap-6">
                        {/* Limites card centered on top with crow guide */}
                        {modules.filter(m => m.id === 'limites').map((module) => (
                            <div key={module.id} className="flex flex-col items-center">
                                {/* Crow guide above Limites */}
                                {isFirstVisit && (
                                    <div className="flex flex-col items-center mb-2">
                                        <Image
                                            src="/munin/happy.png"
                                            alt="Start here"
                                            width={80}
                                            height={80}
                                            className="h-[60px] sm:h-[70px] w-auto"
                                        />
                                        <div className="bg-gray-900 text-white text-xs font-bold rounded-lg px-3 py-1.5 -mt-1 shadow-lg">
                                            {tCrow('startHere')}
                                        </div>
                                    </div>
                                )}
                                <div className="w-full md:w-1/3">
                                    <ModuleCard
                                        module={module}
                                        progressPercent={moduleProgressPercents[module.id]}
                                        isLowestProgress={isFirstVisit || module.id === lowestProgressModuleId}
                                        locale="pt"
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Remaining modules centered */}
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            {modules.filter(m => m.id !== 'limites' && m.id !== 'aplicacoes').map((module) => {
                                if (module.id === 'derivadas') {
                                    const aplicacoes = modules.find(m => m.id === 'aplicacoes')!;
                                    const active = showAplicacoes ? aplicacoes : module;
                                    const inactiveLabel = showAplicacoes ? tc('derivadas.title') : tc('aplicacoes.title');
                                    return (
                                        <div key="derivadas-slot" className="w-full md:w-1/3">
                                            <ModuleCard
                                                module={active}
                                                progressPercent={moduleProgressPercents[active.id]}
                                                isLowestProgress={isFirstVisit || active.id === lowestProgressModuleId}
                                                locale="pt"
                                                toggleLabel={inactiveLabel}
                                                onToggle={() => setShowAplicacoes(prev => !prev)}
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={module.id} className="w-full md:w-1/3">
                                        <ModuleCard
                                            module={module}
                                            progressPercent={moduleProgressPercents[module.id]}
                                            isLowestProgress={isFirstVisit || module.id === lowestProgressModuleId}
                                            locale="pt"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
