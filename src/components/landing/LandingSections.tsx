'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Dumbbell, Eye, BookOpen, Crown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import LocaleToggle from '@/components/ui/LocaleToggle';
import { GRADIENT_THEMES, SVG_PATTERNS } from '@/components/ui/ModuleCard';
import { curriculum } from '@/data/curriculum';

const MathRenderer = dynamic(() => import('../ui/MathRenderer'), { ssr: false });

/* ── Types ── */
type PublicStats = {
    top_students: { user_id: string; display_name: string; exercises_solved: number; position: number }[];
};

/* ── Framer helpers ── */
const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

const RANK_MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

/* ── Purple CTA button style ── */
const purpleCta = 'inline-flex items-center gap-2 font-bold rounded-full transition-all bg-[#7C3AED] text-white shadow-[0_4px_0_0_rgb(91,33,182)] active:shadow-none active:translate-y-[4px] hover:bg-[#6D28D9] hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(91,33,182)]';

/* ────────────────────────────────────────── */
export default function LandingSections() {
    const t = useTranslations('Landing');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const [stats, setStats] = useState<PublicStats | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/public/stats');
            if (res.ok) setStats(await res.json());
        } catch { /* silent */ }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
            {/* ── Nav ── */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center gap-2">
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link
                        href="/sobre"
                        className="hidden sm:flex font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href="/sign-in/[[...sign-in]]"
                        className="hidden sm:flex font-bold text-gray-900 hover:text-[#7C3AED] transition-colors"
                    >
                        {t('signIn')}
                    </Link>
                    <LocaleToggle />
                    <Link
                        href="/sign-up/[[...sign-up]]"
                        className={`${purpleCta} py-2.5 px-6 sm:py-3 sm:px-8 text-sm sm:text-base`}
                    >
                        {t('getStarted')}
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col">
                {/* ── Hero: Munin + Speech Bubble ── */}
                <section className="px-4 pt-6 sm:pt-12 pb-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                            {/* Munin sprite */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="shrink-0"
                            >
                                <Image
                                    src="/munin/bright.png"
                                    alt="Munin the crow"
                                    width={150}
                                    height={150}
                                    className="h-[100px] sm:h-[140px] w-auto drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                                    priority
                                    unoptimized
                                />
                            </motion.div>

                            {/* Speech bubble */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className="flex-1 w-full"
                            >
                                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-5 sm:px-7 sm:py-6">
                                    {/* Triangle pointer — desktop: points left toward crow */}
                                    <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px]">
                                        <div className="w-3.5 h-3.5 bg-white border-l border-b border-gray-200 rotate-45" />
                                    </div>
                                    {/* Triangle pointer — mobile: points up toward crow */}
                                    <div className="sm:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[7px]">
                                        <div className="w-3.5 h-3.5 bg-white border-l border-t border-gray-200 rotate-45" />
                                    </div>

                                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                                        {t('heroTitle')}<span className="text-[#7C3AED]">{t('heroHighlight')}</span>.
                                    </h1>
                                    <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                                        {t.rich('heroSubtitle', {
                                            em: (chunks) => <em>{chunks}</em>,
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero CTA */}
                        <motion.div {...fade(0.3)} className="text-center mt-8">
                            <Link
                                href="/sign-up/[[...sign-up]]"
                                className={`${purpleCta} text-lg px-10 py-4`}
                            >
                                {t('heroCtaFree')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ── Module Showcase ── */}
                <section className="px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fade(0.1)} className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                                {t('modulesTitle')}
                            </h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                                {t('modulesSubtitle')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {curriculum.map((mod, i) => {
                                const gradient = GRADIENT_THEMES[mod.id] ?? GRADIENT_THEMES.derivadas;
                                const PatternSvg = SVG_PATTERNS[mod.id];
                                return (
                                    <motion.div
                                        key={mod.id}
                                        {...fade(0.15 + i * 0.08)}
                                        className="purple-mist rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                                    >
                                        <div className={`relative h-32 flex items-center justify-center ${gradient}`}>
                                            {PatternSvg && <PatternSvg />}
                                            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                                                <MathRenderer latex={mod.iconLatex} className="text-3xl text-white" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {tc(`${mod.id}.title`)}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {mod.topics.length} {tCommon('topics').toLowerCase()}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── How it Works ── */}
                <section className="bg-white px-6 py-24">
                    <div className="max-w-5xl mx-auto">
                        <motion.div {...fade(0.1)}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                                {t('howItWorks')}
                            </h2>
                            <p className="text-gray-500 text-center text-lg mb-16 max-w-2xl mx-auto">
                                {t('howItWorksSubtitle')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                {
                                    icon: <BookOpen className="w-6 h-6 text-[#7C3AED]" />,
                                    title: t('modeLearn'),
                                    desc: t('modeLearnDesc'),
                                    color: 'bg-purple-50',
                                },
                                {
                                    icon: <Dumbbell className="w-6 h-6 text-green-600" />,
                                    title: t('modeTrain'),
                                    desc: t('modeTrainDesc'),
                                    color: 'bg-green-50',
                                },
                                {
                                    icon: <Eye className="w-6 h-6 text-amber-600" />,
                                    title: t('modeRecognize'),
                                    desc: t('modeRecognizeDesc'),
                                    color: 'bg-amber-50',
                                },
                            ].map((item, i) => (
                                <motion.div key={i} {...fade(0.15 + i * 0.1)} className="text-center">
                                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stats + Hall of Fame ── */}
                {stats && stats.top_students.length > 0 && (
                    <section className="px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            {/* Hall of Fame */}
                            <div>
                                <motion.div {...fade(0.3)}>
                                    <div className="text-center mb-10">
                                        <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                            <Crown className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                            {t('hallOfFame')}
                                        </h2>
                                        <p className="text-gray-500 text-lg">{t('hallOfFameSubtitle')}</p>
                                    </div>
                                </motion.div>

                                <div className="max-w-2xl mx-auto space-y-3">
                                    {stats.top_students.map((student, i) => (
                                        <motion.div key={student.user_id} {...fade(0.35 + i * 0.08)}>
                                            <Link
                                                href={`/profile/${student.user_id}` as '/'}
                                                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                                            >
                                                <span className="text-2xl w-8 text-center">
                                                    {i < 3 ? RANK_MEDALS[i] : `#${student.position}`}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900">{student.display_name}</p>
                                                </div>
                                                <span className="text-sm font-bold text-gray-500">
                                                    {student.exercises_solved.toLocaleString('pt-BR')} {t('exerciseCount')}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Bottom CTA ── */}
                <section className="px-6 py-24">
                    <motion.div {...fade(0.1)} className="max-w-2xl mx-auto text-center">
                        <Image
                            src="/munin/happy.png"
                            alt="Munin"
                            width={80}
                            height={80}
                            className="h-[64px] w-auto mx-auto mb-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] sm:h-[80px]"
                            unoptimized
                        />
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            {t('ctaTitle')}
                        </h2>
                        <p className="text-gray-500 text-lg mb-8">
                            {t('ctaSubtitle')}
                        </p>
                        <Link
                            href="/sign-up/[[...sign-up]]"
                            className={`${purpleCta} text-lg px-10 py-4`}
                        >
                            {t('ctaButton')}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
