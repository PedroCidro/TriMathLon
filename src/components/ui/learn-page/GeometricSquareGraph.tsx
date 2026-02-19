'use client';

import { useLocale } from 'next-intl';

const SIZE = 300;
const PAD = 20;
const SQ = SIZE - PAD * 2;

const SHADES = [
    '#EDE9FE', // purple-100
    '#DDD6FE', // purple-200
    '#C4B5FD', // purple-300
    '#A78BFA', // purple-400
    '#8B5CF6', // purple-500
    '#7C3AED', // purple-600
];

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    fill: string;
}

function buildRects(): Rect[] {
    const rects: Rect[] = [];
    // Step 1: left half  (1/2)
    rects.push({ x: 0, y: 0, w: 0.5, h: 1, label: '1/2', fill: SHADES[0] });
    // Step 2: top-right quarter (1/4)
    rects.push({ x: 0.5, y: 0, w: 0.5, h: 0.5, label: '1/4', fill: SHADES[1] });
    // Step 3: bottom-right-left (1/8)
    rects.push({ x: 0.5, y: 0.5, w: 0.25, h: 0.5, label: '1/8', fill: SHADES[2] });
    // Step 4: bottom-right-right-top (1/16)
    rects.push({ x: 0.75, y: 0.5, w: 0.25, h: 0.25, label: '1/16', fill: SHADES[3] });
    // Step 5: bottom-right-right-bottom (1/32)
    rects.push({ x: 0.75, y: 0.75, w: 0.125, h: 0.25, label: '1/32', fill: SHADES[4] });
    // Step 6: tiny remainder
    rects.push({ x: 0.875, y: 0.75, w: 0.125, h: 0.25, label: '...', fill: SHADES[5] });
    return rects;
}

export default function GeometricSquareGraph() {
    const locale = useLocale();
    const en = locale === 'en';
    const rects = buildRects();

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Geometric Series' : 'Série Geométrica'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'Square of area 1 filled by halves: 1/2 + 1/4 + 1/8 + ... = 1'
                    : 'Quadrado de área 1 preenchido por metades: 1/2 + 1/4 + 1/8 + ... = 1'}
            </p>
            <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="w-full h-auto max-w-[300px] mx-auto"
                role="img"
                aria-label={en ? 'Square progressively filled by halves' : 'Quadrado preenchido progressivamente por metades'}
            >
                {/* Outer border */}
                <rect x={PAD} y={PAD} width={SQ} height={SQ} fill="white" stroke="#94a3b8" strokeWidth={1.5} rx={4} />

                {/* Filled regions */}
                {rects.map((r, i) => (
                    <g key={i}>
                        <rect
                            x={PAD + r.x * SQ}
                            y={PAD + r.y * SQ}
                            width={r.w * SQ}
                            height={r.h * SQ}
                            fill={r.fill}
                            stroke="#94a3b8"
                            strokeWidth={0.5}
                        />
                        {r.w * SQ > 20 && r.h * SQ > 20 && (
                            <text
                                x={PAD + (r.x + r.w / 2) * SQ}
                                y={PAD + (r.y + r.h / 2) * SQ + 4}
                                textAnchor="middle"
                                fontSize={r.w > 0.2 ? 14 : 10}
                                fontWeight="600"
                                fill="#4C1D95"
                            >
                                {r.label}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* Running total */}
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs font-medium text-[#6B7280]">
                {['0.5', '0.75', '0.875', '0.9375', '...', '→ 1'].map((v, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded border border-purple-100">
                        {v}
                    </span>
                ))}
            </div>
        </div>
    );
}
