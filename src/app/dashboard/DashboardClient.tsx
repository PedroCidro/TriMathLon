'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Settings } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

import UpgradeButton from '@/components/UpgradeButton';
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
}

export default function DashboardClient({
    isPremium,
    exercisesSolved,
    currentStreak,
    xpTotal,
    xpToday,
    moduleProgress,
}: DashboardClientProps) {
    const xpPercent = Math.min(100, Math.round((xpToday / DAILY_XP_GOAL) * 100));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                    <img src="/logo-icon.png" alt="Trimathlon Logo" className="h-10 w-auto" />
                </div>

                <div className="flex items-center gap-5">
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
                        <span>{xpTotal}</span>
                    </div>

                    {/* Exercise count — links to stats */}
                    <Link href="/dashboard/stats" className="flex items-center gap-1.5 text-gray-500 font-medium text-sm hover:text-green-600 transition-colors">
                        <Trophy className="w-4 h-4 text-green-500" />
                        <span>{exercisesSolved}</span>
                    </Link>

                    {/* Settings */}
                    <Link href="/dashboard/settings" className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Settings className="w-4.5 h-4.5" />
                    </Link>

                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12">

                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Sua Arena de Treino</h1>
                    <p className="text-gray-500 mt-2">Escolha uma modalidade para começar.</p>
                </header>

                {/* Daily XP goal bar */}
                <div className="mb-10 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                            <span className="font-bold text-gray-900 text-sm">Meta Diária</span>
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
                        <p className="text-sm text-green-600 font-bold mt-2">Meta concluída! Continue treinando para subir no ranking.</p>
                    )}
                </div>

                {/* Module Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const progress = moduleProgress[module.id];
                        const progressPercent = progress
                            ? Math.round((progress.practiced / progress.total) * 100)
                            : 0;

                        return (
                            <Link href={`/dashboard/${module.id}`} key={module.id} className="block">
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
                                            {module.topics.length} Tópicos
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                                            className={cn("h-full rounded-full", module.barColor)}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500 font-medium text-right">
                                        {progressPercent}% Completo
                                    </div>
                                    <div className="mt-4 space-y-1">
                                        {module.topics.map((topic) => (
                                            <div key={topic.id} className="text-xs text-gray-500 flex items-center gap-1">
                                                <div className={cn("w-1 h-1 rounded-full", module.barColor)} />
                                                {topic.title}
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
