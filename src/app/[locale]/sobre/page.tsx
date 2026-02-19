'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import MathRenderer from '@/components/ui/MathRenderer';
import LocaleToggle from '@/components/ui/LocaleToggle';
import { useTranslations } from 'next-intl';

const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

export default function SobrePage() {
    const t = useTranslations('About');
    const tLanding = useTranslations('Landing');

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Nav */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-400">Justmathing</span>
                </Link>
                <div className="flex items-center gap-6">
                    <LocaleToggle />
                    <Link
                        href="/sign-in/[[...sign-in]]"
                        className="hidden sm:flex font-bold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                        {tLanding('signIn')}
                    </Link>
                    <Link
                        href="/sign-up/[[...sign-up]]"
                        className="bg-blue-600 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                    >
                        {t('ctaButton')}
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
                    <motion.div {...fade(0)}>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-12"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('heroBack')}
                        </Link>
                    </motion.div>

                    <motion.h1
                        {...fade(0.1)}
                        className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8"
                    >
                        {t('heroTitle')}
                        <span className="text-blue-600">{t('heroHighlight')}</span>.
                    </motion.h1>

                    <motion.p
                        {...fade(0.2)}
                        className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
                    >
                        {t('heroSubtitle')}
                    </motion.p>
                </section>

                {/* Divider -- axiom line */}
                <motion.div
                    {...fade(0.3)}
                    className="max-w-3xl mx-auto px-6"
                >
                    <div className="border-t border-gray-100" />
                </motion.div>

                {/* The "Why" */}
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <motion.div {...fade(0.3)} className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-[#F8F7F4] mt-1">
                                <MathRenderer latex="\neq" className="text-3xl text-gray-300" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    {t('whyTitle')}
                                </h2>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    {t('whyDesc')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* The Method */}
                <section className="bg-[#F8F7F4]">
                    <div className="max-w-3xl mx-auto px-6 py-20">
                        <motion.div {...fade(0.4)} className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-white border border-gray-100 mt-1">
                                    <MathRenderer latex="\Rightarrow" className="text-3xl text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                        {t('methodTitle')}
                                    </h2>
                                    <p className="text-lg text-gray-500 leading-relaxed">
                                        {t('methodDesc')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* The Goal */}
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <motion.div {...fade(0.5)} className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-[#F8F7F4] mt-1">
                                <MathRenderer latex="\checkmark" className="text-3xl text-green-400 !overflow-hidden" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    {t('goalTitle')}
                                </h2>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    {t('goalDesc')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* CTA */}
                <section className="bg-[#F8F7F4] border-t border-gray-100">
                    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                        <motion.div {...fade(0.6)}>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {t('ctaTitle')}
                            </h2>
                            <p className="text-lg text-gray-400 mb-8">
                                {t('ctaSubtitle')}
                            </p>
                            <Link
                                href="/sign-up/[[...sign-up]]"
                                className="inline-flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                            >
                                {t('ctaButton')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
