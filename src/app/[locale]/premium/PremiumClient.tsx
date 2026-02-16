'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { curriculum } from '@/data/curriculum';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const MODULE_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
    derivadas: { accent: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    integrais: { accent: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    edos: { accent: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
};

const INSTITUTION_ACCENTS: Record<string, { badge: string; badgeBg: string; badgeBorder: string }> = {
    usp: { badge: 'text-blue-700', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-200' },
    ufscar: { badge: 'text-red-700', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200' },
};

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
        id: mod.id,
        topics: mod.topics.slice(3),
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
                        ? "border-blue-600 bg-blue-50/50 shadow-md"
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
                        ? "border-blue-600 bg-blue-50/50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <div className="absolute -top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
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

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image src="/logo-icon.png" alt="JustMathing Logo" width={261} height={271} className="h-10 sm:h-16 w-auto" />
                </Link>
            </nav>

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-16">
                <div className="max-w-2xl mx-auto text-center space-y-6">
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

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)] disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {loading ? t('processing') : ctaLabel}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </section>

            {/* What You Unlock */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        {t('whatYouUnlock')}
                    </h2>
                    <p className="text-gray-500 text-center mb-12 text-lg">
                        {t('unlockSubtitle')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {premiumTopics.map((mod) => {
                            const colors = MODULE_COLORS[mod.id];
                            return (
                                <div key={mod.id} className={`bg-white rounded-2xl border-2 ${colors.border} p-4 sm:p-6`}>
                                    <h3 className={`font-bold text-lg mb-5 ${colors.accent}`}>
                                        {tc(`${mod.id}.title`)}
                                    </h3>
                                    <div className="space-y-3">
                                        {mod.topics.map((topic) => (
                                            <div key={topic.id} className="flex items-start gap-3">
                                                <div className={`p-1 rounded-full ${colors.bg} mt-0.5 shrink-0`}>
                                                    <Check className={`w-3.5 h-3.5 ${colors.accent}`} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm">{tc(`${topic.id}.title`)}</span>
                                                    <p className="text-gray-400 text-xs">{tc(`${topic.id}.description`)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reconhecimento feature */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 sm:p-8 max-w-2xl mx-auto">
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
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-6 py-20">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <PlanCards />

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)] disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? t('processing') : ctaLabel}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </section>
        </div>
    );
}
