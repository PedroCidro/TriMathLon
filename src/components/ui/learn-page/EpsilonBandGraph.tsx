'use client';

import { useLocale } from 'next-intl';

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

const X_MIN = -1;
const X_MAX = 3;
const Y_MIN = -0.5;
const Y_MAX = 4;

const EPSILON = 0.5;
const L = 2; // limit value

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    text: '#334155',
    epsilonBand: 'rgba(34, 197, 94, 0.15)',
    epsilonLine: '#22c55e',
    limitLine: '#ef4444',
};

const toSvgX = (x: number) => PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const toSvgY = (y: number) => PADDING.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;

export default function EpsilonBandGraph() {
    const locale = useLocale();
    const en = locale === 'en';
    const xTicks = [-1, 0, 1, 2, 3];
    const yTicks = [0, 1, 2, 3, 4];

    // Line y = x + 1 endpoints
    const lineX1 = X_MIN;
    const lineX2 = X_MAX;

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'The epsilon band (ε)' : 'A faixa epsilon (ε)'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'Horizontal tolerance band around L = 2, with ε = 0.5'
                    : 'Faixa horizontal de tolerância ao redor de L = 2, com ε = 0,5'}
            </p>
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto max-w-[600px] mx-auto"
                role="img"
                aria-label={en ? 'Graph showing epsilon band around y = 2' : 'Gráfico mostrando faixa epsilon ao redor de y = 2'}
            >
                {/* Grid */}
                {xTicks.map(t => (
                    <line key={`gx-${t}`} x1={toSvgX(t)} y1={PADDING.top} x2={toSvgX(t)} y2={PADDING.top + PLOT_H} stroke={COLORS.grid} strokeWidth={1} />
                ))}
                {yTicks.map(t => (
                    <line key={`gy-${t}`} x1={PADDING.left} y1={toSvgY(t)} x2={PADDING.left + PLOT_W} y2={toSvgY(t)} stroke={COLORS.grid} strokeWidth={1} />
                ))}

                {/* Epsilon band (green) */}
                <rect
                    x={PADDING.left}
                    y={toSvgY(L + EPSILON)}
                    width={PLOT_W}
                    height={toSvgY(L - EPSILON) - toSvgY(L + EPSILON)}
                    fill={COLORS.epsilonBand}
                />

                {/* L + ε dashed line */}
                <line
                    x1={PADDING.left} y1={toSvgY(L + EPSILON)}
                    x2={PADDING.left + PLOT_W} y2={toSvgY(L + EPSILON)}
                    stroke={COLORS.epsilonLine} strokeWidth={1.5} strokeDasharray="6,4"
                />
                {/* L - ε dashed line */}
                <line
                    x1={PADDING.left} y1={toSvgY(L - EPSILON)}
                    x2={PADDING.left + PLOT_W} y2={toSvgY(L - EPSILON)}
                    stroke={COLORS.epsilonLine} strokeWidth={1.5} strokeDasharray="6,4"
                />
                {/* L line (red) */}
                <line
                    x1={PADDING.left} y1={toSvgY(L)}
                    x2={PADDING.left + PLOT_W} y2={toSvgY(L)}
                    stroke={COLORS.limitLine} strokeWidth={1} strokeDasharray="4,4"
                />

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

                {/* Line y = x + 1 */}
                <line
                    x1={toSvgX(lineX1)} y1={toSvgY(lineX1 + 1)}
                    x2={toSvgX(lineX2)} y2={toSvgY(lineX2 + 1)}
                    stroke={COLORS.curve} strokeWidth={2.5} strokeLinecap="round"
                />

                {/* Open circle at (1, 2) */}
                <circle cx={toSvgX(1)} cy={toSvgY(2)} r={5} fill="white" stroke={COLORS.curve} strokeWidth={2} />

                {/* Labels */}
                <text x={PADDING.left + PLOT_W + 4} y={toSvgY(L + EPSILON) + 4} fontSize={11} fontWeight="600" fill={COLORS.epsilonLine}>
                    L + ε
                </text>
                <text x={PADDING.left + PLOT_W + 4} y={toSvgY(L - EPSILON) + 4} fontSize={11} fontWeight="600" fill={COLORS.epsilonLine}>
                    L − ε
                </text>
                <text x={PADDING.left + PLOT_W + 4} y={toSvgY(L) + 4} fontSize={11} fontWeight="600" fill={COLORS.limitLine}>
                    L = 2
                </text>

                {/* ε label with bracket */}
                <text x={PADDING.left + 12} y={toSvgY(L) - 2} fontSize={12} fontWeight="700" fill={COLORS.epsilonLine}>
                    {en ? 'ε = 0.5' : 'ε = 0,5'}
                </text>
            </svg>
        </div>
    );
}
