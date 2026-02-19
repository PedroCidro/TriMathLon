'use client';

import { useLocale } from 'next-intl';

const SVG_W = 200;
const SVG_H = 200;
const PAD = { top: 20, right: 16, bottom: 28, left: 28 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -0.2;
const X_MAX = 2.3;
const Y_MIN = -0.2;
const Y_MAX = 4.5;

const COLORS = {
    axis: '#94a3b8',
    curve: '#4A1D96',
    rectFill: 'rgba(74, 29, 150, 0.15)',
    rectStroke: '#7C3AED',
    text: '#334155',
};

const f = (x: number) => x * x;

// Left Riemann sum for f on [0,2] with n rectangles
function leftRiemannSum(n: number): number {
    const dx = 2 / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += f(i * dx) * dx;
    }
    return sum;
}

const PANELS_PT = [
    { n: 4, label: 'n = 4' },
    { n: 10, label: 'n = 10' },
    { n: 30, label: 'n = 30' },
];

const PANELS_EN = [
    { n: 4, label: 'n = 4' },
    { n: 10, label: 'n = 10' },
    { n: 30, label: 'n = 30' },
];

function Panel({ n, label }: { n: number; label: string }) {
    const locale = useLocale();
    const en = locale === 'en';

    const toX = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
    const toY = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PH;

    const dx = 2 / n;
    const sum = leftRiemannSum(n);
    const sumLabel = en ? `sum = ${sum.toFixed(2)}` : `soma = ${sum.toFixed(2).replace('.', ',')}`;

    // Parabola path
    const steps = 50;
    const pathPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = f(x);
        if (y <= Y_MAX) pathPoints.push(`${toX(x)},${toY(y)}`);
    }
    const parabolaPath = `M${pathPoints.join(' L')}`;

    return (
        <div className="flex-1 min-w-[160px]">
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full h-auto"
                role="img"
                aria-label={`Riemann sum with ${label}`}
            >
                {/* Rectangles */}
                {Array.from({ length: n }, (_, i) => {
                    const x = i * dx;
                    const h = f(x);
                    if (h <= 0) return null;
                    return (
                        <rect
                            key={i}
                            x={toX(x)}
                            y={toY(h)}
                            width={toX(x + dx) - toX(x)}
                            height={toY(0) - toY(h)}
                            fill={COLORS.rectFill}
                            stroke={COLORS.rectStroke}
                            strokeWidth={n <= 10 ? 1 : 0.5}
                        />
                    );
                })}

                {/* Axes */}
                <line x1={PAD.left} y1={toY(0)} x2={PAD.left + PW} y2={toY(0)} stroke={COLORS.axis} strokeWidth={1} />
                <line x1={toX(0)} y1={PAD.top} x2={toX(0)} y2={PAD.top + PH} stroke={COLORS.axis} strokeWidth={1} />

                {/* Tick labels */}
                <text x={toX(0)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>0</text>
                <text x={toX(1)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>1</text>
                <text x={toX(2)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>2</text>
                <text x={PAD.left - 6} y={toY(1) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>1</text>
                <text x={PAD.left - 6} y={toY(4) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>4</text>

                {/* Parabola */}
                <path d={parabolaPath} fill="none" stroke={COLORS.curve} strokeWidth={2} strokeLinecap="round" />
            </svg>
            <p className="text-center text-sm font-bold text-[#4A1D96] mt-1">{label}</p>
            <p className="text-center text-xs text-[#6B7280]">{sumLabel}</p>
        </div>
    );
}

export default function RiemannSumTriptych() {
    const locale = useLocale();
    const en = locale === 'en';
    const panels = en ? PANELS_EN : PANELS_PT;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#4A1D96] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Riemann sums' : 'Somas de Riemann'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'More rectangles = better approximation (exact area = 8/3 \u2248 2.67)'
                    : 'Mais ret\u00e2ngulos = melhor aproxima\u00e7\u00e3o (\u00e1rea exata = 8/3 \u2248 2,67)'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                {panels.map(p => (
                    <Panel key={p.label} n={p.n} label={p.label} />
                ))}
            </div>
        </div>
    );
}
