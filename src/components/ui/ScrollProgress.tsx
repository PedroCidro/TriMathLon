'use client';

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_DOTS = 20;
const DOT_SIZE = 6;
const DOT_GAP = 14;

const PURPLE = '#7C3AED';
const GLOW = 'rgba(139, 92, 246, 0.5)';
const GLOW_STRONG = 'rgba(139, 92, 246, 0.7)';
const GLOW_COMPLETE = 'rgba(139, 92, 246, 0.9)';

interface ScrollProgressProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onComplete: () => void;
}

export default function ScrollProgress({ containerRef, onComplete }: ScrollProgressProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const completionTlRef = useRef<gsap.core.Timeline | null>(null);
    const completedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current || !barRef.current) return;

        // Set initial dot styles
        dotRefs.current.forEach((dot) => {
            if (!dot) return;
            gsap.set(dot, {
                opacity: 0.3,
                backgroundColor: '#D1D5DB',
                boxShadow: 'none',
            });
        });

        // Create ScrollTrigger on the container
        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const progress = self.progress;

                dotRefs.current.forEach((dot, index) => {
                    if (!dot) return;
                    const threshold = index / TOTAL_DOTS;

                    if (threshold <= progress) {
                        const isFrontier = ((index + 1) / TOTAL_DOTS) > progress;
                        gsap.set(dot, {
                            opacity: 1,
                            backgroundColor: PURPLE,
                            boxShadow: isFrontier
                                ? `0 0 12px ${GLOW_STRONG}`
                                : `0 0 8px ${GLOW}`,
                        });
                    } else {
                        gsap.set(dot, {
                            opacity: 0.3,
                            backgroundColor: '#D1D5DB',
                            boxShadow: 'none',
                        });
                    }
                });

                // Completion at 95%
                if (progress >= 0.95 && !completedRef.current) {
                    completedRef.current = true;
                    onComplete();
                    triggerCompletionGlow();
                }
            },
        });

        function triggerCompletionGlow() {
            // Kill any existing timeline
            completionTlRef.current?.kill();

            const activeDots = dotRefs.current.filter(Boolean) as HTMLDivElement[];

            // Set all dots to full purple with enhanced glow
            activeDots.forEach((dot) => {
                gsap.set(dot, {
                    opacity: 1,
                    backgroundColor: PURPLE,
                    boxShadow: `0 0 14px ${GLOW_COMPLETE}`,
                });
            });

            // Create breathing pulse
            completionTlRef.current = gsap.timeline({ repeat: -1, yoyo: true });
            completionTlRef.current.to(activeDots, {
                boxShadow: `0 0 20px ${GLOW_COMPLETE}`,
                duration: 1.2,
                ease: 'power1.inOut',
                stagger: 0.03,
            });
        }

        return () => {
            scrollTriggerRef.current?.kill();
            completionTlRef.current?.kill();
        };
    }, [containerRef, onComplete]);

    return (
        <div
            ref={barRef}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
            style={{ gap: `${DOT_GAP}px` }}
        >
            {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => { dotRefs.current[i] = el; }}
                    className="rounded-full"
                    style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        backgroundColor: '#D1D5DB',
                        opacity: 0.3,
                        transition: 'none',
                    }}
                />
            ))}
        </div>
    );
}
