'use client';

import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { curriculum } from '@/data/curriculum';
import { limitesIntroSections, limitesIntroSectionsEn } from '@/data/learn-page/limites-intro';
import { derivadasIntroSections, derivadasIntroSectionsEn } from '@/data/learn-page/derivadas-intro';
import { integraisIntroSections, integraisIntroSectionsEn } from '@/data/learn-page/integrais-intro';
import SectionRenderer from '@/components/ui/learn-page/SectionRenderer';
import ScrollProgress from '@/components/ui/ScrollProgress';

interface LearnPageClientProps {
    moduleId: string;
}

export default function LearnPageClient({ moduleId }: LearnPageClientProps) {
    const t = useTranslations('LearnPage');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const locale = useLocale();
    const contentRef = useRef<HTMLDivElement>(null);
    const [, setCompleted] = useState(false);
    const handleComplete = useCallback(() => setCompleted(true), []);

    const moduleData = curriculum.find(m => m.id === moduleId);
    if (!moduleData) return null;

    const sections =
        moduleId === 'limites'
            ? (locale === 'en' ? limitesIntroSectionsEn : limitesIntroSections)
            : moduleId === 'derivadas'
                ? (locale === 'en' ? derivadasIntroSectionsEn : derivadasIntroSections)
                : moduleId === 'integrais'
                    ? (locale === 'en' ? integraisIntroSectionsEn : integraisIntroSections)
                    : [];

    return (
        <div ref={contentRef} className="min-h-screen bg-[#F8F7F4]">
            <ScrollProgress containerRef={contentRef} onComplete={handleComplete} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Back link */}
                <Link
                    href={{ pathname: '/dashboard/[module]', params: { module: moduleId } }}
                    className="inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] font-bold mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    {tCommon('back')}
                </Link>

                {/* Hero */}
                <header className="mb-10">
                    <div className="flex items-start justify-between mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] leading-tight max-w-[80%]">
                            {t(`${moduleId}.heroTitle`)}
                        </h1>
                        <Image
                            src="/munin/bright.png"
                            alt="Munin"
                            width={100}
                            height={100}
                            className="shrink-0 -mt-2"
                        />
                    </div>

                    {/* Epigraph */}
                    <blockquote className="border-l-4 border-[#7C3AED] bg-purple-50/40 rounded-r-xl pl-5 pr-4 py-4">
                        <p className="text-[#374151] italic text-base sm:text-lg leading-relaxed">
                            {t(`${moduleId}.epigraph`)}
                        </p>
                    </blockquote>
                </header>

                {/* Article content */}
                <SectionRenderer sections={sections} />

                {/* Bottom CTA: topic cards */}
                <div className="mt-16 mb-8">
                    <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
                        {t(`${moduleId}.ctaTitle`)}
                    </h2>
                    <p className="text-[#6B7280] mb-6">
                        {t(`${moduleId}.ctaSubtitle`)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {moduleData.topics.map(topic => (
                            <Link
                                key={topic.id}
                                href={{ pathname: '/dashboard/[module]/[method]', params: { module: moduleId, method: topic.id } }}
                                className="group p-4 bg-white border border-purple-100 rounded-xl hover:border-[#7C3AED]/30 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#1A1A2E] text-sm">
                                            {tc(`${topic.id}.title`)}
                                        </h3>
                                        <p className="text-[#6B7280] text-xs mt-0.5">
                                            {tc(`${topic.id}.description`)}
                                        </p>
                                    </div>
                                    <div className="ml-3 p-1.5 bg-purple-50 rounded-lg group-hover:bg-[#7C3AED] transition-colors">
                                        <Play className="w-3.5 h-3.5 text-[#7C3AED] fill-[#7C3AED] group-hover:text-white group-hover:fill-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
