'use client';

import { ArrowLeft, Trophy, Flame, Zap, Target, BarChart3, TrendingUp, TrendingDown, Award } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { curriculum } from '@/data/curriculum';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    PieChart, Pie,
} from 'recharts';

type MasteryRow = {
    subcategory: string;
    attempts: number;
    correct: number;
    wrong_count: number;
    avg_self_rating: number | null;
    best_streak: number;
    last_practiced: string | null;
};

interface StatsClientProps {
    exercisesSolved: number;
    currentStreak: number;
    longestStreak: number;
    xpTotal: number;
    mastery: MasteryRow[];
}

const RATING_LABELS: Record<number, string> = {
    1: 'Errei',
    2: 'Difícil',
    3: 'Bom',
    4: 'Fácil',
};

const MODULE_COLORS: Record<string, { accent: string; bg: string; text: string; fill: string }> = {
    derivadas: { accent: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', fill: '#3b82f6' },
    integrais: { accent: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', fill: '#8b5cf6' },
    edos: { accent: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', fill: '#eab308' },
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function getAccuracy(correct: number, attempts: number): number {
    if (attempts === 0) return 0;
    return Math.round((correct / attempts) * 100);
}

function findTopicTitle(subcategory: string): string {
    for (const mod of curriculum) {
        const topic = mod.topics.find(t => t.id === subcategory);
        if (topic) return topic.title;
    }
    return subcategory;
}

function findModuleForTopic(subcategory: string): string {
    for (const mod of curriculum) {
        if (mod.topics.some(t => t.id === subcategory)) return mod.id;
    }
    return 'derivadas';
}

const TOTAL_TOPICS = curriculum.reduce((sum, m) => sum + m.topics.length, 0);

export default function StatsClient({
    exercisesSolved,
    currentStreak,
    longestStreak,
    xpTotal,
    mastery,
}: StatsClientProps) {
    const masteryMap = new Map(mastery.map(m => [m.subcategory, m]));
    const practicedMastery = mastery.filter(m => m.attempts > 0);
    const topicsPracticed = practicedMastery.length;

    // Insights: only topics with >= 3 attempts qualify
    const qualifiedTopics = mastery.filter(m => m.attempts >= 3);

    const weakestTopic = qualifiedTopics.length > 0
        ? qualifiedTopics.reduce((worst, t) => {
            const worstAcc = getAccuracy(worst.correct, worst.attempts);
            const tAcc = getAccuracy(t.correct, t.attempts);
            return tAcc < worstAcc ? t : worst;
        })
        : null;

    const strongestTopic = qualifiedTopics.length > 0
        ? qualifiedTopics.reduce((best, t) => {
            const bestAcc = getAccuracy(best.correct, best.attempts);
            const tAcc = getAccuracy(t.correct, t.attempts);
            return tAcc > bestAcc ? t : best;
        })
        : null;

    const bestStreakTopic = mastery.length > 0
        ? mastery.reduce((best, t) => t.best_streak > best.best_streak ? t : best)
        : null;

    // --- Chart data ---

    // Bar chart: accuracy per practiced topic
    const accuracyChartData = practicedMastery
        .map(m => ({
            name: findTopicTitle(m.subcategory),
            accuracy: getAccuracy(m.correct, m.attempts),
            module: findModuleForTopic(m.subcategory),
        }))
        .sort((a, b) => b.accuracy - a.accuracy);

    // Radar chart: per-module aggregated accuracy
    const radarData = curriculum.map(mod => {
        const modTopics = mod.topics
            .map(t => masteryMap.get(t.id))
            .filter((m): m is MasteryRow => !!m && m.attempts > 0);
        const totalCorrect = modTopics.reduce((s, m) => s + m.correct, 0);
        const totalAttempts = modTopics.reduce((s, m) => s + m.attempts, 0);
        return {
            module: mod.title,
            accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
            practiced: modTopics.length,
            total: mod.topics.length,
        };
    });

    // Donut chart: correct vs wrong overall
    const totalCorrect = practicedMastery.reduce((s, m) => s + m.correct, 0);
    const totalWrong = practicedMastery.reduce((s, m) => s + m.wrong_count, 0);
    const donutData = [
        { name: 'Corretas', value: totalCorrect, fill: '#22c55e' },
        { name: 'Erradas', value: totalWrong, fill: '#ef4444' },
    ];
    const overallAccuracy = totalCorrect + totalWrong > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
        : 0;

    const hasAnyData = practicedMastery.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Voltar para Arena
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Suas Estatísticas</h1>
                    <p className="text-gray-500 mt-2">Acompanhe seu progresso e identifique pontos de melhoria.</p>
                </header>

                {/* Section 1 — Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-500">Exercícios</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{exercisesSolved}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-500">Sequência</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {currentStreak}
                            <span className="text-sm font-medium text-gray-400 ml-1">/ {longestStreak} max</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-500">XP Total</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{xpTotal}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-gray-500">Tópicos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {topicsPracticed}
                            <span className="text-sm font-medium text-gray-400 ml-1">/ {TOTAL_TOPICS}</span>
                        </p>
                    </div>
                </div>

                {/* Section 2 — Charts */}
                {hasAnyData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Overall accuracy donut */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Acerto Geral</h3>
                            <div className="relative h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {donutData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}`, '']}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900">{overallAccuracy}%</p>
                                        <p className="text-xs text-gray-500">acerto</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-2">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-gray-600">{totalCorrect} corretas</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-gray-600">{totalWrong} erradas</span>
                                </div>
                            </div>
                        </div>

                        {/* Radar: per-module accuracy */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Acerto por Módulo</h3>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis
                                            dataKey="module"
                                            tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }}
                                        />
                                        <Radar
                                            dataKey="accuracy"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.2}
                                            strokeWidth={2}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Acerto']}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                {radarData.map(r => (
                                    <span key={r.module} className="text-xs text-gray-500">
                                        {r.module}: {r.practiced}/{r.total} tópicos
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bar chart: accuracy per topic */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Acerto por Tópico</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={accuracyChartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={160}
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Acerto']}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                                        />
                                        <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={18}>
                                            {accuracyChartData.map((entry, i) => (
                                                <Cell key={i} fill={MODULE_COLORS[entry.module]?.fill ?? '#6b7280'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 3 — Per-topic Breakdown (practiced only) */}
                {hasAnyData && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-bold text-gray-900">Desempenho por Tópico</h2>
                            </div>
                        </div>

                        {curriculum.map((mod) => {
                            const colors = MODULE_COLORS[mod.id];
                            // Only topics with attempts > 0, sorted weakest first
                            const practicedTopics = mod.topics
                                .filter(t => {
                                    const m = masteryMap.get(t.id);
                                    return m && m.attempts > 0;
                                })
                                .sort((a, b) => {
                                    const ma = masteryMap.get(a.id)!;
                                    const mb = masteryMap.get(b.id)!;
                                    return getAccuracy(ma.correct, ma.attempts) - getAccuracy(mb.correct, mb.attempts);
                                });

                            if (practicedTopics.length === 0) return null;

                            return (
                                <div key={mod.id}>
                                    <div className={cn("px-6 py-3 border-l-4", colors.accent, colors.bg)}>
                                        <span className={cn("font-bold text-sm", colors.text)}>{mod.title}</span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {practicedTopics.map((topic) => {
                                            const m = masteryMap.get(topic.id)!;
                                            const accuracy = getAccuracy(m.correct, m.attempts);
                                            const ratingLabel = m.avg_self_rating
                                                ? RATING_LABELS[Math.round(m.avg_self_rating)] ?? '—'
                                                : '—';

                                            return (
                                                <div key={topic.id} className="px-6 py-3 flex items-center gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{topic.title}</p>
                                                    </div>
                                                    <div className="text-xs text-gray-500 w-20 text-right">
                                                        {m.attempts} tentativas
                                                    </div>
                                                    <div className="w-24 flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full",
                                                                    accuracy >= 70 ? "bg-green-500" : accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                                                                )}
                                                                style={{ width: `${accuracy}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{accuracy}%</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 w-14 text-center">{ratingLabel}</div>
                                                    <div className="text-xs text-gray-400 w-16 text-right">{formatDate(m.last_practiced)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!hasAnyData && (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm mb-10 text-center">
                        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum tópico praticado ainda.</p>
                        <p className="text-sm text-gray-400 mt-1">Resolva exercícios para ver suas estatísticas aqui.</p>
                        <Link href="/dashboard" className="inline-block mt-4 text-blue-600 hover:underline font-bold text-sm">
                            Ir para Arena
                        </Link>
                    </div>
                )}

                {/* Section 4 — Insights */}
                {(weakestTopic || strongestTopic || (bestStreakTopic && bestStreakTopic.best_streak > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {weakestTopic && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-medium text-gray-500">Tópico mais difícil</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(weakestTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {getAccuracy(weakestTopic.correct, weakestTopic.attempts)}% de acerto em {weakestTopic.attempts} tentativas
                                </p>
                            </div>
                        )}

                        {strongestTopic && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-medium text-gray-500">Tópico mais forte</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(strongestTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {getAccuracy(strongestTopic.correct, strongestTopic.attempts)}% de acerto em {strongestTopic.attempts} tentativas
                                </p>
                            </div>
                        )}

                        {bestStreakTopic && bestStreakTopic.best_streak > 0 && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-500">Melhor sequência</span>
                                </div>
                                <p className="font-bold text-gray-900">{findTopicTitle(bestStreakTopic.subcategory)}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {bestStreakTopic.best_streak} acertos consecutivos
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
