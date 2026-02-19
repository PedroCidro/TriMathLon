'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Lock, Zap, Swords, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { curriculum } from '@/data/curriculum';
import { useTranslations } from 'next-intl';
import ChallengeCreatorModal from './ChallengeCreatorModal';

interface ModuleClientProps {
    isPremium: boolean;
    topicProgress: Record<string, { attempts: number; correct: number; bestStreak: number; easyCount: number }>;
}

export default function ModuleClient({ isPremium, topicProgress }: ModuleClientProps) {
    const params = useParams();
    const t = useTranslations('Module');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const tChallenge = useTranslations('Challenge');
    const [showChallengeModal, setShowChallengeModal] = useState(false);

    const moduleId = typeof params.module === 'string' ? params.module : '';
    const moduleData = curriculum.find(m => m.id === moduleId);

    if (!moduleData) {
        return (
            <div className="min-h-screen bg-[#F8F7F4] p-12 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4">{t('notFound')}</h1>
                <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#6D28D9] font-bold">{tCommon('backToDashboard')}</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    {tCommon('backToArena')}
                </Link>

                {(() => {
                    const hasLearnPage = moduleId === 'limites';
                    const headerContent = (
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <Image
                                src="/munin/happy.png"
                                alt="Munin"
                                width={80}
                                height={80}
                                className="drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                            />
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-2">{tc(`${moduleData.id}.title`)}</h1>
                                <p className="text-[#6B7280] text-lg">{tc(`${moduleData.id}.description`)}</p>
                            </div>
                            {hasLearnPage && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 self-center sm:self-start">
                                    {t('learnBadge')}
                                </span>
                            )}
                        </div>
                    );

                    if (hasLearnPage) {
                        return (
                            <Link href={{ pathname: '/dashboard/[module]/learn', params: { module: moduleId } }}>
                                <header className="mb-12 bg-gradient-to-r from-purple-500/[0.15] via-purple-400/[0.08] to-transparent rounded-2xl p-6 sm:p-8 cursor-pointer hover:from-purple-500/[0.22] hover:shadow-lg transition-all">
                                    {headerContent}
                                </header>
                            </Link>
                        );
                    }

                    return (
                        <header className="mb-12 bg-gradient-to-r from-purple-500/[0.06] to-transparent rounded-2xl p-6 sm:p-8">
                            {headerContent}
                        </header>
                    );
                })()}

                {/* Blitz Mode Card */}
                <Link
                    href={{ pathname: '/dashboard/[module]/blitz', params: { module: moduleId } }}
                    className="block mb-4"
                >
                    <div className="purple-mist group relative p-6 bg-purple-50/30 border border-[rgba(139,92,246,0.12)] border-l-[3px] border-l-[#7C3AED] rounded-2xl cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <Zap className="w-6 h-6 text-[#7C3AED] fill-[#7C3AED]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1A1A2E]">{t('blitzMode')}</h3>
                                    <p className="text-[#6B7280] font-medium hidden sm:block">{t('blitzDesc')}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                                <Play className="w-3 h-3 fill-current" />
                                {tCommon('play')}
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Challenge a Friend Card */}
                <button
                    onClick={() => setShowChallengeModal(true)}
                    className="block mb-8 w-full text-left"
                >
                    <div className="amber-mist group relative p-6 bg-amber-50/30 border border-[rgba(245,166,35,0.12)] border-l-[3px] border-l-[#F5A623] rounded-2xl cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                    <Swords className="w-6 h-6 text-[#F5A623]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1A1A2E]">{tChallenge('challengeFriend')}</h3>
                                    <p className="text-[#6B7280] font-medium hidden sm:block">{tChallenge('challengeDesc')}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F5A623] bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                                <Play className="w-3 h-3 fill-current" />
                                {tCommon('play')}
                            </div>
                        </div>
                    </div>
                </button>

                {showChallengeModal && moduleData && (
                    <ChallengeCreatorModal
                        moduleData={moduleData}
                        onClose={() => setShowChallengeModal(false)}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleData.topics.map((topic, i) => {
                        const isLocked = (moduleData.premiumModule || i >= 3) && !isPremium;
                        const progress = topicProgress[topic.id];
                        const hasProgress = progress && progress.attempts > 0;
                        const streakProgress = Math.min((progress?.bestStreak ?? 0) / 6, 1);
                        const easyProgress = Math.min((progress?.easyCount ?? 0) / 12, 1);
                        const progressPercent = Math.round(Math.max(streakProgress, easyProgress) * 100);
                        const isComplete = progressPercent >= 100;

                        // Determine button label
                        let buttonLabel = tCommon('start');
                        if (isComplete) {
                            buttonLabel = tCommon('review');
                        } else if (hasProgress) {
                            buttonLabel = tCommon('continue');
                        }

                        return (
                            <Link
                                href={isLocked ? '/premium' : { pathname: '/dashboard/[module]/[method]', params: { module: moduleId, method: topic.id } }}
                                key={topic.id}
                                className={cn(
                                    'group relative p-6 bg-[rgba(139,92,246,0.02)] border border-[rgba(139,92,246,0.12)] border-l-[2px] border-l-[rgba(139,92,246,0.15)] rounded-2xl purple-mist',
                                    isLocked && 'opacity-70'
                                )}
                            >
                                {/* Completed badge */}
                                {isComplete && !isLocked && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-[#1A1A2E] mb-1">{tc(`${topic.id}.title`)}</h3>
                                        <p className="text-[#6B7280] font-medium text-sm mb-4">{tc(`${topic.id}.description`)}</p>

                                        {isLocked ? (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                <Lock className="w-3 h-3" />
                                                {tCommon('premium')}
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                                                <Play className="w-3 h-3 fill-current" />
                                                {buttonLabel}
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        'h-10 w-10 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shrink-0 ml-4',
                                        isLocked
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-purple-50 text-[#7C3AED]'
                                    )}>
                                        <MathRenderer latex={moduleData.iconLatex} className="font-bold text-lg" />
                                    </div>
                                </div>

                                {/* Progress bar at bottom of tile */}
                                {!isLocked && (
                                    <div className="mt-4 w-full bg-gray-100 h-[3px] rounded-full overflow-hidden">
                                        {hasProgress && (
                                            <div
                                                className={cn(
                                                    'h-full rounded-full',
                                                    isComplete
                                                        ? 'bg-[#22C55E]'
                                                        : 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]'
                                                )}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
