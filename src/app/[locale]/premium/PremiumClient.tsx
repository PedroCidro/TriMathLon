'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowRight, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { curriculum } from '@/data/curriculum';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MathRenderer from '@/components/ui/MathRenderer';

const MODULE_COLORS: Record<string, { accent: string; bg: string; border: string; checkColor: string }> = {
    limites: { accent: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', checkColor: 'text-teal-600' },
    derivadas: { accent: 'text-[#7C3AED]', bg: 'bg-purple-50', border: 'border-purple-200', checkColor: 'text-[#7C3AED]' },
    aplicacoes: { accent: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', checkColor: 'text-emerald-600' },
    integrais: { accent: 'text-[#4A1D96]', bg: 'bg-purple-100', border: 'border-[#4A1D96]', checkColor: 'text-[#4A1D96]' },
};

const GRADIENT_THEMES: Record<string, string> = {
    limites: 'bg-gradient-to-br from-[#0D9488] to-[#115E59]',
    derivadas: 'bg-gradient-to-br from-[#7C3AED] to-[#4A1D96]',
    aplicacoes: 'bg-gradient-to-br from-[#059669] to-[#064E3B]',
    integrais: 'bg-gradient-to-br from-[#4A1D96] to-[#2D1B69]',
};

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

const INSTITUTION_ACCENTS: Record<string, { badge: string; badgeBg: string; badgeBorder: string }> = {
    usp: { badge: 'text-blue-700', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-200' },
    ufscar: { badge: 'text-red-700', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200' },
};

const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

type Plan = 'monthly' | 'lifetime';

interface PremiumClientProps {
    locale: string;
    institutionId: string | null;
    institutionName: string | null;
    premiumHeadline: string | null;
}

export default function PremiumClient({
    locale,
    institutionId,
    institutionName,
    premiumHeadline,
}: PremiumClientProps) {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan>('lifetime');
    const t = useTranslations('Premium');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');

    const isInternational = locale === 'en';
    const isInstitutional = !!institutionId;

    const monthlyPrice = isInternational
        ? '$9.99'
        : isInstitutional ? 'R$ 14,99' : 'R$ 19,99';
    const lifetimePrice = isInternational
        ? '$49.99'
        : isInstitutional ? 'R$ 99,99' : 'R$ 139,99';

    const accent = institutionId ? INSTITUTION_ACCENTS[institutionId] : null;

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale, plan: selectedPlan }),
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

    const premiumTopics = curriculum.map((mod) => ({
        ...mod,
        topics: mod.premiumModule ? mod.topics : mod.topics.slice(3),
    }));

    const ctaLabel = selectedPlan === 'monthly' ? t('subscribeMonthly') : t('subscribe');

    const PlanCards = () => (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto w-full">
            {/* Monthly card */}
            <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={cn(
                    "relative rounded-2xl border-2 p-4 sm:p-5 text-left transition-all",
                    selectedPlan === 'monthly'
                        ? "border-[#7C3AED] bg-purple-50/50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    {t('monthlyLabel')}
                </span>
                <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{monthlyPrice}</span>
                    <span className="text-sm text-gray-400 font-medium">/{tCommon('month')}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">{t('cancelAnytime')}</p>
            </button>

            {/* Lifetime card */}
            <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={cn(
                    "relative rounded-2xl border-2 p-4 sm:p-5 text-left transition-all",
                    selectedPlan === 'lifetime'
                        ? "border-[#7C3AED] bg-purple-50/50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <div className="absolute -top-3 right-3 bg-[#7C3AED] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {t('bestValue')}
                </div>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    {t('lifetimeLabel')}
                </span>
                <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{lifetimePrice}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">{t('payOnce')}</p>
            </button>
        </div>
    );

    const CtaButton = () => (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)] disabled:opacity-60 disabled:pointer-events-none"
        >
            {loading ? t('processing') : ctaLabel}
            {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image src="/logo-icon.png" alt="JustMathing Logo" width={261} height={271} className="h-10 sm:h-16 w-auto" />
                </Link>
            </nav>

            {/* Hero with Munin */}
            <section className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-8 sm:pt-16 pb-10 sm:pb-16">
                <motion.div {...fade(0)} className="max-w-3xl mx-auto w-full">
                    {/* Munin + speech bubble */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="shrink-0 order-2 sm:order-1"
                        >
                            <Image
                                src="/munin/bright.png"
                                alt="Munin"
                                width={150}
                                height={150}
                                className="h-[100px] sm:h-[140px] w-auto drop-shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                                unoptimized
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="order-1 sm:order-2 flex-1"
                        >
                            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
                                {/* Desktop pointer — points left toward crow */}
                                <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px]">
                                    <div className="w-3.5 h-3.5 bg-white border-l border-b border-gray-200 rotate-45" />
                                </div>
                                {/* Mobile pointer — points down toward crow */}
                                <div className="sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[7px]">
                                    <div className="w-3.5 h-3.5 bg-white border-r border-b border-gray-200 rotate-45" />
                                </div>
                                <p className="text-lg sm:text-xl font-bold text-gray-900">{t('heroBubble')}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Heading */}
                    <div className="text-center space-y-6">
                        {isInstitutional && accent && (
                            <div className={cn(
                                "inline-flex items-center px-4 py-2 rounded-full font-bold text-sm border",
                                accent.badge, accent.badgeBg, accent.badgeBorder
                            )}>
                                {premiumHeadline}
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                            {t('heroTitle')}
                        </h1>

                        <p className="text-xl text-gray-500 max-w-lg mx-auto">
                            {t('heroSubtitle')}
                        </p>

                        <div className="pt-4 space-y-6">
                            <PlanCards />
                            <CtaButton />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Module Showcase */}
            <section className="bg-[#F8F7F4] px-4 sm:px-6 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto">
                    <motion.h2 {...fade(0.1)} className="text-3xl font-bold text-gray-900 text-center mb-4">
                        {t('whatYouUnlock')}
                    </motion.h2>
                    <motion.p {...fade(0.15)} className="text-gray-500 text-center mb-12 text-lg">
                        {t('unlockSubtitle')}
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                        {premiumTopics.map((mod, idx) => {
                            const colors = MODULE_COLORS[mod.id];
                            const gradient = GRADIENT_THEMES[mod.id];
                            const PatternSvg = SVG_PATTERNS[mod.id];
                            const isFullModule = !!mod.premiumModule;

                            return (
                                <motion.div
                                    key={mod.id}
                                    {...fade(0.2 + idx * 0.1)}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                                >
                                    {/* Gradient header */}
                                    <div className={cn('relative h-24 flex items-center justify-center', gradient)}>
                                        {PatternSvg && <PatternSvg />}
                                        {isFullModule && (
                                            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                                                {t('fullModule')}
                                            </div>
                                        )}
                                        <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white/20">
                                            <div className="[&_.frac-line]:!border-none [&_.frac-line]:!bg-transparent [&_.frac-line]:!h-0 [&_.frac-line]:!min-h-0">
                                                <MathRenderer latex={mod.iconLatex} className="text-3xl text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topic list */}
                                    <div className="p-4">
                                        <h3 className={cn('font-bold text-base mb-3', colors.accent)}>
                                            {tc(`${mod.id}.title`)}
                                        </h3>
                                        <div className="space-y-2.5">
                                            {mod.topics.map((topic) => (
                                                <div key={topic.id} className="flex items-start gap-2.5">
                                                    <div className={cn('p-0.5 rounded-full mt-0.5 shrink-0', colors.bg)}>
                                                        <Check className={cn('w-3 h-3', colors.checkColor)} />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-sm leading-tight">{tc(`${topic.id}.title`)}</span>
                                                        <p className="text-gray-400 text-xs">{tc(`${topic.id}.description`)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Recognition mode card */}
                    <motion.div {...fade(0.6)} className="bg-white rounded-2xl border-2 border-gray-200 p-5 sm:p-8 max-w-2xl mx-auto">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-blue-50 rounded-xl">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{t('recognitionMode')}</h3>
                                <p className="text-gray-400 text-sm">{t('recognitionAvailability')}</p>
                            </div>
                        </div>
                        <p className="text-gray-500 ml-14">
                            {t('recognitionDesc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-4 sm:px-6 py-16 sm:py-20">
                <motion.div {...fade(0.1)} className="max-w-2xl mx-auto text-center space-y-6">
                    {/* Munin happy */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <Image
                            src="/munin/happy.png"
                            alt="Munin"
                            width={120}
                            height={120}
                            className="h-[80px] sm:h-[100px] w-auto mx-auto drop-shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                            unoptimized
                        />
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {t('bottomCtaTitle')}
                    </h2>
                    <p className="text-gray-500 text-lg">
                        {t('bottomCtaSubtitle')}
                    </p>

                    <PlanCards />
                    <CtaButton />
                </motion.div>
            </section>
        </div>
    );
}
