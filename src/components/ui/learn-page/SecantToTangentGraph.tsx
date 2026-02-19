'use client';

import { useLocale } from 'next-intl';

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

const X_MIN = -0.5;
const X_MAX = 3.5;
const Y_MIN = -0.5;
const Y_MAX = 7;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    curve: '#7C3AED',
    secant: '#ef4444',
    text: '#334155',
    point: '#7C3AED',
};

const toSvgX = (x: number) => PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const toSvgY = (y: number) => PADDING.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;

// f(x) = x^2
const f = (x: number) => x * x;

export default function SecantToTangentGraph() {
    const locale = useLocale();
    const en = locale === 'en';

    const xTicks = [0, 1, 2, 3];
    const yTicks = [0, 1, 2, 3, 4, 5, 6];

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

    // P = (1, 1), Q = (2.5, 6.25)
    const px = 1, py = f(1);       // (1, 1)
    const qx = 2.5, qy = f(2.5);  // (2.5, 6.25)

    // Secant line: slope = (qy - py) / (qx - px) = 5.25 / 1.5 = 3.5
    const secSlope = (qy - py) / (qx - px);
    const secLineX1 = 0.3;
    const secLineX2 = 3.2;
    const secLineY1 = py + secSlope * (secLineX1 - px);
    const secLineY2 = py + secSlope * (secLineX2 - px);

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Secant line through P and Q' : 'Reta secante por P e Q'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'f(x) = x\u00B2 with secant through P(1, 1) and Q(2.5, 6.25)'
                    : 'f(x) = x\u00B2 com secante por P(1, 1) e Q(2,5; 6,25)'}
            </p>
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto max-w-[600px] mx-auto"
                role="img"
                aria-label={en ? 'Parabola with secant line' : 'Par\u00e1bola com reta secante'}
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

                {/* Secant line */}
                <line
                    x1={toSvgX(secLineX1)} y1={toSvgY(secLineY1)}
                    x2={toSvgX(secLineX2)} y2={toSvgY(secLineY2)}
                    stroke={COLORS.secant} strokeWidth={2} strokeDasharray="8,4"
                />

                {/* Dashed projections for P */}
                <line x1={toSvgX(px)} y1={toSvgY(0)} x2={toSvgX(px)} y2={toSvgY(py)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
                <line x1={toSvgX(0)} y1={toSvgY(py)} x2={toSvgX(px)} y2={toSvgY(py)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />

                {/* Dashed projections for Q */}
                <line x1={toSvgX(qx)} y1={toSvgY(0)} x2={toSvgX(qx)} y2={toSvgY(qy)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
                <line x1={toSvgX(0)} y1={toSvgY(qy)} x2={toSvgX(qx)} y2={toSvgY(qy)} stroke={COLORS.point} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />

                {/* Points */}
                <circle cx={toSvgX(px)} cy={toSvgY(py)} r={5} fill={COLORS.point} />
                <circle cx={toSvgX(qx)} cy={toSvgY(qy)} r={5} fill={COLORS.secant} />

                {/* Labels */}
                <text x={toSvgX(px) - 12} y={toSvgY(py) - 10} fontSize={13} fontWeight="700" fill={COLORS.point}>P(1, 1)</text>
                <text x={toSvgX(qx) + 8} y={toSvgY(qy) - 8} fontSize={13} fontWeight="700" fill={COLORS.secant}>
                    {en ? 'Q(2.5, 6.25)' : 'Q(2,5; 6,25)'}
                </text>

                {/* Slope label */}
                <text x={toSvgX(2.1)} y={toSvgY(2.8)} fontSize={12} fontWeight="600" fill={COLORS.secant}>
                    {en ? 'slope = 3.5' : 'incl. = 3,5'}
                </text>

                {/* f(x) label */}
                <text x={toSvgX(2.7)} y={toSvgY(f(2.7)) - 10} fontSize={13} fontWeight="600" fill={COLORS.curve}>f(x) = x²</text>
            </svg>
        </div>
    );
}
