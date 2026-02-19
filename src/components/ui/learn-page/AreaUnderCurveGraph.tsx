'use client';

import { useLocale } from 'next-intl';

const SVG_W = 340;
const SVG_H = 240;
const PAD = { top: 24, right: 20, bottom: 32, left: 36 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -0.3;
const X_MAX = 2.5;
const Y_MIN = -0.3;
const Y_MAX = 4.5;

const COLORS = {
    axis: '#94a3b8',
    curve: '#4A1D96',
    fill: 'rgba(74, 29, 150, 0.18)',
    text: '#334155',
};

const f = (x: number) => x * x;

export default function AreaUnderCurveGraph() {
    const locale = useLocale();
    const en = locale === 'en';

    const toX = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
    const toY = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PH;

    // Parabola path
    const steps = 60;
    const pathPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = f(x);
        if (y <= Y_MAX) pathPoints.push(`${toX(x)},${toY(y)}`);
    }
    const parabolaPath = `M${pathPoints.join(' L')}`;

    // Shaded area under curve from 0 to 2
    const areaSteps = 80;
    const areaPoints: string[] = [];
    for (let i = 0; i <= areaSteps; i++) {
        const x = (i / areaSteps) * 2;
        areaPoints.push(`${toX(x)},${toY(f(x))}`);
    }
    const areaPath = `M${toX(0)},${toY(0)} L${areaPoints.join(' L')} L${toX(2)},${toY(0)} Z`;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#4A1D96] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Area under a curve' : '\u00c1rea sob uma curva'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'The area under f(x) = x\u00B2 from 0 to 2 — not a simple shape'
                    : 'A \u00e1rea sob f(x) = x\u00B2 de 0 a 2 \u2014 n\u00e3o \u00e9 uma forma simples'}
            </p>
            <div className="flex justify-center">
                <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full max-w-[400px] h-auto"
                    role="img"
                    aria-label={en ? 'Area under x squared from 0 to 2' : '\u00c1rea sob x ao quadrado de 0 a 2'}
                >
                    {/* Shaded area */}
                    <path d={areaPath} fill={COLORS.fill} />

                    {/* Axes */}
                    <line x1={PAD.left} y1={toY(0)} x2={PAD.left + PW} y2={toY(0)} stroke={COLORS.axis} strokeWidth={1} />
                    <line x1={toX(0)} y1={PAD.top} x2={toX(0)} y2={PAD.top + PH} stroke={COLORS.axis} strokeWidth={1} />

                    {/* Tick labels */}
                    <text x={toX(0)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={10} fill={COLORS.text}>0</text>
                    <text x={toX(1)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={10} fill={COLORS.text}>1</text>
                    <text x={toX(2)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={10} fill={COLORS.text}>2</text>
                    <text x={PAD.left - 8} y={toY(1) + 4} textAnchor="end" fontSize={10} fill={COLORS.text}>1</text>
                    <text x={PAD.left - 8} y={toY(2) + 4} textAnchor="end" fontSize={10} fill={COLORS.text}>2</text>
                    <text x={PAD.left - 8} y={toY(4) + 4} textAnchor="end" fontSize={10} fill={COLORS.text}>4</text>

                    {/* Parabola */}
                    <path d={parabolaPath} fill="none" stroke={COLORS.curve} strokeWidth={2.5} strokeLinecap="round" />

                    {/* x axis label */}
                    <text x={PAD.left + PW} y={toY(0) + 24} textAnchor="end" fontSize={10} fontStyle="italic" fill={COLORS.text}>x</text>
                    {/* y axis label */}
                    <text x={toX(0) + 10} y={PAD.top + 4} fontSize={10} fontStyle="italic" fill={COLORS.text}>y</text>
                </svg>
            </div>
        </div>
    );
}
