'use client';

import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

interface BlockquoteBlockProps {
    text: string;
}

export default function BlockquoteBlock({ text }: BlockquoteBlockProps) {
    return (
        <blockquote className="border-l-4 border-[#7C3AED] bg-purple-50/40 rounded-r-xl pl-5 pr-4 py-4">
            <p className="text-[#374151] italic text-base leading-relaxed">
                {renderFormattedText(text)}
            </p>
        </blockquote>
    );
}
