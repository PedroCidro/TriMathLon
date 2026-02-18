'use client';

import type { ContentBlock } from '@/data/learn-content';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

export default function IntuitionBlock({ block }: { block: ContentBlock }) {
    return (
        <div className="bg-white rounded-2xl border-l-4 border-purple-400 shadow-sm p-8">
            <h3 className="text-purple-500 uppercase text-sm tracking-widest font-medium mb-4">
                {block.title || 'A INTUIÇÃO'}
            </h3>
            <div className="text-[#1A1A2E] text-lg leading-[1.8] max-w-[680px]">
                {block.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={i > 0 ? 'mt-4' : ''}>
                        {renderFormattedText(paragraph)}
                    </p>
                ))}
            </div>
        </div>
    );
}
