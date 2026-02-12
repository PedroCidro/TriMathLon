'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { curriculum } from '@/data/curriculum';
import { cn } from '@/lib/utils';

const MODULE_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
    derivadas: { accent: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    integrais: { accent: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    edos: { accent: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
};

const INSTITUTION_ACCENTS: Record<string, { badge: string; badgeBg: string; badgeBorder: string }> = {
    usp: { badge: 'text-blue-700', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-200' },
    ufscar: { badge: 'text-red-700', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200' },
};

interface PremiumClientProps {
    institutionId: string | null;
    institutionName: string | null;
    premiumHeadline: string | null;
}

export default function PremiumClient({
    institutionId,
    institutionName,
    premiumHeadline,
}: PremiumClientProps) {
    const [loading, setLoading] = useState(false);

    const isInstitutional = !!institutionId;
    const price = isInstitutional ? 'R$ 14,95' : 'R$ 29,90';
    const accent = institutionId ? INSTITUTION_ACCENTS[institutionId] : null;

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);

            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No URL returned from checkout session');
            }
        } catch {
            toast.error('Erro ao iniciar checkout. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const premiumTopics = curriculum.map((mod) => ({
        id: mod.id,
        title: mod.title,
        topics: mod.topics.slice(3),
    }));

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img src="/logo-icon.png" alt="JustMathing Logo" className="h-10 sm:h-16 w-auto" />
                </Link>
            </nav>

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-16">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    {isInstitutional && accent && (
                        <div className={cn(
                            "inline-flex items-center px-4 py-2 rounded-full font-bold text-sm border",
                            accent.badge, accent.badgeBg, accent.badgeBorder
                        )}>
                            {premiumHeadline}
                        </div>
                    )}

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Aprenda sem limites.
                    </h1>

                    <p className="text-xl text-gray-500 max-w-lg mx-auto">
                        Acesso completo a todos os topicos de Derivadas, Integrais e EDOs.
                    </p>

                    <div className="pt-4">
                        <div className="flex items-baseline justify-center gap-1 mb-6">
                            <span className="text-3xl sm:text-5xl font-bold text-gray-900">{price}</span>
                            <span className="text-xl text-gray-400 font-medium">/mes</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)] disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {loading ? 'Processando...' : 'Assinar Premium'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>

                        <p className="text-sm text-gray-400 mt-4 font-medium">
                            Cancele quando quiser.
                        </p>
                    </div>
                </div>
            </section>

            {/* What You Unlock */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        O que voce desbloqueia
                    </h2>
                    <p className="text-gray-500 text-center mb-12 text-lg">
                        13 topicos avancados em 3 modulos
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {premiumTopics.map((mod) => {
                            const colors = MODULE_COLORS[mod.id];
                            return (
                                <div key={mod.id} className={`bg-white rounded-2xl border-2 ${colors.border} p-4 sm:p-6`}>
                                    <h3 className={`font-bold text-lg mb-5 ${colors.accent}`}>
                                        {mod.title}
                                    </h3>
                                    <div className="space-y-3">
                                        {mod.topics.map((topic) => (
                                            <div key={topic.id} className="flex items-start gap-3">
                                                <div className={`p-1 rounded-full ${colors.bg} mt-0.5 shrink-0`}>
                                                    <Check className={`w-3.5 h-3.5 ${colors.accent}`} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm">{topic.title}</span>
                                                    <p className="text-gray-400 text-xs">{topic.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reconhecimento feature */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 sm:p-8 max-w-2xl mx-auto">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-blue-50 rounded-xl">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Modo Reconhecimento</h3>
                                <p className="text-gray-400 text-sm">Disponivel em todos os topicos</p>
                            </div>
                        </div>
                        <p className="text-gray-500 ml-14">
                            Treine a identificacao de qual tecnica usar em cada problema — a habilidade mais importante nas provas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-6 py-20">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-900">{price}</span>
                        <span className="text-lg text-gray-400 font-medium">/mes</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)] disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? 'Processando...' : 'Assinar Premium'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <p className="text-sm text-gray-400 font-medium">
                        Sem compromisso. Cancele a qualquer momento.
                    </p>
                </div>
            </section>
        </div>
    );
}
