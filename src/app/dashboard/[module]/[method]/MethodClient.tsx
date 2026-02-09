'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Dumbbell, Eye, Check, X, RotateCcw, Camera } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { curriculum } from '@/data/curriculum';
import { explanations } from '@/data/explanations';

type Tab = 'learn' | 'practice' | 'recognize';

type Question = {
    id: string;
    problem: string;
    solution_latex: string;
    difficulty: number;
};

type RecognizeQuestion = {
    id: string;
    problem: string;
    subcategory: string;
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

    // ── Practice Tab State ──
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [xpPopup, setXpPopup] = useState<number | null>(null);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const questionsFetched = useRef(false);

    // ── Recognize Tab State ──
    const [recognizeQuestions, setRecognizeQuestions] = useState<RecognizeQuestion[]>([]);
    const [recognizeIndex, setRecognizeIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [recognizeOptions, setRecognizeOptions] = useState<string[]>([]);
    const [recognizeLoading, setRecognizeLoading] = useState(false);
    const [recognizeScore, setRecognizeScore] = useState({ correct: 0, total: 0 });
    const recognizeFetched = useRef(false);

    const supabaseRef = useRef(createClient());

    // Cumulative topics: current topic + all previous in the module
    const cumulativeTopicIds = useMemo(() => {
        if (!moduleData) return [];
        const currentIdx = moduleData.topics.findIndex(t => t.id === methodId);
        if (currentIdx === -1) return [];
        return moduleData.topics.slice(0, currentIdx + 1).map(t => t.id);
    }, [moduleData, methodId]);

    // ── Practice: Fetch Questions ──
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

    const XP_MAP: Record<string, number> = { Easy: 10, Medium: 20, Hard: 30 };

    const handleRate = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
        if (ratingSubmitted) return;
        setRatingSubmitted(true);

        const difficulty = topicData?.difficulty || 'Medium';
        const xp = XP_MAP[difficulty] || 20;

        // Show XP popup
        setXpPopup(xp);
        setTimeout(() => setXpPopup(null), 1200);

        // Call the new complete endpoint
        fetch('/api/exercises/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subcategory: methodId,
                self_rating: rating,
                difficulty,
            }),
        }).catch(() => {});

        // Advance to next question after brief delay
        setTimeout(() => {
            setShowAnswer(false);
            setRatingSubmitted(false);
            setCurrentIndex((prev) => (prev + 1) % questions.length);
        }, 600);
    };

    // ── Recognize: Fetch Questions ──
    const fetchRecognizeQuestions = useCallback(async () => {
        if (recognizeFetched.current || cumulativeTopicIds.length === 0) return;
        setRecognizeLoading(true);
        const supabase = supabaseRef.current;

        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, subcategory')
            .in('subcategory', cumulativeTopicIds)
            .limit(20);

        if (error) {
            console.error('Failed to fetch recognize questions:', error.message);
        } else if (data && data.length > 0) {
            // Shuffle
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setRecognizeQuestions(shuffled);
            recognizeFetched.current = true;
        }
        setRecognizeLoading(false);
    }, [cumulativeTopicIds]);

    useEffect(() => {
        if (activeTab === 'recognize' && !recognizeFetched.current) {
            fetchRecognizeQuestions();
        }
    }, [activeTab, fetchRecognizeQuestions]);

    // Compute options when question changes
    useEffect(() => {
        if (recognizeQuestions.length === 0 || recognizeIndex >= recognizeQuestions.length) return;

        const correctId = recognizeQuestions[recognizeIndex].subcategory;
        const allTopics = moduleData?.topics.map(t => t.id) || [];
        const others = allTopics.filter(id => id !== correctId);

        // Pick up to 3 distractors
        const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
        const options = [correctId, ...shuffledOthers.slice(0, 3)];

        // Shuffle final options
        setRecognizeOptions([...options].sort(() => Math.random() - 0.5));
    }, [recognizeIndex, recognizeQuestions, moduleData]);

    const handleRecognizeAnswer = (optionId: string) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(optionId);
        const isCorrect = optionId === recognizeQuestions[recognizeIndex].subcategory;
        setRecognizeScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1,
        }));

        // Auto-advance after delay
        setTimeout(() => {
            setSelectedAnswer(null);
            setRecognizeIndex(prev => prev + 1);
        }, 1500);
    };

    const handleRecognizeRestart = () => {
        setRecognizeIndex(0);
        setRecognizeScore({ correct: 0, total: 0 });
        setSelectedAnswer(null);
        recognizeFetched.current = false;
        fetchRecognizeQuestions();
    };

    // Helper to get topic title from id
    const getTopicTitle = (topicId: string) => {
        return moduleData?.topics.find(t => t.id === topicId)?.title || topicId;
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
                        {activeTab === 'learn' && (() => {
                            const explanation = explanations[methodId];
                            return (
                                <div className="space-y-6">
                                    {/* Video placeholder */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                        <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                                            <div className="relative text-center">
                                                <div className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Em Breve</div>
                                                <div className="text-gray-400 text-sm">Animação Manim</div>
                                            </div>
                                        </div>
                                    </div>

                                    {explanation ? (
                                        <>
                                            {/* Intuition section */}
                                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-2xl font-bold mb-4">{explanation.intuitionTitle}</h2>
                                                <div className="text-gray-600 leading-relaxed text-lg mb-6">
                                                    {renderFormattedText(explanation.intuition, "")}
                                                </div>
                                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 block">Fórmula Principal</span>
                                                    <MathRenderer latex={explanation.formulaLatex} className="text-3xl text-blue-700" />
                                                </div>
                                            </div>

                                            {/* Proof / formal explanation */}
                                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-2xl font-bold mb-4">{explanation.proofTitle}</h2>
                                                <div className="text-gray-600 leading-relaxed text-lg">
                                                    {renderFormattedText(explanation.proof, "")}
                                                </div>
                                            </div>

                                            {/* Worked examples */}
                                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-2xl font-bold mb-6">Exemplos Resolvidos</h2>
                                                <div className="space-y-6">
                                                    {explanation.examples.map((example, i) => (
                                                        <div key={i} className="border border-gray-100 rounded-xl p-6">
                                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                                                Exemplo {i + 1}
                                                            </div>
                                                            <div className="text-lg font-bold text-gray-900 mb-4">
                                                                {renderFormattedText(example.problem, "")}
                                                            </div>
                                                            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                                                <span className="text-xs font-bold text-green-600 uppercase mb-2 block">Solução</span>
                                                                <div className="text-gray-700 leading-relaxed">
                                                                    {renderFormattedText(example.solution, "")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                            <h2 className="text-2xl font-bold mb-4">A Intuição</h2>
                                            <p className="text-gray-500">Conteúdo em desenvolvimento para este tópico.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

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

                                        {!showAnswer ? (
                                            <button
                                                onClick={() => setShowAnswer(true)}
                                                className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 rounded-xl font-bold transition-all"
                                            >
                                                Mostrar Resposta
                                            </button>
                                        ) : (
                                            <div className="space-y-4 relative">
                                                {/* XP popup animation */}
                                                <AnimatePresence>
                                                    {xpPopup !== null && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 0 }}
                                                            animate={{ opacity: 1, y: -30 }}
                                                            exit={{ opacity: 0, y: -50 }}
                                                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold text-green-500 pointer-events-none"
                                                        >
                                                            +{xpPopup} XP
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Photo upload placeholder */}
                                                <button
                                                    disabled
                                                    className="flex items-center gap-2 mx-auto text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 py-2 cursor-not-allowed"
                                                    title="Em breve: envie uma foto da sua resolução para feedback com IA"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                    Enviar tentativa (em breve)
                                                </button>

                                                {/* Self-rating buttons */}
                                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block">
                                                    Como foi?
                                                </span>
                                                <div className="flex gap-3 justify-center">
                                                    {[
                                                        { id: 'wrong' as const, label: 'Errei', color: 'border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600' },
                                                        { id: 'hard' as const, label: 'Difícil', color: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50 text-orange-600' },
                                                        { id: 'good' as const, label: 'Bom', color: 'border-green-200 hover:border-green-500 hover:bg-green-50 text-green-600' },
                                                        { id: 'easy' as const, label: 'Fácil', color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-600' },
                                                    ].map((btn) => (
                                                        <button
                                                            key={btn.id}
                                                            onClick={() => handleRate(btn.id)}
                                                            disabled={ratingSubmitted}
                                                            className={cn(
                                                                "px-5 py-3 rounded-xl border-2 font-bold transition-all text-sm",
                                                                ratingSubmitted
                                                                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                                                                    : btn.color
                                                            )}
                                                        >
                                                            {btn.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-400">
                                        <p>Nenhuma questão encontrada para este tópico.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'recognize' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center relative">
                                {recognizeLoading ? (
                                    <div className="text-gray-400 animate-pulse">Carregando questões...</div>
                                ) : recognizeQuestions.length > 0 ? (
                                    recognizeIndex < recognizeQuestions.length ? (
                                        <div className="w-full max-w-2xl">
                                            <div className="absolute top-6 right-6 text-sm font-bold text-gray-300">
                                                #{recognizeIndex + 1} / {recognizeQuestions.length}
                                            </div>
                                            <div className="absolute top-6 left-6 text-sm font-bold flex items-center gap-2">
                                                <span className="text-green-500">{recognizeScore.correct}</span>
                                                <span className="text-gray-300">/</span>
                                                <span className="text-gray-400">{recognizeScore.total}</span>
                                            </div>

                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 block">
                                                Qual método usar?
                                            </span>

                                            <div className="mb-12 min-h-[120px] flex items-center justify-center">
                                                {renderFormattedText(
                                                    recognizeQuestions[recognizeIndex].problem,
                                                    "text-3xl md:text-4xl font-bold text-gray-900"
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto">
                                                {recognizeOptions.map((optionId) => {
                                                    const isCorrect = optionId === recognizeQuestions[recognizeIndex].subcategory;
                                                    const isSelected = selectedAnswer === optionId;
                                                    const showResult = selectedAnswer !== null;

                                                    return (
                                                        <button
                                                            key={optionId}
                                                            onClick={() => handleRecognizeAnswer(optionId)}
                                                            disabled={showResult}
                                                            className={cn(
                                                                "p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2",
                                                                showResult && isCorrect
                                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                                    : showResult && isSelected && !isCorrect
                                                                    ? "border-red-500 bg-red-50 text-red-700"
                                                                    : showResult
                                                                    ? "border-gray-100 text-gray-400"
                                                                    : "border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                                                            )}
                                                        >
                                                            {showResult && isCorrect && <Check className="w-5 h-5" />}
                                                            {showResult && isSelected && !isCorrect && <X className="w-5 h-5" />}
                                                            {getTopicTitle(optionId)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Summary screen */
                                        <div className="text-center">
                                            <div className="text-6xl font-bold mb-2">
                                                <span className="text-green-500">{recognizeScore.correct}</span>
                                                <span className="text-gray-300"> / </span>
                                                <span className="text-gray-400">{recognizeScore.total}</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rodada Completa!</h2>
                                            <p className="text-gray-500 mb-8">
                                                {recognizeScore.correct === recognizeScore.total
                                                    ? 'Perfeito! Você acertou todas.'
                                                    : `Você acertou ${recognizeScore.correct} de ${recognizeScore.total} questões.`
                                                }
                                            </p>
                                            <button
                                                onClick={handleRecognizeRestart}
                                                className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                                Jogar Novamente
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-400">
                                        <p>Nenhuma questão de reconhecimento encontrada para este tópico.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
