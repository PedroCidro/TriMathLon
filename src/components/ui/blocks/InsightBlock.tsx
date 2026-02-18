'use client';

import type { ContentBlock } from '@/data/learn-content';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

export default function InsightBlock({ block }: { block: ContentBlock }) {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-l-4 border-amber-400 p-8">
            <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                    <h3 className="text-amber-600 uppercase text-sm tracking-widest font-medium mb-3">
                        {block.title || 'INSIGHT'}
                    </h3>
                    <div className="text-[#1A1A2E] text-lg font-medium leading-relaxed">
                        {renderFormattedText(block.content)}
                    </div>
                </div>
            </div>
        </div>
    );
}
