'use client';

import { useEffect, useRef, type ComponentType } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MathRenderer from '@/components/ui/MathRenderer';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';
import type { LearnSection } from '@/data/learn-page/limites-intro';
import TableBlock from './TableBlock';
import BlockquoteBlock from './BlockquoteBlock';
import LimitHoleGraph from './LimitHoleGraph';
import GeometricSquareGraph from './GeometricSquareGraph';
import EpsilonBandGraph from './EpsilonBandGraph';
import DeltaBandGraph from './DeltaBandGraph';
import EpsilonTriptych from './EpsilonTriptych';
import SecantToTangentGraph from './SecantToTangentGraph';
import SecantTriptych from './SecantTriptych';
import TangentLineGraph from './TangentLineGraph';
import DerivativeFunctionGraph from './DerivativeFunctionGraph';
import AreaUnderCurveGraph from './AreaUnderCurveGraph';
import RiemannSumTriptych from './RiemannSumTriptych';
import AntiderivativeGraph from './AntiderivativeGraph';

gsap.registerPlugin(ScrollTrigger);

const GRAPH_MAP: Record<string, ComponentType> = {
    'limit-hole': LimitHoleGraph,
    'geometric-square': GeometricSquareGraph,
    'epsilon-band': EpsilonBandGraph,
    'delta-band': DeltaBandGraph,
    'epsilon-triptych': EpsilonTriptych,
    'secant-to-tangent': SecantToTangentGraph,
    'secant-triptych': SecantTriptych,
    'tangent-line': TangentLineGraph,
    'derivative-function': DerivativeFunctionGraph,
    'area-under-curve': AreaUnderCurveGraph,
    'riemann-triptych': RiemannSumTriptych,
    'antiderivative-graph': AntiderivativeGraph,
};

/** Render bold markers ** ** as <strong> */
function renderWithBold(text: string) {
    // Split by ** markers
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return renderFormattedText(text);

    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 0
                    ? <span key={i}>{renderFormattedText(part)}</span>
                    : <strong key={i} className="font-bold text-[#1A1A2E]">{renderFormattedText(part)}</strong>
            )}
        </>
    );
}

function renderSection(section: LearnSection, index: number) {
    switch (section.type) {
        case 'heading':
            if (section.level === 2) {
                return (
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mt-4 border-l-[3px] border-[#7C3AED] pl-4">
                        {section.text}
                    </h2>
                );
            }
            return (
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mt-2">
                    {section.text}
                </h3>
            );

        case 'paragraph':
            return (
                <p className="text-[#374151] text-base sm:text-lg leading-relaxed">
                    {renderWithBold(section.text)}
                </p>
            );

        case 'display-math':
            return (
                <div className="py-3 px-4 flex justify-center overflow-x-auto bg-purple-50/30 rounded-xl border border-purple-100/50">
                    <MathRenderer latex={section.latex} display className="text-lg sm:text-xl text-[#1A1A2E]" />
                </div>
            );

        case 'table':
            return <TableBlock headers={section.headers} rows={section.rows} />;

        case 'blockquote':
            return <BlockquoteBlock text={section.text} />;

        case 'divider':
            return (
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/30" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
                </div>
            );

        case 'graph': {
            const GraphComponent = GRAPH_MAP[section.id];
            if (!GraphComponent) return null;
            return <GraphComponent />;
        }

        case 'callout':
            return (
                <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-xl p-5">
                    <p className="text-[#4C1D95] text-base sm:text-lg font-medium leading-relaxed text-center">
                        {renderWithBold(section.text)}
                    </p>
                </div>
            );

        case 'mascot-tip': {
            const variant = section.image ?? 'bright';
            return (
                <div className="flex gap-5 items-center bg-gradient-to-r from-[#7C3AED]/[0.08] to-purple-50/40 border border-[#7C3AED]/20 rounded-2xl p-5 sm:p-6">
                    <Image
                        src={`/munin/${variant}.png`}
                        alt="Munin"
                        width={96}
                        height={96}
                        className="shrink-0 -scale-x-100"
                    />
                    <p className="text-[#374151] text-base sm:text-lg leading-relaxed flex-1">
                        {renderWithBold(section.text)}
                    </p>
                </div>
            );
        }

        default:
            return null;
    }
}

interface SectionRendererProps {
    sections: LearnSection[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const els = containerRef.current!.querySelectorAll<HTMLElement>('[data-section]');
            els.forEach((el) => {
                gsap.set(el, { opacity: 0, y: 16 });
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        once: true,
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [sections]);

    return (
        <div ref={containerRef} className="flex flex-col gap-5">
            {sections.map((section, i) => (
                <div key={i} data-section data-section-type={section.type}>
                    {renderSection(section, i)}
                </div>
            ))}
        </div>
    );
}
