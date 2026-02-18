'use client';

import { Trophy, Flame, Zap, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    ResponsiveContainer, Tooltip,
} from 'recharts';

type ModuleAccuracy = {
    module_id: string;
    accuracy: number;
    topics_practiced: number;
    topics_total: number;
};

interface ProfileClientProps {
    display_name: string;
    academic_level: string | null;
    institution: string | null;
    exercises_solved: number;
    current_streak: number;
    longest_streak: number;
    xp_total: number;
    module_accuracy: ModuleAccuracy[];
    blitz_bests: Record<string, number>;
}

const MODULE_COLORS: Record<string, { accent: string; bg: string; text: string }> = {
    limites: { accent: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700' },
    derivadas: { accent: 'border-[#7C3AED]', bg: 'bg-purple-50', text: 'text-[#7C3AED]' },
    aplicacoes: { accent: 'border-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    integrais: { accent: 'border-[#4A1D96]', bg: 'bg-purple-100', text: 'text-[#4A1D96]' },
};

const LEVEL_KEYS: Record<string, string> = {
    fundamental: 'levelFundamental',
    medio: 'levelMedio',
    graduacao: 'levelGraduacao',
    pos: 'levelPos',
    enthusiast: 'levelEnthusiast',
};

export default function ProfileClient({
    display_name,
    academic_level,
    institution,
    exercises_solved,
    current_streak,
    longest_streak,
    xp_total,
    module_accuracy,
    blitz_bests,
}: ProfileClientProps) {
    const t = useTranslations('Profile');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');

    const levelKey = academic_level ? LEVEL_KEYS[academic_level] : null;
    const levelLabel = levelKey ? t(levelKey) : null;

    const radarData = module_accuracy.map(m => ({
        module: tc(`${m.module_id}.title`),
        accuracy: m.accuracy,
    }));

    const hasAccuracy = module_accuracy.some(m => m.accuracy > 0);
    const hasBlitz = Object.keys(blitz_bests).length > 0;

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-4 sm:p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-[#7C3AED]">
                            {display_name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{display_name}</h1>
                    <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
                        {levelLabel && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                <GraduationCap className="w-4 h-4" />
                                {levelLabel}
                            </span>
                        )}
                        {institution && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                                <Building2 className="w-4 h-4" />
                                {institution}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-500">{t('exercisesLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{exercises_solved}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-500">{t('streakLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{current_streak}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-gray-500">{t('longestStreakLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{longest_streak}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-500">{t('xpLabel')}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{xp_total}</p>
                    </div>
                </div>

                {/* Radar Chart — Per-module accuracy */}
                {hasAccuracy && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('accuracyByModule')}</h2>
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
                            {module_accuracy.map(m => (
                                <span key={m.module_id} className="text-xs text-gray-500">
                                    {tc(`${m.module_id}.title`)}: {m.topics_practiced}/{m.topics_total}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blitz Records */}
                {hasBlitz && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-lg font-bold text-gray-900">{t('blitzRecords')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {module_accuracy.map((mod) => {
                                const best = blitz_bests[mod.module_id];
                                if (best === undefined) return null;
                                const colors = MODULE_COLORS[mod.module_id];
                                return (
                                    <div key={mod.module_id} className={cn("rounded-xl p-4 border-l-4", colors?.accent, colors?.bg)}>
                                        <p className={cn("text-sm font-bold", colors?.text)}>{tc(`${mod.module_id}.title`)}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{best}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{t('bestScoreLabel')}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {t('ctaTitle', { name: display_name })}
                    </h2>
                    <Link
                        href="/sign-up/[[...sign-up]]"
                        className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                    >
                        {t('ctaButton')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
