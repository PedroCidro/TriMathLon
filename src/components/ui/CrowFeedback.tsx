'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface CrowFeedbackProps {
    type: 'correct' | 'wrong' | null;
    streak?: number;
}

const SPRITES: Record<string, string> = {
    correct: '/munin/congrats.png',
    wrong: '/munin/sad.png',
};

export default function CrowFeedback({ type, streak = 0 }: CrowFeedbackProps) {
    const boostedScale = streak >= 5 && type === 'correct' ? 1.15 : 1;

    return (
        <AnimatePresence>
            {type && (
                <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: boostedScale }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50 pointer-events-none"
                >
                    <Image
                        src={SPRITES[type]}
                        alt={type === 'correct' ? 'Correct!' : 'Wrong'}
                        width={80}
                        height={80}
                        className="h-[80px] w-auto drop-shadow-[0_4px_12px_rgba(139,92,246,0.35)]"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
