'use client';

import { useLocale } from 'next-intl';

const SVG_W = 200;
const SVG_H = 200;
const PAD = { top: 20, right: 16, bottom: 28, left: 28 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -0.5;
const X_MAX = 2.5;
const Y_MIN = -0.5;
const Y_MAX = 3.5;

const A = 1;
const L = 2;

const PANELS_PT: { eps: number; delta: number; label: string }[] = [
    { eps: 0.5, delta: 0.5, label: 'ε = 0,5' },
    { eps: 0.1, delta: 0.1, label: 'ε = 0,1' },
    { eps: 0.01, delta: 0.01, label: 'ε = 0,01' },
];

const PANELS_EN: { eps: number; delta: number; label: string }[] = [
    { eps: 0.5, delta: 0.5, label: 'ε = 0.5' },
    { eps: 0.1, delta: 0.1, label: 'ε = 0.1' },
    { eps: 0.01, delta: 0.01, label: 'ε = 0.01' },
];

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    text: '#334155',
    epsilonBand: 'rgba(34, 197, 94, 0.15)',
    epsilonLine: '#22c55e',
    deltaBand: 'rgba(59, 130, 246, 0.15)',
    deltaLine: '#3b82f6',
};

function Panel({ eps, delta, label }: { eps: number; delta: number; label: string }) {
    const toX = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
    const toY = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PH;

    return (
        <div className="flex-1 min-w-[160px]">
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full h-auto"
                role="img"
                aria-label={`Epsilon-delta com ${label}`}
            >
                {/* Epsilon band */}
                <rect
                    x={PAD.left} y={toY(L + eps)}
                    width={PW} height={toY(L - eps) - toY(L + eps)}
                    fill={COLORS.epsilonBand}
                />
                {/* Delta band */}
                <rect
                    x={toX(A - delta)} y={PAD.top}
                    width={toX(A + delta) - toX(A - delta)} height={PH}
                    fill={COLORS.deltaBand}
                />

                {/* ε dashed lines */}
                <line x1={PAD.left} y1={toY(L + eps)} x2={PAD.left + PW} y2={toY(L + eps)} stroke={COLORS.epsilonLine} strokeWidth={1} strokeDasharray="4,3" />
                <line x1={PAD.left} y1={toY(L - eps)} x2={PAD.left + PW} y2={toY(L - eps)} stroke={COLORS.epsilonLine} strokeWidth={1} strokeDasharray="4,3" />

                {/* δ dashed lines */}
                <line x1={toX(A - delta)} y1={PAD.top} x2={toX(A - delta)} y2={PAD.top + PH} stroke={COLORS.deltaLine} strokeWidth={1} strokeDasharray="4,3" />
                <line x1={toX(A + delta)} y1={PAD.top} x2={toX(A + delta)} y2={PAD.top + PH} stroke={COLORS.deltaLine} strokeWidth={1} strokeDasharray="4,3" />

                {/* Axes */}
                <line x1={PAD.left} y1={toY(0)} x2={PAD.left + PW} y2={toY(0)} stroke={COLORS.axis} strokeWidth={1} />
                <line x1={toX(0)} y1={PAD.top} x2={toX(0)} y2={PAD.top + PH} stroke={COLORS.axis} strokeWidth={1} />

                {/* Line y = x + 1 */}
                <line
                    x1={toX(X_MIN)} y1={toY(X_MIN + 1)}
                    x2={toX(X_MAX)} y2={toY(X_MAX + 1)}
                    stroke={COLORS.curve} strokeWidth={2} strokeLinecap="round"
                />

                {/* Open circle */}
                <circle cx={toX(1)} cy={toY(2)} r={3.5} fill="white" stroke={COLORS.curve} strokeWidth={1.5} />

                {/* Tick labels */}
                <text x={toX(0)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>0</text>
                <text x={toX(1)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>1</text>
                <text x={toX(2)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={9} fill={COLORS.text}>2</text>
                <text x={PAD.left - 6} y={toY(1) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>1</text>
                <text x={PAD.left - 6} y={toY(2) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>2</text>
                <text x={PAD.left - 6} y={toY(3) + 3} textAnchor="end" fontSize={9} fill={COLORS.text}>3</text>
            </svg>
            <p className="text-center text-sm font-bold text-[#7C3AED] mt-1">{label}</p>
            <p className="text-center text-xs text-[#6B7280]">δ = {label.replace('ε = ', '')}</p>
        </div>
    );
}

export default function EpsilonTriptych() {
    const locale = useLocale();
    const en = locale === 'en';
    const panels = en ? PANELS_EN : PANELS_PT;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Tightening the bands' : 'Apertando as faixas'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'The smaller ε gets, the smaller δ gets — but it always works'
                    : 'Quanto menor o ε, menor o δ — mas sempre funciona'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                {panels.map(p => (
                    <Panel key={p.label} eps={p.eps} delta={p.delta} label={p.label} />
                ))}
            </div>
        </div>
    );
}
