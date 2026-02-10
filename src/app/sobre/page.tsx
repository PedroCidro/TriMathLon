'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MathRenderer from '@/components/ui/MathRenderer';

const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Nav */}
            <nav className="w-full flex justify-between items-center max-w-7xl mx-auto p-6">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo-icon.png" alt="Logo" className="h-12 w-auto" />
                </Link>
                <div className="flex items-center gap-6">
                    <Link
                        href="/sign-in"
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/sign-up"
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                    >
                        Começar Agora
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
                    <motion.div {...fade(0)}>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-12"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Link>
                    </motion.div>

                    <motion.h1
                        {...fade(0.1)}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8"
                    >
                        Mais do que resolver{' '}
                        <span className="text-blue-600">exercícios</span>.
                    </motion.h1>

                    <motion.p
                        {...fade(0.2)}
                        className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
                    >
                        Queremos que você entenda matemática do jeito que ela realmente é.
                    </motion.p>
                </section>

                {/* Divider — axiom line */}
                <motion.div
                    {...fade(0.3)}
                    className="max-w-3xl mx-auto px-6"
                >
                    <div className="border-t border-gray-100" />
                </motion.div>

                {/* The "Why" */}
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <motion.div {...fade(0.3)} className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-gray-50 mt-1">
                                <MathRenderer latex="\therefore" className="text-3xl text-gray-300" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    Matemática não é mágica. São argumentos lógicos.
                                </h2>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    A maioria dos cursos ensina <em>como</em> usar uma fórmula.
                                    Nós explicamos <em>por que</em> ela funciona. Quando o caminho
                                    da matemática é respeitado, tudo faz sentido — porque no fundo
                                    são apenas argumentos lógicos aplicados sobre axiomas.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* The Method */}
                <section className="bg-gray-50">
                    <div className="max-w-3xl mx-auto px-6 py-20">
                        <motion.div {...fade(0.4)} className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-white border border-gray-100 mt-1">
                                    <MathRenderer latex="\Rightarrow" className="text-3xl text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                        Entender o porquê muda tudo.
                                    </h2>
                                    <p className="text-lg text-gray-500 leading-relaxed">
                                        Quando você entende <em>por que</em> um método funciona, você
                                        não precisa decorar — você consegue reconstruir a ferramenta
                                        sozinho. No meio de uma prova, quando a memória falha, o
                                        entendimento não falha.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* The Goal */}
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <motion.div {...fade(0.5)} className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-2xl bg-gray-50 mt-1">
                                <MathRenderer latex="\leftrightarrow" className="text-3xl text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    O verdadeiro teste: explicar para alguém.
                                </h2>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    Para nós, o objetivo final não é passar na prova. É quando
                                    você consegue explicar para um amigo, um colega, um filho
                                    ou um parente <em>por que</em> algo funciona de uma maneira e
                                    não de outra. Esse é o momento em que você realmente aprendeu.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* CTA */}
                <section className="bg-gray-50 border-t border-gray-100">
                    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                        <motion.div {...fade(0.6)}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Pronto para entender de verdade?
                            </h2>
                            <p className="text-lg text-gray-400 mb-8">
                                Comece gratuitamente. Sem compromisso.
                            </p>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 text-lg px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(29,78,216)]"
                            >
                                Começar Agora
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
