'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ContentBlock } from '@/data/learn-content';
import MathRenderer from '@/components/ui/MathRenderer';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

export default function ExampleBlock({ block }: { block: ContentBlock }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations('Learn');

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-gray-400 uppercase text-sm tracking-widest font-medium mb-3">
                {block.title || 'EXEMPLO'}
            </h3>
            <div className="text-[#1A1A2E] text-lg font-bold mb-4">
                {renderFormattedText(block.content)}
            </div>

            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-[#7C3AED] font-bold text-sm hover:text-[#6D28D9] transition-colors"
            >
                {open ? t('hideSolution') : t('seeSolution')}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Collapsible solution */}
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pt-4">
                        <div className="border-l-4 border-[#22C55E] pl-4">
                            <span className="text-[#22C55E] uppercase text-sm tracking-widest font-medium block mb-2">
                                {t('solution')}
                            </span>
                            {block.solution && (
                                <p className="text-[#1A1A2E] text-base mb-3">
                                    {renderFormattedText(block.solution)}
                                </p>
                            )}
                            {block.solutionLatex && (
                                <div className="py-2">
                                    <MathRenderer latex={block.solutionLatex} display className="text-[#1A1A2E] [&_.katex]:text-[#1A1A2E]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
