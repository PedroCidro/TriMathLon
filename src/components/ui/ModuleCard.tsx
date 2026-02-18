'use client';

import { motion } from 'framer-motion';
import MathRenderer from '@/components/ui/MathRenderer';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Module } from '@/data/curriculum';

interface ModuleCardProps {
    module: Module;
    progressPercent: number;
    isLowestProgress: boolean;
    locale: string;
    toggleLabel?: string;
    onToggle?: () => void;
}

export const GRADIENT_THEMES: Record<string, string> = {
    limites: 'bg-gradient-to-br from-[#0D9488] to-[#115E59]',
    derivadas: 'bg-gradient-to-br from-[#7C3AED] to-[#4A1D96]',
    aplicacoes: 'bg-gradient-to-br from-[#059669] to-[#064E3B]',
    integrais: 'bg-gradient-to-br from-[#4A1D96] to-[#2D1B69]',
};

export function LimitesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            {/* Vertical dashed line: x = a */}
            <line x1="100" y1="5" x2="100" y2="115" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Horizontal dashed line: y = L */}
            <line x1="5" y1="40" x2="195" y2="40" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Left branch: curve swoops up steeply toward (100, 40) */}
            <path d="M5 100 C30 98 60 95 80 75 Q90 55 97 42" fill="none" stroke="white" strokeWidth="2.5" />
            {/* Right branch: curve drops down steeply from (100, 40) */}
            <path d="M103 38 Q110 25 120 18 C140 5 170 3 195 2" fill="none" stroke="white" strokeWidth="2.5" />
            {/* Open circle at the limit point */}
            <circle cx="100" cy="40" r="4" fill="none" stroke="white" strokeWidth="2" />
        </svg>
    );
}

export function DerivativasPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            {/* Single smooth curve */}
            <path d="M10 95 Q50 20 100 55 Q150 90 190 25" fill="none" stroke="white" strokeWidth="2.5" />
            {/* Tangent line touching at ~x=100 */}
            <line x1="45" y1="25" x2="155" y2="85" stroke="white" strokeWidth="2" />
            {/* Tangent point */}
            <circle cx="100" cy="55" r="3.5" fill="white" />
        </svg>
    );
}

export function IntegraisPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            {/* Area under curve */}
            <path d="M20 100 Q60 20 100 50 Q140 80 180 30 L180 100 Z" fill="white" />
            <path d="M20 100 Q60 20 100 50 Q140 80 180 30" fill="none" stroke="white" strokeWidth="2" />
        </svg>
    );
}

export function AplicacoesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 200 120">
            {/* Optimization curve with a clear maximum */}
            <path d="M10 100 Q50 95 80 70 Q100 10 120 70 Q150 95 190 100" fill="none" stroke="white" strokeWidth="2.5" />
            {/* Tangent line at maximum (horizontal) */}
            <line x1="70" y1="18" x2="130" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Maximum point */}
            <circle cx="100" cy="18" r="4" fill="white" />
            {/* Vertical dashed line from max to x-axis */}
            <line x1="100" y1="22" x2="100" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
    );
}

export const SVG_PATTERNS: Record<string, () => React.ReactNode> = {
    limites: LimitesPattern,
    derivadas: DerivativasPattern,
    aplicacoes: AplicacoesPattern,
    integrais: IntegraisPattern,
};

export default function ModuleCard({ module, progressPercent, isLowestProgress, toggleLabel, onToggle }: ModuleCardProps) {
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');

    const gradient = GRADIENT_THEMES[module.id] ?? GRADIENT_THEMES.derivadas;
    const PatternSvg = SVG_PATTERNS[module.id];

    return (
        <Link href={{ pathname: '/dashboard/[module]', params: { module: module.id } }} className="block">
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    'purple-mist rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm cursor-pointer',
                    isLowestProgress && 'animate-card-glow'
                )}
            >
                {/* Top gradient area */}
                <div className={cn('relative h-40 flex items-center justify-center', gradient)}>
                    {PatternSvg && <PatternSvg />}
                    {toggleLabel && onToggle && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
                            className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors backdrop-blur-sm"
                        >
                            {toggleLabel} &rarr;
                        </button>
                    )}
                    {/* LaTeX icon with circle bg */}
                    <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-white/20">
                        <div className="[&_.frac-line]:!border-none [&_.frac-line]:!bg-transparent [&_.frac-line]:!h-0 [&_.frac-line]:!min-h-0">
                            <MathRenderer latex={module.iconLatex} className="text-5xl text-white" />
                        </div>
                    </div>
                </div>

                {/* Bottom info area */}
                <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{tc(`${module.id}.title`)}</h2>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                            className="h-full rounded-full bg-purple-500"
                        />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-sm text-gray-400 font-medium">
                            {module.topics.length} {tCommon('topics').toLowerCase()}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            {progressPercent}%
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
