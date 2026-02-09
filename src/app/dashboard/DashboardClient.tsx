'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Settings } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import UpgradeButton from '@/components/UpgradeButton';
import { curriculum } from '@/data/curriculum';

const modules = curriculum;


export default function DashboardClient() {
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exercisesSolved, setExercisesSolved] = useState(0);

    useEffect(() => {
        const ensureProfile = async () => {
            const res = await fetch('/api/profile/ensure', { method: 'POST' });
            const { profile } = await res.json();
            if (profile) {
                if (profile.is_premium) setIsPremium(true);
                setExercisesSolved(profile.exercises_solved || 0);
            }
            setLoading(false);
        };

        ensureProfile();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Carregando Arena...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                    <img src="/logo-icon.png" alt="Trimathlon Logo" className="h-10 w-auto" />
                </div>

                <div className="flex items-center gap-6">
                    {!isPremium && <UpgradeButton />}

                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Trophy className="w-5 h-5 text-green-500" />
                        <span>{exercisesSolved} Exercícios</span>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                        {/* User Avatar Mock */}
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Main Content - The Arena */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12">

                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Sua Arena de Treino</h1>
                    <p className="text-gray-500 mt-2">Escolha uma modalidade para começar.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <Link href={`/dashboard/${module.id}`} key={module.id} className="block">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className={cn(
                                    "h-full p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
                                    module.color
                                )}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <MathRenderer latex={module.iconLatex} className={cn("text-3xl", module.id === 'derivadas' ? 'text-blue-600' : module.id === 'integrais' ? 'text-purple-600' : 'text-yellow-600')} />
                                    </div>
                                    <div className="text-sm font-bold text-gray-400 bg-white/50 px-2 py-1 rounded-md">
                                        {module.topics.length} Tópicos
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", module.barColor)}
                                        style={{ width: `0%` }}
                                    />
                                </div>
                                <div className="mt-2 text-sm text-gray-500 font-medium text-right">
                                    0% Completo
                                </div>
                                <div className="mt-4 space-y-1">
                                    {module.topics.map((topic) => (
                                        <div key={topic.id} className="text-xs text-gray-500 flex items-center gap-1">
                                            <div className={cn("w-1 h-1 rounded-full", module.barColor)} />
                                            {topic.title}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity / Next Up Mock */}
                <div className="mt-16">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recomendado para hoje</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-gray-300 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Derivadas: Regra da Cadeia</h4>
                                <p className="text-sm text-gray-500">Treino de reconhecimento de padrões • 5 min</p>
                            </div>
                        </div>
                        <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                            Treinar
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
