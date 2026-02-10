'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Zap, X as XIcon, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { curriculum } from '@/data/curriculum';

type Question = {
    id: string;
    problem: string;
    solution_latex: string;
    difficulty: number;
};

type GameState = 'ready' | 'playing' | 'finished';

const GAME_DURATION = 180; // 3 minutes in seconds
const MAX_STRIKES = 3;

export default function BlitzClient({ moduleId }: { moduleId: string }) {
    const moduleData = curriculum.find(m => m.id === moduleId);

    const [gameState, setGameState] = useState<GameState>('ready');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const supabaseRef = useRef(createClient());

    // Fetch all questions for this module
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        const supabase = supabaseRef.current;
        const topicIds = moduleData?.topics.map(t => t.id) || [];

        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, difficulty')
            .in('subcategory', topicIds)
            .limit(50);

        if (error) {
            console.error('Failed to fetch blitz questions:', error.message);
        } else if (data) {
            // Sort by difficulty (easy first), then shuffle within each tier
            const sorted = [...data].sort((a, b) => a.difficulty - b.difficulty);
            setQuestions(sorted);
        }
        setLoading(false);
    }, [moduleData]);

    // Start the game
    const startGame = async () => {
        await fetchQuestions();
        setGameState('playing');
        setCurrentIndex(0);
        setShowAnswer(false);
        setTimeLeft(GAME_DURATION);
        setStrikes(0);
        setScore(0);
    };

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setGameState('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    const handleCorrect = () => {
        setScore(prev => prev + 1);
        advance();
    };

    const handleWrong = () => {
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);
        if (newStrikes >= MAX_STRIKES) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('finished');
        } else {
            advance();
        }
    };

    const advance = () => {
        setShowAnswer(false);
        if (currentIndex + 1 >= questions.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('finished');
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Helper to render mixed text and LaTeX
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
                    <Link href={`/dashboard/${moduleId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h1 className="text-lg font-bold text-gray-900">Blitz — {moduleData?.title}</h1>
                    </div>
                </div>

                {gameState === 'playing' && (
                    <div className="flex items-center gap-6">
                        {/* Timer */}
                        <div className={cn(
                            "font-mono text-2xl font-bold tabular-nums",
                            timeLeft <= 30 ? "text-red-500" : timeLeft <= 60 ? "text-orange-500" : "text-gray-900"
                        )}>
                            {formatTime(timeLeft)}
                        </div>

                        {/* Strikes */}
                        <div className="flex gap-1">
                            {Array.from({ length: MAX_STRIKES }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-3 h-3 rounded-full",
                                        i < strikes ? "bg-red-500" : "bg-gray-200"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Score */}
                        <div className="font-bold text-green-600 text-lg">
                            {score}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full flex items-center justify-center">
                {/* Ready state */}
                {gameState === 'ready' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Modo Blitz</h2>
                        <p className="text-gray-500 text-lg mb-2">
                            Resolva o máximo de problemas em <span className="font-bold text-gray-900">3 minutos</span>.
                        </p>
                        <p className="text-gray-400 mb-8">
                            3 erros e o jogo acaba. Problemas ficam progressivamente mais difíceis.
                        </p>
                        <button
                            onClick={startGame}
                            disabled={loading}
                            className="px-10 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg shadow-[0_4px_0_0_rgb(202,138,4)] hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(202,138,4)] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            {loading ? 'Carregando...' : 'Começar!'}
                        </button>
                    </motion.div>
                )}

                {/* Playing state */}
                {gameState === 'playing' && questions.length > 0 && currentIndex < questions.length && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center w-full relative">
                        <div className="absolute top-6 right-6 text-sm font-bold text-gray-300">
                            #{currentIndex + 1}
                        </div>

                        <div className="mb-12 min-h-[120px] flex items-center justify-center">
                            {renderFormattedText(
                                questions[currentIndex].problem,
                                "text-4xl md:text-5xl font-bold text-gray-900"
                            )}
                        </div>

                        <AnimatePresence>
                            {showAnswer && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 w-full max-w-lg"
                                >
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        {renderFormattedText(
                                            questions[currentIndex].solution_latex,
                                            "text-2xl font-bold text-gray-700"
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showAnswer ? (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-yellow-500 hover:text-yellow-600 text-gray-600 rounded-xl font-bold transition-all"
                            >
                                Revelar
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleWrong}
                                    className="px-8 py-3 rounded-xl border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 font-bold transition-all flex items-center gap-2"
                                >
                                    <XIcon className="w-5 h-5" />
                                    Errei
                                </button>
                                <button
                                    onClick={handleCorrect}
                                    className="px-8 py-3 rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-600 font-bold transition-all flex items-center gap-2"
                                >
                                    <Trophy className="w-5 h-5" />
                                    Acertei
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Finished state */}
                {gameState === 'finished' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-7xl font-bold text-yellow-500 mb-4">{score}</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {strikes >= MAX_STRIKES ? 'Game Over!' : 'Tempo Esgotado!'}
                        </h2>
                        <p className="text-gray-500 mb-2">
                            {score === 1 ? '1 problema resolvido' : `${score} problemas resolvidos`}
                            {' '}em {formatTime(GAME_DURATION - timeLeft)}
                        </p>
                        <p className="text-gray-400 text-sm mb-8">
                            {strikes} {strikes === 1 ? 'erro' : 'erros'}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setGameState('ready');
                                    setQuestions([]);
                                }}
                                className="px-8 py-3 bg-yellow-500 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Jogar Novamente
                            </button>
                            <Link
                                href={`/dashboard/${moduleId}`}
                                className="px-8 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all"
                            >
                                Voltar
                            </Link>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
