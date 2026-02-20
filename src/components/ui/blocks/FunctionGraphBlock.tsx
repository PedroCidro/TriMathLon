'use client';

import { useMemo } from 'react';
import type { ContentBlock } from '@/data/learn-content';

const COLORS = {
    axis: '#94a3b8',       // slate-400
    grid: '#e2e8f0',       // slate-200
    curve: '#7C3AED',      // purple-600
    max: '#ef4444',        // red-500
    min: '#22c55e',        // green-500
    inflection: '#3b82f6', // blue-500
    text: '#334155',       // slate-700
    bg: '#faf5ff',         // purple-50
} as const;

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };

const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

function evaluateFn(fnStr: string, x: number): number {
    const fn = new Function('x', 'return ' + fnStr);
    return fn(x) as number;
}

function niceStep(range: number): number {
    const rough = range / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = rough / pow;
    if (norm <= 1) return pow;
    if (norm <= 2) return 2 * pow;
    if (norm <= 5) return 5 * pow;
    return 10 * pow;
}

export default function FunctionGraphBlock({ block }: { block: ContentBlock }) {
    const fnStr = block.fn;
    const [xMin, xMax] = block.domain ?? [-5, 5];
    const annotations = block.annotations ?? [];

    const { points, yMin, yMax } = useMemo(() => {
        if (!fnStr) return { points: [] as { x: number; y: number }[], yMin: -1, yMax: 1 };

        const numSamples = 300;
        const step = (xMax - xMin) / numSamples;
        const pts: { x: number; y: number }[] = [];

        for (let i = 0; i <= numSamples; i++) {
            const x = xMin + i * step;
            try {
                const y = evaluateFn(fnStr, x);
                if (isFinite(y)) pts.push({ x, y });
            } catch {
                // skip bad points
            }
        }

        let minY = Infinity;
        let maxY = -Infinity;
        for (const p of pts) {
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }
        for (const a of annotations) {
            if (a.y < minY) minY = a.y;
            if (a.y > maxY) maxY = a.y;
        }

        // Add 10% padding
        const range = maxY - minY || 2;
        const pad = range * 0.1;
        return { points: pts, yMin: minY - pad, yMax: maxY + pad };
    }, [fnStr, xMin, xMax, annotations]);

    if (!fnStr) return null;

    // Coordinate transforms
    const toSvgX = (x: number) => PADDING.left + ((x - xMin) / (xMax - xMin)) * PLOT_W;
    const toSvgY = (y: number) => PADDING.top + ((yMax - y) / (yMax - yMin)) * PLOT_H;

    // Build curve path
    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`)
        .join(' ');

    // Axis positions (clamped to plot area)
    const xAxisY = Math.max(yMin, Math.min(yMax, 0));
    const yAxisX = Math.max(xMin, Math.min(xMax, 0));

    // Grid ticks
    const xStep = niceStep(xMax - xMin);
    const yStep = niceStep(yMax - yMin);

    const xTicks: number[] = [];
    for (let t = Math.ceil(xMin / xStep) * xStep; t <= xMax; t += xStep) {
        xTicks.push(Math.round(t * 1000) / 1000);
    }

    const yTicks: number[] = [];
    for (let t = Math.ceil(yMin / yStep) * yStep; t <= yMax; t += yStep) {
        yTicks.push(Math.round(t * 1000) / 1000);
    }

    const dotColor = (type: 'max' | 'min' | 'inflection') => {
        if (type === 'max') return COLORS.max;
        if (type === 'min') return COLORS.min;
        return COLORS.inflection;
    };

    return (
        <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 border border-purple-100">
            {block.title && (
                <h3 className="text-[#7C3AED] uppercase text-sm tracking-widest font-bold mb-4 text-center">
                    {block.title}
                </h3>
            )}
            {block.content && (
                <p className="text-sm text-[#4B5563] font-medium mb-4 text-center">{block.content}</p>
            )}

            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto max-w-[600px] mx-auto"
                role="img"
                aria-label={`Gráfico de ${block.content || 'função'}`}
            >
                {/* Grid lines */}
                {xTicks.map((t) => (
                    <line
                        key={`gx-${t}`}
                        x1={toSvgX(t)} y1={PADDING.top}
                        x2={toSvgX(t)} y2={PADDING.top + PLOT_H}
                        stroke={COLORS.grid} strokeWidth={1}
                    />
                ))}
                {yTicks.map((t) => (
                    <line
                        key={`gy-${t}`}
                        x1={PADDING.left} y1={toSvgY(t)}
                        x2={PADDING.left + PLOT_W} y2={toSvgY(t)}
                        stroke={COLORS.grid} strokeWidth={1}
                    />
                ))}

                {/* X axis */}
                <line
                    x1={PADDING.left} y1={toSvgY(xAxisY)}
                    x2={PADDING.left + PLOT_W} y2={toSvgY(xAxisY)}
                    stroke={COLORS.axis} strokeWidth={1.5}
                />
                {/* Y axis */}
                <line
                    x1={toSvgX(yAxisX)} y1={PADDING.top}
                    x2={toSvgX(yAxisX)} y2={PADDING.top + PLOT_H}
                    stroke={COLORS.axis} strokeWidth={1.5}
                />

                {/* X tick labels */}
                {xTicks.map((t) => (
                    <text
                        key={`xt-${t}`}
                        x={toSvgX(t)} y={PADDING.top + PLOT_H + 20}
                        textAnchor="middle" fontSize={11} fill={COLORS.text}
                    >
                        {t}
                    </text>
                ))}
                {/* Y tick labels */}
                {yTicks.map((t) => (
                    <text
                        key={`yt-${t}`}
                        x={PADDING.left - 10} y={toSvgY(t) + 4}
                        textAnchor="end" fontSize={11} fill={COLORS.text}
                    >
                        {t}
                    </text>
                ))}

                {/* Function curve */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={COLORS.curve}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* Annotation dots and labels */}
                {annotations.map((a, i) => {
                    const cx = toSvgX(a.x);
                    const cy = toSvgY(a.y);
                    const color = dotColor(a.type);
                    // Place label above for minima, below for maxima/inflection at bottom
                    const labelAbove = a.type === 'min' || a.y < (yMin + yMax) / 2;
                    const labelY = labelAbove ? cy - 14 : cy + 20;

                    return (
                        <g key={`ann-${i}`}>
                            <circle
                                cx={cx} cy={cy} r={5}
                                fill={color} stroke="white" strokeWidth={2}
                            />
                            <text
                                x={cx} y={labelY}
                                textAnchor="middle" fontSize={11}
                                fontWeight="600" fill={color}
                            >
                                {a.label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            {annotations.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-medium">
                    {annotations.some(a => a.type === 'max') && (
                        <span className="flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.max }} />
                            Máximo local
                        </span>
                    )}
                    {annotations.some(a => a.type === 'min') && (
                        <span className="flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.min }} />
                            Mínimo local
                        </span>
                    )}
                    {annotations.some(a => a.type === 'inflection') && (
                        <span className="flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.inflection }} />
                            Ponto de inflexão
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
