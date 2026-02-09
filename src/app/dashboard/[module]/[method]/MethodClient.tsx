'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Dumbbell, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { curriculum } from '@/data/curriculum';

type Tab = 'learn' | 'practice' | 'recognize';

type Question = {
    id: string;
    problem: string;
    solution_latex: string;
    difficulty: number;
};

export default function MethodClient() {
    const [activeTab, setActiveTab] = useState<Tab>('learn');
    const params = useParams();

    // Find Topic Data
    const moduleId = typeof params.module === 'string' ? params.module : '';
    const methodId = typeof params.method === 'string' ? params.method : '';

    // Safety check for curriculum array
    const modules = curriculum || [];
    const moduleData = modules.find(m => m.id === moduleId);
    const topicData = moduleData?.topics.find(t => t.id === methodId);

    // Questions State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(false);
    const questionsFetched = useRef(false);

    const supabaseRef = useRef(createClient());

    const fetchQuestions = useCallback(async () => {
        if (!params.method || questionsFetched.current) return;
        setLoading(true);
        const supabase = supabaseRef.current;

        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, difficulty')
            .eq('subcategory', params.method)
            .limit(20);

        if (error) {
            console.error('Failed to fetch questions:', error.message);
        } else if (data) {
            setQuestions(data);
            questionsFetched.current = true;
        }
        setLoading(false);
    }, [params.method]);

    useEffect(() => {
        if (activeTab === 'practice' && !questionsFetched.current) {
            fetchQuestions();
        }
    }, [activeTab, fetchQuestions]);

    const handleNext = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev + 1) % questions.length);

        // Fire-and-forget increment via server API route
        fetch('/api/exercises/increment', { method: 'POST' }).catch(() => {});
    };

    // Helper to render mixed text and LaTeX (e.g. "Derive $f(x)$")
    const renderFormattedText = (text: string, className: string = "") => {
        const parts = text.split('$');
        return (
            <span className={className}>
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return <span key={index}>{part}</span>;
                    } else {
                        return <MathRenderer key={index} latex={part} />;
                    }
                })}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${params.module}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{moduleData?.title || params.module}</span>
                        <h1 className="text-lg font-bold text-gray-900">{topicData?.title || 'Tópico'}</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[
                        { id: 'learn', label: 'Aprender', icon: BookOpen },
                        { id: 'practice', label: 'Treinar', icon: Dumbbell },
                        { id: 'recognize', label: 'Reconhecer', icon: Eye }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:block">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'learn' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                <div className="aspect-video bg-black rounded-2xl mb-8 flex items-center justify-center text-white font-bold">
                                    VIDEO PLACEHOLDER
                                </div>
                                <h2 className="text-2xl font-bold mb-4">A Intuição</h2>
                                <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                    Para derivar funções polinomiais simples como <MathRenderer latex="x^n" className="text-black font-bold mx-1" />,
                                    basta "tombar" o expoente e subtrair 1 dele.
                                </p>
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                    <MathRenderer latex="\frac{d}{dx} x^n = n \cdot x^{n-1}" className="text-3xl text-blue-700" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'practice' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center relative">
                                {loading ? (
                                    <div className="text-gray-400 animate-pulse">Carregando questões...</div>
                                ) : questions.length > 0 ? (
                                    <div className="w-full max-w-2xl">
                                        <div className="absolute top-6 right-6 text-sm font-bold text-gray-300">
                                            #{currentIndex + 1} / {questions.length}
                                        </div>

                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 block">
                                            Calcule a derivada
                                        </span>

                                        <div className="mb-12 min-h-[120px] flex items-center justify-center">
                                            {renderFormattedText(questions[currentIndex].problem.replace('Derive', ''), "text-4xl md:text-5xl font-bold text-blue-600")}
                                        </div>

                                        <AnimatePresence>
                                            {showAnswer && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-8"
                                                >
                                                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                                        <span className="text-xs font-bold text-green-600 uppercase mb-2 block">Resposta</span>
                                                        {renderFormattedText(questions[currentIndex].solution_latex, "text-2xl text-green-700 font-bold")}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex gap-4 justify-center">
                                            {!showAnswer ? (
                                                <button
                                                    onClick={() => setShowAnswer(true)}
                                                    className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 rounded-xl font-bold transition-all"
                                                >
                                                    Mostrar Resposta
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleNext}
                                                    className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                                                >
                                                    Próxima <ChevronRight className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400">
                                        <p>Nenhuma questão encontrada para este tópico.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'recognize' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Qual método usar?</span>
                                <div className="mb-12">
                                    <MathRenderer latex="\int x \sin(x) dx" className="text-5xl font-bold" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                                    {['Substituição Simples', 'Por Partes', 'Frações Parciais', 'Trigonométrica'].map((opt) => (
                                        <button key={opt} className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 font-bold text-gray-700 transition-all">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
