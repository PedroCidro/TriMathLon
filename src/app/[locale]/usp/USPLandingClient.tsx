'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Target, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import MathRenderer from '@/components/ui/MathRenderer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { curriculum } from '@/data/curriculum';

const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

/* ── Gradient themes matching ModuleCard.tsx ── */
const GRADIENT_THEMES: Record<string, string> = {
    limites: 'bg-gradient-to-br from-[#0D9488] to-[#115E59]',
    derivadas: 'bg-gradient-to-br from-[#7C3AED] to-[#4A1D96]',
    aplicacoes: 'bg-gradient-to-br from-[#059669] to-[#064E3B]',
    integrais: 'bg-gradient-to-br from-[#4A1D96] to-[#2D1B69]',
};

/* ── SVG patterns matching ModuleCard.tsx ── */
function LimitesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            <line x1="100" y1="5" x2="100" y2="115" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            <line x1="5" y1="40" x2="195" y2="40" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            <path d="M5 100 C30 98 60 95 80 75 Q90 55 97 42" fill="none" stroke="white" strokeWidth="2.5" />
            <path d="M103 38 Q110 25 120 18 C140 5 170 3 195 2" fill="none" stroke="white" strokeWidth="2.5" />
            <circle cx="100" cy="40" r="4" fill="none" stroke="white" strokeWidth="2" />
        </svg>
    );
}
function DerivativasPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            <path d="M10 95 Q50 20 100 55 Q150 90 190 25" fill="none" stroke="white" strokeWidth="2.5" />
            <line x1="45" y1="25" x2="155" y2="85" stroke="white" strokeWidth="2" />
            <circle cx="100" cy="55" r="3.5" fill="white" />
        </svg>
    );
}
function IntegraisPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            <path d="M20 100 Q60 20 100 50 Q140 80 180 30 L180 100 Z" fill="white" />
            <path d="M20 100 Q60 20 100 50 Q140 80 180 30" fill="none" stroke="white" strokeWidth="2" />
        </svg>
    );
}
function AplicacoesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            <path d="M10 100 Q50 95 80 70 Q100 10 120 70 Q150 95 190 100" fill="none" stroke="white" strokeWidth="2.5" />
            <line x1="70" y1="18" x2="130" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            <circle cx="100" cy="18" r="4" fill="white" />
            <line x1="100" y1="22" x2="100" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
    );
}
const SVG_PATTERNS: Record<string, () => React.ReactNode> = {
    limites: LimitesPattern,
    derivadas: DerivativasPattern,
    aplicacoes: AplicacoesPattern,
    integrais: IntegraisPattern,
};

const STUDY_MODES = [
    { key: 'Learn' as const, icon: BookOpen, color: 'bg-purple-50 text-[#7C3AED]' },
    { key: 'Train' as const, icon: Target, color: 'bg-teal-50 text-teal-600' },
    { key: 'Recognize' as const, icon: Eye, color: 'bg-amber-50 text-amber-600' },
];

interface USPLandingClientProps {
    locale: string;
    isLoggedIn: boolean;
    isPremium: boolean;
}

export default function USPLandingClient({ locale, isLoggedIn, isPremium }: USPLandingClientProps) {
    const [loading, setLoading] = useState(false);
    const t = useTranslations('USP');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const tLanding = useTranslations('Landing');

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale, plan: 'usp-bixos' }),
            });

            if (!response.ok) {
                const body = await response.text();
                let message: string;
                try {
                    message = JSON.parse(body).error || `HTTP ${response.status}`;
                } catch {
                    message = `HTTP ${response.status}: ${body.slice(0, 200)}`;
                }
                throw new Error(message);
            }

            const { url, error } = await response.json();
            if (error) throw new Error(error);

            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            const message = err instanceof Error
                ? err.message
                : String(err) !== '[object Object]' ? String(err) : t('checkoutError');
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /* Generic page CTA — adapts label to auth state */
    const CTAButton = () => {
        const base = 'purple-mist inline-flex items-center gap-2 text-base px-8 py-3.5 font-bold rounded-full transition-all bg-[#7C3AED] text-white hover:bg-[#6D28D9]';

        if (isPremium) {
            return (
                <Link href="/dashboard" className={base}>
                    {t('heroCtaFree')}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            );
        }
        if (isLoggedIn) {
            return (
                <button onClick={handleCheckout} disabled={loading} className={`${base} disabled:opacity-60 disabled:pointer-events-none`}>
                    {loading ? t('processing') : t('dealCta')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            );
        }
        return (
            <Link href="/sign-up/[[...sign-up]]" className={base}>
                {t('heroCtaFree')}
                <ArrowRight className="w-5 h-5" />
            </Link>
        );
    };

    /* Hero CTA — shows "Começe já" */
    const HeroCTAButton = () => {
        const base = 'purple-mist inline-flex items-center gap-2 text-base px-8 py-3.5 font-bold rounded-full transition-all bg-[#7C3AED] text-white hover:bg-[#6D28D9]';

        if (isPremium) {
            return (
                <Link href="/dashboard" className={base}>
                    {t('heroCtaMain')}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            );
        }
        if (isLoggedIn) {
            return (
                <button onClick={handleCheckout} disabled={loading} className={`${base} disabled:opacity-60 disabled:pointer-events-none`}>
                    {loading ? t('processing') : t('heroCtaMain')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            );
        }
        return (
            <Link href="/sign-up/[[...sign-up]]" className={base}>
                {t('heroCtaMain')}
                <ArrowRight className="w-5 h-5" />
            </Link>
        );
    };

    /* Deal-card CTA — always shows "oferta bixo" label */
    const DealButton = () => {
        const base = 'purple-mist inline-flex items-center gap-2 text-base px-8 py-3.5 font-bold rounded-full transition-all bg-[#7C3AED] text-white hover:bg-[#6D28D9]';

        if (isLoggedIn && !isPremium) {
            return (
                <button onClick={handleCheckout} disabled={loading} className={`${base} disabled:opacity-60 disabled:pointer-events-none`}>
                    {loading ? t('processing') : t('dealCta')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            );
        }
        if (isPremium) {
            return (
                <Link href="/dashboard" className={base}>
                    {t('dealCta')}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            );
        }
        return (
            <Link href="/sign-up/[[...sign-up]]" className={base}>
                {t('dealCta')}
                <ArrowRight className="w-5 h-5" />
            </Link>
        );
    };

    /* Nav CTA — compact */
    const NavCTA = () => {
        const base = 'purple-mist inline-flex items-center gap-1.5 text-sm px-5 py-2 font-bold rounded-full transition-all bg-[#7C3AED] text-white hover:bg-[#6D28D9]';

        if (isPremium) {
            return (
                <Link href="/dashboard" className={base}>
                    {t('heroCtaFree')}
                </Link>
            );
        }
        if (isLoggedIn) {
            return (
                <button onClick={handleCheckout} disabled={loading} className={`${base} disabled:opacity-60 disabled:pointer-events-none`}>
                    {loading ? t('processing') : t('dealCta')}
                </button>
            );
        }
        return (
            <Link href="/sign-up/[[...sign-up]]" className={base}>
                {t('heroCtaFree')}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
            {/* Nav */}
            <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                <Link href="/" className="flex items-center">
                    <Image src="/logo-icon.png" alt="Logo" width={261} height={271} priority className="h-8 w-auto hue-rotate-[45deg]" />
                </Link>
                <div className="flex items-center gap-3">
                    {!isLoggedIn && (
                        <Link
                            href="/sign-in/[[...sign-in]]"
                            className="hidden sm:flex font-bold text-sm text-gray-600 hover:text-[#7C3AED] transition-colors"
                        >
                            {tLanding('signIn')}
                        </Link>
                    )}
                    <NavCTA />
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero — speech bubble + crow right */}
                <section className="px-4 pt-8 pb-6">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-end gap-3 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className="flex-1"
                            >
                                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
                                    {/* Triangle pointer → right toward crow */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[7px]">
                                        <div className="w-3.5 h-3.5 bg-white border-r border-t border-gray-200 rotate-45" />
                                    </div>

                                    <h1 className="text-xl font-bold text-gray-900 leading-tight sm:text-2xl">
                                        {t('heroTitle')}
                                        <span className="text-[#7C3AED]">{t('heroHighlight')}</span>.
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-500 leading-relaxed sm:text-base">
                                        {t('heroSubtitle')}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="shrink-0"
                            >
                                <Image
                                    src="/munin/pointing.png"
                                    alt="Munin the crow"
                                    width={150}
                                    height={150}
                                    className="h-[90px] w-auto drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] sm:h-[120px]"
                                    priority
                                    unoptimized
                                />
                            </motion.div>
                        </div>

                        {/* Hero CTA */}
                        <motion.div {...fade(0.3)} className="text-center">
                            <HeroCTAButton />
                        </motion.div>

                        {/* Made by badge */}
                        <motion.div {...fade(0.35)} className="mt-5 text-center">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] font-semibold text-sm">
                                {t('madeBy')}
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* Based on real exams */}
                <section className="px-4 pb-6">
                    <motion.div
                        {...fade(0.35)}
                        className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4"
                    >
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center mt-0.5">
                            <MathRenderer latex="\Sigma" className="text-xl text-[#7C3AED]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1 sm:text-lg">
                                {t('fromExams')}
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {t('fromExamsDesc')}
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Study Modes */}
                <section className="px-4 py-6">
                    <div className="max-w-lg mx-auto">
                        <motion.div {...fade(0.4)} className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 sm:text-2xl">
                                {t('whatIsTitle')}
                            </h2>
                            <p className="text-sm text-gray-500 sm:text-base">
                                {t('whatIsDesc')}
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-3">
                            {STUDY_MODES.map((mode, i) => {
                                const Icon = mode.icon;
                                const nameKey = `mode${mode.key}` as const;
                                const descKey = `mode${mode.key}Desc` as const;
                                return (
                                    <motion.div
                                        key={mode.key}
                                        {...fade(0.45 + i * 0.08)}
                                        className="purple-mist bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-start gap-4"
                                    >
                                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${mode.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 mb-0.5">
                                                {t(nameKey)}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {t(descKey)}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Modules — gradient cards */}
                <section className="px-4 py-6">
                    <div className="max-w-lg mx-auto">
                        <motion.div {...fade(0.6)} className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 sm:text-2xl">
                                {t('modulesTitle')}
                            </h2>
                            <p className="text-sm text-gray-500 sm:text-base">
                                {t('modulesSubtitle')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-3">
                            {curriculum.filter(mod => mod.id !== 'edos').map((mod, i) => {
                                const gradient = GRADIENT_THEMES[mod.id] ?? GRADIENT_THEMES.derivadas;
                                const PatternSvg = SVG_PATTERNS[mod.id];
                                return (
                                    <motion.div
                                        key={mod.id}
                                        {...fade(0.65 + i * 0.05)}
                                        className="purple-mist rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                                    >
                                        <div className={`relative h-20 flex items-center justify-center ${gradient} sm:h-24`}>
                                            {PatternSvg && <PatternSvg />}
                                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 sm:w-14 sm:h-14">
                                                <MathRenderer latex={mod.iconLatex} className="text-2xl text-white sm:text-3xl" />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-bold text-gray-900 mb-0.5 sm:text-base">
                                                {tc(`${mod.id}.title`)}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {mod.topics.length} {tCommon('topics').toLowerCase()}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Deal card */}
                <section className="px-4 py-6">
                    <motion.div
                        {...fade(0.8)}
                        className="max-w-lg mx-auto relative bg-white rounded-2xl border-2 border-[#7C3AED]/20 shadow-sm p-6 text-center overflow-hidden sm:p-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent pointer-events-none" />

                        <div className="relative">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] font-bold text-xs mb-5">
                                {t('dealLabel')}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-5 sm:text-2xl">
                                {t('dealTitle')}
                            </h2>

                            <div className="flex items-baseline justify-center gap-2 mb-1">
                                <span className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                    {t('dealPrice')}
                                </span>
                                <span className="text-lg text-gray-300 line-through">
                                    {t('dealOriginal')}
                                </span>
                            </div>

                            <p className="text-sm text-gray-400 mb-6">
                                {t('dealDesc')}
                            </p>

                            <div className="flex flex-col items-center gap-3">
                                <DealButton />
                                <Link
                                    href="/sign-up/[[...sign-up]]"
                                    className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {t('dealCtaFree')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Bottom CTA */}
                <section className="px-4 py-8 text-center">
                    <motion.div {...fade(0.9)} className="max-w-lg mx-auto">
                        <Image
                            src="/munin/happy.png"
                            alt="Munin"
                            width={80}
                            height={80}
                            className="h-[56px] w-auto mx-auto mb-3 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] sm:h-[72px]"
                            unoptimized
                        />
                        <h2 className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">
                            {t('ctaTitle')}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {t('ctaSubtitle')}
                        </p>
                        <CTAButton />
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
