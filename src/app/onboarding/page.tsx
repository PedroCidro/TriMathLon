'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, GraduationCap, School, BookOpen, Brain, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Level = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const levels: Level[] = [
    { id: 'fundamental', title: 'Ensino Fundamental', description: 'Foco em aritmética e pré-álgebra. Construindo a base.', icon: <School className="w-6 h-6" /> },
    { id: 'medio', title: 'Ensino Médio', description: 'Funções, trigonometria e introdução ao cálculo.', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'graduacao', title: 'Graduação (STEM)', description: 'Cálculo I, II, III e EDOs completo.', icon: <GraduationCap className="w-6 h-6" /> },
    { id: 'pos', title: 'Pós-Graduação', description: 'Métodos avançados e pesquisa matemática.', icon: <Brain className="w-6 h-6" /> },
    { id: 'enthusiast', title: 'Entusiasta', description: 'Aprendendo por conta própria ou reforço mental.', icon: <Users className="w-6 h-6" /> },
];

const VALID_LEVELS = levels.map(l => l.id);

export default function OnboardingPage() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleContinue = async () => {
        if (!selectedLevel || !VALID_LEVELS.includes(selectedLevel)) return;
        setLoading(true);

        try {
            const res = await fetch('/api/profile/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ academic_level: selectedLevel }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving profile:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Erro ao salvar perfil: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">Em qual etapa você está?</h1>
                </div>

                <div className="space-y-3">
                    {levels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            className={cn(
                                "w-full group p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex items-center gap-4 bg-white",
                                selectedLevel === level.id
                                    ? "border-blue-500 shadow-[0_4px_0_0_rgb(59,130,246)] -translate-y-1"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-lg transition-colors",
                                selectedLevel === level.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            )}>
                                {level.icon}
                            </div>
                            <div className="flex-1">
                                <div className={cn(
                                    "font-bold text-lg mb-0.5",
                                    selectedLevel === level.id ? "text-blue-600" : "text-gray-900"
                                )}>
                                    {level.title}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">{level.description}</div>
                            </div>

                            {selectedLevel === level.id && (
                                <motion.div
                                    layoutId="check"
                                    className="absolute right-4 text-blue-500"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <Check className="w-6 h-6 stroke-[3]" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedLevel || loading}
                        className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                            !selectedLevel || loading
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                        )}
                    >
                        {loading ? 'Salvando...' : 'Continuar'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
