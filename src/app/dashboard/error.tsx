'use client';

import Link from 'next/link';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center max-w-md">
                <div className="text-6xl font-bold text-gray-200 mb-4">Ops!</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar o dashboard</h1>
                <p className="text-gray-500 mb-8">
                    Nao foi possivel carregar seus dados. Tente novamente.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-md"
                    >
                        Tentar novamente
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all"
                    >
                        Voltar ao inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
