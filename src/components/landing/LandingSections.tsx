'use client';

import { useRef, useState, useEffect, type RefObject } from 'react';
import { ArrowRight, Dumbbell, Eye, BookOpen, Zap } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const MathRenderer = dynamic(() => import('../ui/MathRenderer'), { ssr: false });

function useInView(ref: RefObject<HTMLElement | null>, threshold = 0.15) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return inView;
}

function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

export default function LandingSections() {
    const t = useTranslations('Landing');

    return (
        <>
            {/* Feature Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full px-4">
                {[
                    {
                        title: t('moduleDerivatives'),
                        desc: t('moduleDerivativesDesc'),
                        icon: <MathRenderer latex="\frac{d}{dx}" className="text-4xl text-blue-600 font-bold" />,
                    },
                    {
                        title: t('moduleIntegrals'),
                        desc: t('moduleIntegralsDesc'),
                        icon: <MathRenderer latex="\int" className="text-5xl text-purple-600 font-bold" />,
                    },
                    {
                        title: t('moduleODEs'),
                        desc: t('moduleODEsDesc'),
                        icon: <MathRenderer latex="\frac{dy}{dt}" className="text-3xl text-yellow-600 font-bold" />,
                    },
                ].map((item, i) => (
                    <FadeInSection key={i} delay={i * 0.1} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 sm:p-8 text-left group">
                        <div className="mb-6 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-2xl bg-gray-50/80 group-hover:bg-blue-50 transition-colors">
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                    </FadeInSection>
                ))}
            </div>

            {/* How it Works */}
            <section className="bg-gray-50 px-6 py-24 mt-24">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                        {t('howItWorks')}
                    </h2>
                    <p className="text-gray-500 text-center text-lg mb-16 max-w-2xl mx-auto">
                        {t('howItWorksSubtitle')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <BookOpen className="w-6 h-6 text-blue-600" />,
                                title: t('modeLearn'),
                                desc: t('modeLearnDesc'),
                                color: 'bg-blue-50',
                            },
                            {
                                icon: <Dumbbell className="w-6 h-6 text-green-600" />,
                                title: t('modeTrain'),
                                desc: t('modeTrainDesc'),
                                color: 'bg-green-50',
                            },
                            {
                                icon: <Eye className="w-6 h-6 text-purple-600" />,
                                title: t('modeRecognize'),
                                desc: t('modeRecognizeDesc'),
                                color: 'bg-purple-50',
                            },
                        ].map((item, i) => (
                            <FadeInSection key={i} delay={i * 0.1} className="text-center">
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's inside */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
                        {t('whatWeOffer')}
                    </h2>

                    <div className="space-y-12">
                        {[
                            { title: t('offer1Title'), desc: t('offer1Desc') },
                            { title: t('offer2Title'), desc: t('offer2Desc') },
                            { title: t('offer3Title'), desc: t('offer3Desc') },
                        ].map((item, i) => (
                            <FadeInSection key={i} delay={i * 0.1} className="flex gap-5">
                                <div className="mt-1.5 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-lg">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blitz Mode highlight */}
            <section className="bg-gray-50 px-6 py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {t('blitzMode')}
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
                        {t('blitzModeDesc')}
                    </p>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-6 py-24">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-gray-500 text-lg mb-8">
                        {t('ctaSubtitle')}
                    </p>
                    <Link
                        href="/sign-up/[[...sign-up]]"
                        className="inline-flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                    >
                        {t('ctaButton')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
