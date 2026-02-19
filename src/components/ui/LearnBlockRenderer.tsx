'use client';

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MathRenderer from '@/components/ui/MathRenderer';
import type { ContentBlock } from '@/data/learn-content';
import IntuitionBlock from '@/components/ui/blocks/IntuitionBlock';
import FormulaBlock from '@/components/ui/blocks/FormulaBlock';
import ProofTimeline from '@/components/ui/blocks/ProofStepBlock';
import InsightBlock from '@/components/ui/blocks/InsightBlock';
import ExampleBlock from '@/components/ui/blocks/ExampleBlock';
import FunctionGraphBlock from '@/components/ui/blocks/FunctionGraphBlock';
import ScrollProgress from '@/components/ui/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

/** Renders mixed text + inline LaTeX (splits on $ delimiters) */
export function renderFormattedText(text: string): ReactNode {
    const parts = text.split('$');
    return (
        <>
            {parts.map((part, index) => {
                if (index % 2 === 0) {
                    return <span key={index}>{part}</span>;
                }
                // Use displaystyle for operators with limits so subscripts render below
                const needsDisplay = /\\(lim|sum|prod)(?![a-zA-Z])/.test(part);
                const latex = needsDisplay ? `\\displaystyle ${part}` : part;
                return <MathRenderer key={index} latex={latex} className="text-[#1A1A2E]" />;
            })}
        </>
    );
}

interface LearnBlockRendererProps {
    blocks: ContentBlock[];
    topicTitle: string;
    onSwitchToTrain: () => void;
}

export default function LearnBlockRenderer({ blocks, topicTitle, onSwitchToTrain }: LearnBlockRendererProps) {
    const t = useTranslations('Learn');
    const contentRef = useRef<HTMLDivElement>(null);
    const muninRef = useRef<HTMLDivElement>(null);
    const ctaButtonRef = useRef<HTMLButtonElement>(null);
    const [completed, setCompleted] = useState(false);

    const handleComplete = useCallback(() => setCompleted(true), []);

    // Group consecutive proof-step blocks into timeline clusters
    const groups: Array<{ type: 'single'; block: ContentBlock } | { type: 'timeline'; blocks: ContentBlock[] }> = [];

    for (const block of blocks) {
        if (block.type === 'proof-step') {
            const last = groups[groups.length - 1];
            if (last && last.type === 'timeline') {
                last.blocks.push(block);
            } else {
                groups.push({ type: 'timeline', blocks: [block] });
            }
        } else {
            groups.push({ type: 'single', block });
        }
    }

    // Block entrance animations
    useEffect(() => {
        if (!contentRef.current) return;

        const ctx = gsap.context(() => {
            const blockEls = contentRef.current!.querySelectorAll<HTMLElement>('[data-block]');

            blockEls.forEach((el) => {
                const blockType = el.getAttribute('data-block-type');
                const isFormula = blockType === 'formula';

                gsap.set(el, {
                    opacity: 0,
                    y: 16,
                    ...(isFormula && { scale: 0.96 }),
                });

                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    ...(isFormula && { scale: 1 }),
                    duration: 0.4,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        once: true,
                    },
                });
            });
        }, contentRef);

        return () => ctx.revert();
    }, [blocks]);

    // Completion CTA animations
    useEffect(() => {
        if (!completed) return;

        const tweens: gsap.core.Tween[] = [];

        // Treinar button pulse
        if (ctaButtonRef.current) {
            tweens.push(
                gsap.to(ctaButtonRef.current, {
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
                    duration: 1.5,
                    ease: 'power1.inOut',
                    repeat: -1,
                    yoyo: true,
                })
            );
        }

        // Munin bounce
        if (muninRef.current) {
            tweens.push(
                gsap.to(muninRef.current, {
                    y: -5,
                    duration: 2,
                    ease: 'power1.inOut',
                    repeat: -1,
                    yoyo: true,
                })
            );
        }

        return () => {
            tweens.forEach((tw) => tw.kill());
        };
    }, [completed]);

    return (
        <div ref={contentRef} className="max-w-3xl mx-auto px-4 sm:px-0">
            <ScrollProgress containerRef={contentRef} onComplete={handleComplete} />

            {/* Header: title + Munin */}
            <div className="flex items-start justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-black">
                    {topicTitle}
                </h2>
                <div ref={muninRef}>
                    <Image
                        src="/munin/bright.png"
                        alt="Munin"
                        width={110}
                        height={110}
                        className="shrink-0 -mt-2"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {groups.map((group, index) => {
                    if (group.type === 'timeline') {
                        return (
                            <div key={`timeline-${index}`} className="mt-2" data-block data-block-type="proof-timeline">
                                <ProofTimeline steps={group.blocks} />
                            </div>
                        );
                    }

                    const block = group.block;
                    const extraSpacing = (block.type === 'formula' || block.type === 'insight') ? 'my-2' : '';

                    return (
                        <div key={block.id} className={extraSpacing} data-block data-block-type={block.type}>
                            {block.type === 'intuition' && <IntuitionBlock block={block} />}
                            {block.type === 'formula' && <FormulaBlock block={block} />}
                            {block.type === 'insight' && <InsightBlock block={block} />}
                            {block.type === 'example' && <ExampleBlock block={block} />}
                            {block.type === 'graph' && <FunctionGraphBlock block={block} />}
                        </div>
                    );
                })}
            </div>

            {/* Practice CTA */}
            <div className="text-center py-12">
                <p className="text-lg font-bold text-[#1A1A2E] mb-4">{t('readyToPractice')}</p>
                <button
                    ref={ctaButtonRef}
                    onClick={onSwitchToTrain}
                    className="px-8 py-3 bg-[#7C3AED] text-white rounded-full font-bold hover:bg-[#6D28D9] transition-colors"
                >
                    {t('train')}
                </button>
            </div>
        </div>
    );
}
