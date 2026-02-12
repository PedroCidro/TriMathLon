'use client';

import { useState } from 'react';
import MathRenderer from './MathRenderer';
import { motion, AnimatePresence } from 'framer-motion';

type Step = {
    annotation: string;
    math: string;
};

export default function StepByStepSolution({ steps }: { steps: Step[] }) {
    const [revealedCount, setRevealedCount] = useState(0);

    const revealNext = () => {
        if (revealedCount < steps.length) {
            setRevealedCount(prev => prev + 1);
        }
    };

    const revealAll = () => {
        setRevealedCount(steps.length);
    };

    const allRevealed = revealedCount >= steps.length;

    return (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
            <span className="text-xs font-bold text-yellow-600 uppercase mb-4 block">
                Passo a Passo
            </span>

            {/* Stepper */}
            <div className="relative ml-1">
                <AnimatePresence>
                    {steps.slice(0, revealedCount).map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-4 mb-4 last:mb-0"
                        >
                            {/* Badge + line */}
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold flex items-center justify-center shrink-0">
                                    {i + 1}
                                </div>
                                {i < revealedCount - 1 && (
                                    <div className="w-0.5 flex-1 bg-yellow-200 mt-1" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 pb-1">
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    {step.annotation}
                                </p>
                                <div className="text-base text-yellow-900">
                                    <MathRenderer latex={step.math} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Buttons */}
            {!allRevealed && (
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={revealNext}
                        className="px-4 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg text-sm font-bold transition-colors"
                    >
                        Próximo Passo ({revealedCount + 1}/{steps.length})
                    </button>
                    <button
                        onClick={revealAll}
                        className="px-4 py-2 bg-white hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-bold transition-colors"
                    >
                        Ver Tudo
                    </button>
                </div>
            )}
        </div>
    );
}
