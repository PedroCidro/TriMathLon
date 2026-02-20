'use client';

import { useState } from 'react';
import MathRenderer from './MathRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Step = {
    annotation: string;
    math: string;
};

type Props = {
    steps: Step[];
    totalXP: number;
    onHintUsed: (hintsUsed: number) => void;
};

export default function StepByStepSolution({ steps, totalXP, onHintUsed }: Props) {
    const [revealedCount, setRevealedCount] = useState(0);
    const t = useTranslations('Method');

    const n = steps.length;
    const allRevealed = revealedCount >= n;
    const costPerHint = Math.floor(totalXP / n);

    const revealNext = () => {
        if (revealedCount < n) {
            const next = revealedCount + 1;
            setRevealedCount(next);
            onHintUsed(next);
        }
    };

    return (
        <div className="w-full mb-4">
            {/* Revealed steps */}
            <AnimatePresence>
                {steps.slice(0, revealedCount).map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mb-3"
                    >
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                            {/* Number badge */}
                            <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-amber-800 mb-1">
                                    {step.annotation}
                                </p>
                                <div className="text-base text-amber-900">
                                    <MathRenderer latex={step.math} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Hidden steps indicator */}
            {!allRevealed && revealedCount > 0 && (
                <div className="h-3 bg-gray-100 rounded-full mx-4 mb-3" />
            )}

            {/* Hint button */}
            {!allRevealed && (
                <button
                    onClick={revealNext}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-sm font-bold transition-colors"
                >
                    {t('hint')}
                    <span className="text-amber-600 text-xs">
                        {t('hintCost', { xp: costPerHint })}
                    </span>
                </button>
            )}
        </div>
    );
}
