'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ContentBlock } from '@/data/learn-content';
import MathRenderer from '@/components/ui/MathRenderer';
import { renderFormattedText } from '@/components/ui/LearnBlockRenderer';

gsap.registerPlugin(ScrollTrigger);

export default function ProofTimeline({ steps }: { steps: ContentBlock[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            lineRefs.current.forEach((line) => {
                if (!line) return;

                gsap.set(line, {
                    scaleY: 0,
                    transformOrigin: 'top center',
                });

                gsap.to(line, {
                    scaleY: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 80%',
                        once: true,
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [steps]);

    return (
        <div ref={containerRef} className="flex flex-col gap-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                    {/* Left column: circle + connecting line */}
                    <div className="flex flex-col items-center w-12 shrink-0">
                        <div className="w-8 h-8 bg-[#7C3AED] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {step.stepNumber}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                ref={(el) => { lineRefs.current[index] = el; }}
                                className="w-1 flex-1 mt-1 rounded-full"
                                style={{ background: 'linear-gradient(to bottom, #7C3AED, #E9D5FF)' }}
                            />
                        )}
                    </div>

                    {/* Card content */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex-1 border border-gray-100">
                        <h4 className="text-[#7C3AED] uppercase text-sm tracking-widest font-medium mb-2">
                            Passo {step.stepNumber} {step.title ? `— ${step.title}` : ''}
                        </h4>
                        <div className="text-[#1A1A2E] text-base leading-relaxed">
                            {renderFormattedText(step.content)}
                        </div>
                        {step.latex && (
                            <div className="py-4 text-center">
                                <MathRenderer latex={step.latex} display className="text-[#1A1A2E] [&_.katex]:text-[#1A1A2E]" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
