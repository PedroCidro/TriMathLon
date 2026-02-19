'use client';

import { useLocale } from 'next-intl';

const SVG_W = 280;
const SVG_H = 240;
const PAD = { top: 24, right: 20, bottom: 32, left: 36 };
const PW = SVG_W - PAD.left - PAD.right;
const PH = SVG_H - PAD.top - PAD.bottom;

const X_MIN = -0.5;
const X_MAX = 3;

const COLORS = {
    axis: '#94a3b8',
    grid: '#e2e8f0',
    fCurve: '#4A1D96',
    FCurve: '#7C3AED',
    text: '#334155',
    arrow: '#6B7280',
};

// f(x) = 2x
const fFn = (x: number) => 2 * x;
// F(x) = x^2
const FFn = (x: number) => x * x;

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

    const xTicks = [0, 1, 2];

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
            </svg>
        </div>
    );
}

export default function AntiderivativeGraph() {
    const locale = useLocale();
    const en = locale === 'en';

    return (
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-[#4A1D96] uppercase text-sm tracking-widest font-bold mb-2 text-center">
                {en ? 'Function and antiderivative' : 'Fun\u00e7\u00e3o e antiderivada'}
            </h3>
            <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">
                {en
                    ? 'f(x) = 2x is the derivative of F(x) = x\u00B2 — integration reverses this'
                    : 'f(x) = 2x \u00e9 a derivada de F(x) = x\u00B2 \u2014 a integra\u00e7\u00e3o inverte isso'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <PanelGraph
                    title="f(x) = 2x"
                    yMin={-1}
                    yMax={6}
                    fn={fFn}
                    color={COLORS.fCurve}
                    yTicks={[0, 2, 4, 6]}
                />

                {/* Arrow between panels */}
                <div className="flex flex-col items-center gap-1 shrink-0 py-2">
                    <svg width="48" height="40" viewBox="0 0 48 40" className="hidden sm:block">
                        {/* Right arrow: integrate */}
                        <line x1="4" y1="12" x2="38" y2="12" stroke={COLORS.FCurve} strokeWidth="2" />
                        <polygon points="38,6 48,12 38,18" fill={COLORS.FCurve} />
                        {/* Left arrow: differentiate */}
                        <line x1="44" y1="28" x2="10" y2="28" stroke={COLORS.fCurve} strokeWidth="2" />
                        <polygon points="10,22 0,28 10,34" fill={COLORS.fCurve} />
                    </svg>
                    <span className="text-[10px] font-bold text-[#7C3AED] hidden sm:block">
                        {en ? 'integrate' : 'integrar'} →
                    </span>
                    <span className="text-[10px] font-bold text-[#4A1D96] hidden sm:block">
                        ← {en ? 'differentiate' : 'derivar'}
                    </span>

                    {/* Vertical arrows for mobile */}
                    <svg width="40" height="48" viewBox="0 0 40 48" className="block sm:hidden">
                        <line x1="12" y1="4" x2="12" y2="38" stroke={COLORS.FCurve} strokeWidth="2" />
                        <polygon points="6,38 12,48 18,38" fill={COLORS.FCurve} />
                        <line x1="28" y1="44" x2="28" y2="10" stroke={COLORS.fCurve} strokeWidth="2" />
                        <polygon points="22,10 28,0 34,10" fill={COLORS.fCurve} />
                    </svg>
                    <span className="text-[10px] font-bold text-[#7C3AED] block sm:hidden">
                        ↓ {en ? 'integrate' : 'integrar'}
                    </span>
                    <span className="text-[10px] font-bold text-[#4A1D96] block sm:hidden">
                        ↑ {en ? 'differentiate' : 'derivar'}
                    </span>
                </div>

                <PanelGraph
                    title="F(x) = x²"
                    yMin={-0.5}
                    yMax={5}
                    fn={FFn}
                    color={COLORS.FCurve}
                    yTicks={[0, 1, 2, 3, 4]}
                />
            </div>
        </div>
    );
}
