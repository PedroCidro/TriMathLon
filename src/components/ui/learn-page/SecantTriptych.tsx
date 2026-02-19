'use client';

import { useLocale } from 'next-intl';

const SVG_W = 200;
const SVG_H = 200;
const PAD = { top: 20, right: 16, bottom: 28, left: 28 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -0.2;
const X_MAX = 2.8;
const Y_MIN = -0.2;
const Y_MAX = 5;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    secant: '#ef4444',
    tangent: '#22c55e',
    text: '#334155',
    point: '#7C3AED',
};

// f(x) = x^2
const f = (x: number) => x * x;

const PANELS_PT = [
    { h: 1, label: 'h = 1', slopeLabel: 'incl. = 3' },
    { h: 0.5, label: 'h = 0,5', slopeLabel: 'incl. = 2,5' },
    { h: 0.1, label: 'h = 0,1', slopeLabel: 'incl. = 2,1' },
];

const PANELS_EN = [
    { h: 1, label: 'h = 1', slopeLabel: 'slope = 3' },
    { h: 0.5, label: 'h = 0.5', slopeLabel: 'slope = 2.5' },
    { h: 0.1, label: 'h = 0.1', slopeLabel: 'slope = 2.1' },
];

function Panel({ h, label, slopeLabel }: { h: number; label: string; slopeLabel: string }) {
    const toX = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
    const toY = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PH;

    // Parabola path
    const steps = 50;
    const pathPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = f(x);
        if (y >= Y_MIN && y <= Y_MAX) {
            pathPoints.push(`${toX(x)},${toY(y)}`);
        }
    }
    const parabolaPath = `M${pathPoints.join(' L')}`;

    // P = (1, 1), Q = (1+h, (1+h)^2)
    const px = 1, py = 1;
    const qx = 1 + h, qy = f(1 + h);
    const slope = (qy - py) / (qx - px);

    // Secant line extended
    const lx1 = Math.max(X_MIN, px - 0.3);
    const lx2 = Math.min(X_MAX, qx + 0.3);
    const ly1 = py + slope * (lx1 - px);
    const ly2 = py + slope * (lx2 - px);

    return (
        <div className="flex-1 min-w-[160px]">
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full h-auto"
                role="img"
                aria-label={`Secant with ${label}`}
            >
                {/* Axes */}
                <line x1={PAD.left} y1={toY(0)} x2={PAD.left + PW} y2={toY(0)} stroke={COLORS.axis} strokeWidth={1} />
                <line x1={toX(0)} y1={PAD.top} x2={toX(0)} y2={PAD.top + PH} stroke={COLORS.axis} strokeWidth={1} />

                {/* Tick labels */}
                <text x={toX(0)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>0</text>
                <text x={toX(1)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>1</text>
                <text x={toX(2)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>2</text>
                <text x={PAD.left - 6} y={toY(1) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>1</text>
                <text x={PAD.left - 6} y={toY(2) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>2</text>
                <text x={PAD.left - 6} y={toY(4) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>4</text>

                {/* Parabola */}
                <path d={parabolaPath} fill="none" stroke={COLORS.curve} strokeWidth={2} strokeLinecap="round" />

                {/* Secant line */}
                <line
                    x1={toX(lx1)} y1={toY(ly1)}
                    x2={toX(lx2)} y2={toY(ly2)}
                    stroke={COLORS.secant} strokeWidth={1.5} strokeDasharray="6,3"
                />

                {/* Points P and Q */}
                <circle cx={toX(px)} cy={toY(py)} r={3.5} fill={COLORS.point} />
                <circle cx={toX(qx)} cy={toY(qy)} r={3.5} fill={COLORS.secant} />

                {/* P label */}
                <text x={toX(px) - 4} y={toY(py) + 14} fontSize={9} fontWeight="600" fill={COLORS.point}>P</text>
                {/* Q label */}
                <text x={toX(qx) + 5} y={toY(qy) - 5} fontSize={9} fontWeight="600" fill={COLORS.secant}>Q</text>
            </svg>
            <p className="text-center text-sm font-bold text-[#7C3AED] mt-1">{label}</p>
            <p className="text-center text-xs text-[#6B7280]">{slopeLabel}</p>
        </div>
    );
}

export default function SecantTriptych() {
    const locale = useLocale();
    const en = locale === 'en';
    const panels = en ? PANELS_EN : PANELS_PT;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Secant approaching tangent' : 'Secante se aproximando da tangente'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'As h shrinks, the secant slope approaches 2 (the derivative)'
                    : 'Conforme h diminui, a inclina\u00e7\u00e3o da secante se aproxima de 2 (a derivada)'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                {panels.map(p => (
                    <Panel key={p.label} h={p.h} label={p.label} slopeLabel={p.slopeLabel} />
                ))}
            </div>
        </div>
    );
}
