'use client';

import { useState } from 'react';
import { ArrowLeft, Check, User, GraduationCap, School, BookOpen, Brain, Users, CreditCard, Trophy, Building2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Level = {
    id: string;
    title: string;
    icon: React.ReactNode;
};

const levels: Level[] = [
    { id: 'fundamental', title: 'Ensino Fundamental', icon: <School className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'medio', title: 'Ensino Medio', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'graduacao', title: 'Graduacao (STEM)', icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'pos', title: 'Pos-Graduacao', icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'enthusiast', title: 'Entusiasta', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

function formatDisplayName(fullName: string | null): string {
    if (!fullName || fullName.trim() === '') return 'Anonimo';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const lastInitial = parts[parts.length - 1][0].toUpperCase();
    return `${first} ${lastInitial}.`;
}

interface SettingsClientProps {
    academicLevel: string | null;
    email: string | null;
    fullName: string | null;
    isPremium: boolean;
    rankingOptIn: boolean;
    institutionName: string | null;
    institutionDepartment: string | null;
    institutionDepartmentName: string | null;
}

export default function SettingsClient({
    academicLevel,
    email,
    fullName,
    isPremium,
    rankingOptIn: initialOptIn,
    institutionName,
    institutionDepartmentName,
}: SettingsClientProps) {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(academicLevel);
    const [saving, setSaving] = useState(false);
    const [optIn, setOptIn] = useState(initialOptIn);
    const [togglingOptIn, setTogglingOptIn] = useState(false);
    const hasChanged = selectedLevel !== academicLevel;

    const handleSave = async () => {
        if (!selectedLevel || !hasChanged) return;
        setSaving(true);

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

            toast.success('Nivel academico atualizado!');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            toast.error(`Erro ao salvar: ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleOptIn = async () => {
        setTogglingOptIn(true);
        try {
            const res = await fetch('/api/profile/ranking-opt-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setOptIn(data.ranking_opt_in);
            toast.success(data.ranking_opt_in ? 'Voce entrou no ranking!' : 'Voce saiu do ranking.');
        } catch {
            toast.error('Erro ao atualizar preferencia.');
        } finally {
            setTogglingOptIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Voltar para Arena
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Configuracoes</h1>
                    <p className="text-gray-500 mt-2">Gerencie sua conta e preferencias.</p>
                </header>

                {/* Section 1 — Account Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Conta</h2>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-500">Nome</span>
                            <p className="font-medium text-gray-900">{fullName || '—'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Email</span>
                            <p className="font-medium text-gray-900">{email || '—'}</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                        Para alterar seus dados de conta, use o menu do perfil.
                    </p>
                </div>

                {/* Section 2 — Academic Level */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Nivel Academico</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all",
                                    selectedLevel === level.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                )}
                            >
                                {level.icon}
                                {level.title}
                                {selectedLevel === level.id && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                    {hasChanged && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                                saving
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    )}
                </div>

                {/* Section 3 — Subscription */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Assinatura</h2>
                    </div>
                    {isPremium ? (
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                                <Check className="w-4 h-4" />
                                Premium ativo
                            </span>
                        </div>
                    ) : (
                        <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">
                                Plano Gratuito
                            </span>
                            <p className="text-sm text-gray-500 mt-3">
                                Desbloqueie todos os topicos avancados com o plano Premium.
                            </p>
                            <Link
                                href="/premium"
                                className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                            >
                                Ver plano Premium
                            </Link>
                        </div>
                    )}
                </div>

                {/* Section 4 — Ranking */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Ranking</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-medium text-gray-900 text-sm">Participar do ranking</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Seu nome aparecera como: <span className="font-bold">{formatDisplayName(fullName)}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleToggleOptIn}
                            disabled={togglingOptIn}
                            className={cn(
                                "relative w-12 h-7 rounded-full transition-colors",
                                optIn ? "bg-blue-600" : "bg-gray-300",
                                togglingOptIn && "opacity-50"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                                optIn ? "translate-x-5.5" : "translate-x-0.5"
                            )} />
                        </button>
                    </div>

                    {institutionName && (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">Instituicao</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{institutionName}</p>
                            {institutionDepartmentName && (
                                <p className="text-xs text-gray-500 mt-1">{institutionDepartmentName}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
