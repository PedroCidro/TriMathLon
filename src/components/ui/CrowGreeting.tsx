'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrowGreetingProps {
    currentStreak: number;
    xpToday: number;
    exercisesSolved: number;
    lastActiveDate: string | null;
    totalProgress: number;
    motivation?: string | null;
    dailyGoal: number;
}

function getDaysSince(dateStr: string | null): number {
    if (!dateStr) return Infinity;
    const then = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - then.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const MOTIVATION_GREETING_KEYS: Record<string, string> = {
    passing_exam: 'firstVisitExam',
    deeper_understanding: 'firstVisitUnderstand',
    review: 'firstVisitReview',
    curiosity: 'firstVisitCuriosity',
};

export default function CrowGreeting({
    currentStreak,
    xpToday,
    lastActiveDate,
    totalProgress,
    motivation,
    dailyGoal,
}: CrowGreetingProps) {
    const t = useTranslations('Crow');

    // Determine sprite + message
    let sprite = '/munin/base.png';
    let message: string;

    if (totalProgress === 0) {
        sprite = '/munin/base.png';
        const greetingKey = motivation && MOTIVATION_GREETING_KEYS[motivation]
            ? MOTIVATION_GREETING_KEYS[motivation]
            : 'firstVisit';
        message = t(greetingKey);
    } else if (getDaysSince(lastActiveDate) >= 3) {
        sprite = '/munin/pointing-sad.png';
        message = t('longTimeNoSee');
    } else if (currentStreak > 0) {
        sprite = '/munin/happy.png';
        message = currentStreak === 1
            ? t('activeStreakOne')
            : t('activeStreak', { days: currentStreak });
    } else {
        sprite = '/munin/happy.png';
        message = t('hasProgress');
    }

    // Convert exercise-based daily goal to XP (avg ~10 XP per exercise)
    const dailyXpGoal = dailyGoal * 10;
    const xpPercent = Math.min(100, Math.round((xpToday / dailyXpGoal) * 100));
    const goalComplete = xpToday >= dailyXpGoal;

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Crow sprite */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="shrink-0"
                >
                    <Image
                        src={sprite}
                        alt="Munin the crow"
                        width={150}
                        height={150}
                        className="h-[100px] sm:h-[150px] w-auto"
                        priority
                        unoptimized
                    />
                </motion.div>

                {/* Speech bubble + XP bar */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="flex-1 w-full"
                >
                    {/* Speech bubble */}
                    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
                        {/* Triangle pointer - visible only on desktop, points left toward crow */}
                        <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px]">
                            <div className="w-3.5 h-3.5 bg-white border-l border-b border-gray-200 rotate-45" />
                        </div>
                        {/* Triangle pointer - visible only on mobile, points up toward crow */}
                        <div className="sm:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[7px]">
                            <div className="w-3.5 h-3.5 bg-white border-l border-t border-gray-200 rotate-45" />
                        </div>

                        <p className="text-lg sm:text-xl font-bold text-gray-900">{message}</p>
                    </div>

                    {/* XP bar */}
                    <div className="mt-3 bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                {goalComplete ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Zap className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                )}
                                <span className="font-bold text-sm text-gray-900">{t('dailyGoalLabel')}</span>
                            </div>
                            <span className="text-sm font-bold">
                                <span className={goalComplete ? 'text-green-600' : 'text-gray-700'}>
                                    {xpToday}
                                </span>
                                <span className="text-gray-400"> / {dailyXpGoal} XP</span>
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={cn(
                                    'h-full rounded-full',
                                    goalComplete
                                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                                        : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                )}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
