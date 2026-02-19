'use client';

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    text: '#334155',
    hole: '#7C3AED',
};

const X_MIN = -2;
const X_MAX = 4;
const Y_MIN = -1;
const Y_MAX = 5;

const toSvgX = (x: number) => PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const toSvgY = (y: number) => PADDING.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;

export default function LimitHoleGraph() {
    // y = x + 1 line
    const x1 = X_MIN;
    const x2 = X_MAX;
    const y1 = x1 + 1;
    const y2 = x2 + 1;

    // Grid ticks
    const xTicks = [-2, -1, 0, 1, 2, 3, 4];
    const yTicks = [-1, 0, 1, 2, 3, 4, 5];

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto max-w-[600px] mx-auto"
                role="img"
                aria-label="Gráfico de f(x) = x+1 com buraco aberto em (1, 2)"
            >
                {/* Grid */}
                {xTicks.map(t => (
                    <line key={`gx-${t}`} x1={toSvgX(t)} y1={PADDING.top} x2={toSvgX(t)} y2={PADDING.top + PLOT_H} stroke={COLORS.grid} strokeWidth={1} />
                ))}
                {yTicks.map(t => (
                    <line key={`gy-${t}`} x1={PADDING.left} y1={toSvgY(t)} x2={PADDING.left + PLOT_W} y2={toSvgY(t)} stroke={COLORS.grid} strokeWidth={1} />
                ))}

                {/* X axis */}
                <line x1={PADDING.left} y1={toSvgY(0)} x2={PADDING.left + PLOT_W} y2={toSvgY(0)} stroke={COLORS.axis} strokeWidth={1.5} />
                {/* Y axis */}
                <line x1={toSvgX(0)} y1={PADDING.top} x2={toSvgX(0)} y2={PADDING.top + PLOT_H} stroke={COLORS.axis} strokeWidth={1.5} />

                {/* Tick labels */}
                {xTicks.map(t => (
                    <text key={`xt-${t}`} x={toSvgX(t)} y={PADDING.top + PLOT_H + 20} textAnchor="middle" fontSize={11} fill={COLORS.text}>{t}</text>
                ))}
                {yTicks.map(t => (
                    <text key={`yt-${t}`} x={PADDING.left - 10} y={toSvgY(t) + 4} textAnchor="end" fontSize={11} fill={COLORS.text}>{t}</text>
                ))}

                {/* Line y = x + 1 (two segments, gap at x=1) */}
                <line
                    x1={toSvgX(x1)} y1={toSvgY(y1)}
                    x2={toSvgX(0.95)} y2={toSvgY(1.95)}
                    stroke={COLORS.curve} strokeWidth={2.5} strokeLinecap="round"
                />
                <line
                    x1={toSvgX(1.05)} y1={toSvgY(2.05)}
                    x2={toSvgX(x2)} y2={toSvgY(y2)}
                    stroke={COLORS.curve} strokeWidth={2.5} strokeLinecap="round"
                />

                {/* Open circle (hole) at (1, 2) */}
                <circle
                    cx={toSvgX(1)} cy={toSvgY(2)} r={6}
                    fill="white" stroke={COLORS.hole} strokeWidth={2.5}
                />


                {/* Dashed projection lines to hole */}
                <line
                    x1={toSvgX(0)} y1={toSvgY(2)}
                    x2={toSvgX(1)} y2={toSvgY(2)}
                    stroke={COLORS.hole} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6}
                />
                <line
                    x1={toSvgX(1)} y1={toSvgY(0)}
                    x2={toSvgX(1)} y2={toSvgY(2)}
                    stroke={COLORS.hole} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6}
                />
            </svg>
        </div>
    );
}
