'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, GraduationCap, School, BookOpen, Brain, Users, ChevronRight, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Department } from '@/data/institutions';

type Level = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const levels: Level[] = [
    { id: 'fundamental', title: 'Ensino Fundamental', description: 'Foco em aritmetica e pre-algebra. Construindo a base.', icon: <School className="w-6 h-6" /> },
    { id: 'medio', title: 'Ensino Medio', description: 'Funcoes, trigonometria e introducao ao calculo.', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'graduacao', title: 'Graduacao (STEM)', description: 'Calculo I, II, III e EDOs completo.', icon: <GraduationCap className="w-6 h-6" /> },
    { id: 'pos', title: 'Pos-Graduacao', description: 'Metodos avancados e pesquisa matematica.', icon: <Brain className="w-6 h-6" /> },
    { id: 'enthusiast', title: 'Entusiasta', description: 'Aprendendo por conta propria ou reforco mental.', icon: <Users className="w-6 h-6" /> },
];

const VALID_LEVELS = levels.map(l => l.id);

interface OnboardingClientProps {
    institutionId: string | null;
    institutionName: string | null;
    departments: Department[] | null;
}

export default function OnboardingClient({
    institutionId,
    institutionName,
    departments,
}: OnboardingClientProps) {
    const [step, setStep] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const hasInstitution = !!institutionId;
    const hasDepartments = !!(departments && departments.length > 0);

    const handleSubmit = async () => {
        if (!selectedLevel || !VALID_LEVELS.includes(selectedLevel)) return;
        if (hasInstitution && hasDepartments && !selectedDepartment) return;
        setLoading(true);

        try {
            const res = await fetch('/api/profile/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academic_level: selectedLevel,
                    institution: institutionId,
                    institution_department: selectedDepartment,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            if (hasInstitution) {
                router.push(`/institutional/${institutionId}`);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Erro ao salvar perfil: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueStep1 = () => {
        if (!selectedLevel || !VALID_LEVELS.includes(selectedLevel)) return;
        if (hasInstitution) {
            setStep(2);
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                {step === 1 && (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 tracking-tight">Em qual etapa voce esta?</h1>
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
                                onClick={handleContinueStep1}
                                disabled={!selectedLevel || loading}
                                className={cn(
                                    "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                                    !selectedLevel || loading
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                )}
                            >
                                {loading && !hasInstitution ? 'Salvando...' : 'Continuar'}
                                {!loading && hasInstitution && <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-6">
                                <Building2 className="w-4 h-4" />
                                {institutionName}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 tracking-tight">
                                Detectamos que voce e estudante da {institutionName}!
                            </h1>
                            <p className="text-gray-500">
                                {hasDepartments
                                    ? 'Selecione seu instituto ou faculdade.'
                                    : 'Vamos personalizar sua experiencia.'}
                            </p>
                        </div>

                        {hasDepartments && (
                            <div className="space-y-3 mb-10">
                                {departments.map((dept) => (
                                    <button
                                        key={dept.id}
                                        onClick={() => setSelectedDepartment(dept.id)}
                                        className={cn(
                                            "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex items-center gap-4 bg-white",
                                            selectedDepartment === dept.id
                                                ? "border-blue-500 shadow-[0_4px_0_0_rgb(59,130,246)] -translate-y-1"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className={cn(
                                                "font-bold text-base",
                                                selectedDepartment === dept.id ? "text-blue-600" : "text-gray-900"
                                            )}>
                                                {dept.name}
                                            </div>
                                        </div>
                                        {selectedDepartment === dept.id && (
                                            <Check className="w-5 h-5 text-blue-500 stroke-[3]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || (hasDepartments && !selectedDepartment)}
                                className={cn(
                                    "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                                    loading || (hasDepartments && !selectedDepartment)
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                )}
                            >
                                {loading ? 'Salvando...' : 'Continuar'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
