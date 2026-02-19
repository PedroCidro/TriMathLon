'use client';

import { useLocale } from 'next-intl';

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

const X_MIN = -1;
const X_MAX = 3;
const Y_MIN = -1.5;
const Y_MAX = 5;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    tangent: '#22c55e',
    text: '#334155',
    point: '#7C3AED',
    triangle: '#f59e0b',
};

const toSvgX = (x: number) => PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const toSvgY = (y: number) => PADDING.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;

// f(x) = x^2
const f = (x: number) => x * x;

export default function TangentLineGraph() {
    const locale = useLocale();
    const en = locale === 'en';

    const xTicks = [-1, 0, 1, 2, 3];
    const yTicks = [-1, 0, 1, 2, 3, 4, 5];

    // Parabola path
    const steps = 80;
    const pathPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = f(x);
        if (y >= Y_MIN && y <= Y_MAX) {
            pathPoints.push(`${toSvgX(x)},${toSvgY(y)}`);
        }
    }
    const parabolaPath = `M${pathPoints.join(' L')}`;

    // Tangent at x=1: y = 2x - 1, slope = 2
    const tangentX1 = -0.2;
    const tangentX2 = 2.5;
    const tangentY1 = 2 * tangentX1 - 1;
    const tangentY2 = 2 * tangentX2 - 1;

    // Slope triangle: from (1,1) go right 1 → (2,1), then up 2 → (2,3)
    const triX1 = 1, triY1 = 1;
    const triX2 = 2, triY2 = 1;
    const triX3 = 2, triY3 = 3;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Tangent line at x = 1' : 'Reta tangente em x = 1'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'The tangent touches the curve at exactly one point — slope = 2'
                    : 'A tangente toca a curva em exatamente um ponto \u2014 inclina\u00e7\u00e3o = 2'}
            </p>
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto max-w-[600px] mx-auto"
                role="img"
                aria-label={en ? 'Parabola with tangent line at x=1' : 'Par\u00e1bola com reta tangente em x=1'}
            >
                {/* Grid */}
                {xTicks.map(t => (
                    <line key={`gx-${t}`} x1={toSvgX(t)} y1={PADDING.top} x2={toSvgX(t)} y2={PADDING.top + PLOT_H} stroke={COLORS.grid} strokeWidth={1} />
                ))}
                {yTicks.map(t => (
                    <line key={`gy-${t}`} x1={PADDING.left} y1={toSvgY(t)} x2={PADDING.left + PLOT_W} y2={toSvgY(t)} stroke={COLORS.grid} strokeWidth={1} />
                ))}

                {/* Axes */}
                <line x1={PADDING.left} y1={toSvgY(0)} x2={PADDING.left + PLOT_W} y2={toSvgY(0)} stroke={COLORS.axis} strokeWidth={1.5} />
                <line x1={toSvgX(0)} y1={PADDING.top} x2={toSvgX(0)} y2={PADDING.top + PLOT_H} stroke={COLORS.axis} strokeWidth={1.5} />

                {/* Tick labels */}
                {xTicks.map(t => (
                    <text key={`xt-${t}`} x={toSvgX(t)} y={PADDING.top + PLOT_H + 20} textAnchor="middle" fontSize={11} fill={COLORS.text}>{t}</text>
                ))}
                {yTicks.map(t => (
                    <text key={`yt-${t}`} x={PADDING.left - 10} y={toSvgY(t) + 4} textAnchor="end" fontSize={11} fill={COLORS.text}>{t}</text>
                ))}

                {/* Parabola */}
                <path d={parabolaPath} fill="none" stroke={COLORS.curve} strokeWidth={2.5} strokeLinecap="round" />

                {/* Tangent line */}
                <line
                    x1={toSvgX(tangentX1)} y1={toSvgY(tangentY1)}
                    x2={toSvgX(tangentX2)} y2={toSvgY(tangentY2)}
                    stroke={COLORS.tangent} strokeWidth={2.5} strokeLinecap="round"
                />

                {/* Slope triangle */}
                <line x1={toSvgX(triX1)} y1={toSvgY(triY1)} x2={toSvgX(triX2)} y2={toSvgY(triY2)} stroke={COLORS.triangle} strokeWidth={1.5} strokeDasharray="5,3" />
                <line x1={toSvgX(triX2)} y1={toSvgY(triY2)} x2={toSvgX(triX3)} y2={toSvgY(triY3)} stroke={COLORS.triangle} strokeWidth={1.5} strokeDasharray="5,3" />

                {/* Triangle labels */}
                <text x={toSvgX(1.5)} y={toSvgY(triY1) + 16} textAnchor="middle" fontSize={11} fontWeight="600" fill={COLORS.triangle}>
                    {en ? 'run = 1' : '\u0394x = 1'}
                </text>
                <text x={toSvgX(triX2) + 14} y={toSvgY(2)} textAnchor="start" fontSize={11} fontWeight="600" fill={COLORS.triangle}>
                    {en ? 'rise = 2' : '\u0394y = 2'}
                </text>

                {/* Dashed projections to point (1,1) */}
                <line x1={toSvgX(1)} y1={toSvgY(0)} x2={toSvgX(1)} y2={toSvgY(1)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
                <line x1={toSvgX(0)} y1={toSvgY(1)} x2={toSvgX(1)} y2={toSvgY(1)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />

                {/* Tangent point */}
                <circle cx={toSvgX(1)} cy={toSvgY(1)} r={5} fill={COLORS.point} />

                {/* Labels */}
                <text x={toSvgX(1) - 10} y={toSvgY(1) - 10} fontSize={13} fontWeight="700" fill={COLORS.point}>(1, 1)</text>
                <text x={toSvgX(2.3)} y={toSvgY(tangentY2) - 8} fontSize={12} fontWeight="600" fill={COLORS.tangent}>y = 2x − 1</text>
                <text x={toSvgX(2.3)} y={toSvgY(f(2.3)) - 10} fontSize={13} fontWeight="600" fill={COLORS.curve}>f(x) = x²</text>

                {/* Slope label */}
                <text x={toSvgX(2.2)} y={toSvgY(1.6)} fontSize={12} fontWeight="700" fill={COLORS.triangle}>
                    {en ? 'slope = 2' : 'incl. = 2'}
                </text>
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-medium text-[#334155]">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: COLORS.curve }} />
                    f(x) = x²
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: COLORS.tangent }} />
                    {en ? 'Tangent line' : 'Reta tangente'}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: COLORS.triangle }} />
                    {en ? 'Slope triangle' : 'Tri\u00e2ngulo de inclina\u00e7\u00e3o'}
                </span>
            </div>
        </div>
    );
}
