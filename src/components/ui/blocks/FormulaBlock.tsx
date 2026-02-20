'use client';

import type { ContentBlock } from '@/data/learn-content';
import MathRenderer from '@/components/ui/MathRenderer';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

export default function FormulaBlock({ block }: { block: ContentBlock }) {
    return (
        <div className="bg-purple-50 rounded-2xl p-5 sm:p-8 text-center border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2">
                {block.title || 'RESULTADO'}
            </h3>
            {block.latex && (
                <div className="py-4 sm:py-8">
                    <MathRenderer latex={block.latex} display className="text-[#1A1A2E] text-2xl [&_.katex]:text-[#1A1A2E]" />
                </div>
            )}
            {block.content && (
                <p className="text-sm text-[#4B5563] font-medium">{renderFormattedText(block.content)}</p>
            )}
        </div>
    );
}
