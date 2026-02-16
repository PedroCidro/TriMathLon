'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, BookOpen, Lock, Zap, Swords } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { curriculum } from '@/data/curriculum';
import { useTranslations } from 'next-intl';
import ChallengeCreatorModal from './ChallengeCreatorModal';

export default function ModuleClient({ isPremium }: { isPremium: boolean }) {
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
            <div className="min-h-screen bg-gray-50 p-12 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
                <Link href="/dashboard" className="text-blue-600 hover:underline">{tCommon('backToDashboard')}</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    {tCommon('backToArena')}
                </Link>

                <header className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{tc(`${moduleData.id}.title`)}</h1>
                    <p className="text-gray-500 text-lg">{tc(`${moduleData.id}.description`)}</p>
                </header>

                {/* Blitz Mode Card */}
                <Link
                    href={{ pathname: '/dashboard/[module]/blitz', params: { module: moduleId } }}
                    className="block mb-8"
                >
                    <div className="group relative p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl transition-all hover:border-yellow-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                    <Zap className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{t('blitzMode')}</h3>
                                    <p className="text-gray-500 font-medium hidden sm:block">{t('blitzDesc')}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-yellow-600 group-hover:text-white transition-colors">
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
                    <div className="group relative p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl transition-all hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <Swords className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{tChallenge('challengeFriend')}</h3>
                                    <p className="text-gray-500 font-medium hidden sm:block">{tChallenge('challengeDesc')}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-orange-600 group-hover:text-white transition-colors">
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
                        const isLocked = i >= 3 && !isPremium;

                        return (
                            <Link
                                href={isLocked ? '/premium' : { pathname: '/dashboard/[module]/[method]', params: { module: moduleId, method: topic.id } }}
                                key={topic.id}
                                className={cn(
                                    "group relative p-6 bg-white border-2 rounded-2xl transition-all",
                                    isLocked
                                        ? "border-gray-100 opacity-75 cursor-not-allowed"
                                        : "border-gray-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{tc(`${topic.id}.title`)}</h3>
                                        <p className="text-gray-500 font-medium mb-4">{tc(`${topic.id}.description`)}</p>

                                        {isLocked ? (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                <Lock className="w-3 h-3" />
                                                {tCommon('premium')}
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Play className="w-3 h-3 fill-current" />
                                                {tCommon('start')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Using a generic icon or the module icon for topics since we don't have individual topic icons yet */}
                                    <div className="h-10 w-10 sm:h-14 sm:w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <MathRenderer latex={moduleData.iconLatex} className="font-bold text-lg" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
