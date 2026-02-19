'use client';

import { useLocale } from 'next-intl';

const SVG_W = 280;
const SVG_H = 240;
const PAD = { top: 24, right: 20, bottom: 32, left: 36 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -2.5;
const X_MAX = 2.5;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    derivative: '#22c55e',
    text: '#334155',
};

// Color-matched points
const MATCH_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];
const MATCH_POINTS = [
    { x: -1.5, label: '' },
    { x: 0, label: '' },
    { x: 1.5, label: '' },
];

// f(x) = x^2
const f = (x: number) => x * x;
// f'(x) = 2x
const fp = (x: number) => 2 * x;

function PanelGraph({
    title,
    yMin,
    yMax,
    fn,
    color,
    yTicks,
}: {
    title: string;
    yMin: number;
    yMax: number;
    fn: (x: number) => number;
    color: string;
    yTicks: number[];
}) {
    const toX = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
    const toY = (y: number) => PAD.top + ((yMax - y) / (yMax - yMin)) * PH;

    // Curve path
    const steps = 60;
    const pathPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = fn(x);
        if (y >= yMin && y <= yMax) {
            pathPoints.push(`${toX(x)},${toY(y)}`);
        }
    }
    const curvePath = `M${pathPoints.join(' L')}`;

    const xTicks = [-2, -1, 0, 1, 2];

    return (
        <div className="flex-1 min-w-[240px]">
            <p className="text-center text-sm font-bold text-[#1A1A2E] mb-2">{title}</p>
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full h-auto"
                role="img"
                aria-label={title}
            >
                {/* Grid */}
                {xTicks.map(t => (
                    <line key={`gx-${t}`} x1={toX(t)} y1={PAD.top} x2={toX(t)} y2={PAD.top + PH} stroke={COLORS.grid} strokeWidth={1} />
                ))}
                {yTicks.map(t => (
                    <line key={`gy-${t}`} x1={PAD.left} y1={toY(t)} x2={PAD.left + PW} y2={toY(t)} stroke={COLORS.grid} strokeWidth={1} />
                ))}

                {/* Axes */}
                <line x1={PAD.left} y1={toY(0)} x2={PAD.left + PW} y2={toY(0)} stroke={COLORS.axis} strokeWidth={1} />
                <line x1={toX(0)} y1={PAD.top} x2={toX(0)} y2={PAD.top + PH} stroke={COLORS.axis} strokeWidth={1} />

                {/* Tick labels */}
                {xTicks.map(t => (
                    <text key={`xt-${t}`} x={toX(t)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={10} fill={COLORS.text}>{t}</text>
                ))}
                {yTicks.map(t => (
                    <text key={`yt-${t}`} x={PAD.left - 8} y={toY(t) + 4} textAnchor="end" fontSize={10} fill={COLORS.text}>{t}</text>
                ))}

                {/* Curve */}
                <path d={curvePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />

                {/* Color-matched points */}
                {MATCH_POINTS.map((pt, i) => {
                    const y = fn(pt.x);
                    if (y < yMin || y > yMax) return null;
                    return (
                        <circle
                            key={i}
                            cx={toX(pt.x)}
                            cy={toY(y)}
                            r={5}
                            fill={MATCH_COLORS[i]}
                            stroke="white"
                            strokeWidth={1.5}
                        />
                    );
                })}
            </svg>
        </div>
    );
}

export default function DerivativeFunctionGraph() {
    const locale = useLocale();
    const en = locale === 'en';

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Function vs. Derivative' : 'Fun\u00e7\u00e3o vs. Derivada'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'Same 3 points on both graphs — see how slope becomes value'
                    : 'Os mesmos 3 pontos em ambos os gr\u00e1ficos \u2014 veja como inclina\u00e7\u00e3o vira valor'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <PanelGraph
                    title="f(x) = x²"
                    yMin={-0.5}
                    yMax={5}
                    fn={f}
                    color={COLORS.curve}
                    yTicks={[0, 1, 2, 3, 4]}
                />
                <PanelGraph
                    title="f'(x) = 2x"
                    yMin={-4}
                    yMax={4}
                    fn={fp}
                    color={COLORS.derivative}
                    yTicks={[-4, -2, 0, 2, 4]}
                />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-medium text-[#334155]">
                {MATCH_POINTS.map((pt, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: MATCH_COLORS[i] }} />
                        x = {pt.x === 0 ? '0' : (en ? pt.x.toString() : pt.x.toString().replace('.', ','))}
                    </span>
                ))}
            </div>
        </div>
    );
}
