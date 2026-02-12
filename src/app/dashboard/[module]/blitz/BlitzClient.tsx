'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Zap, RotateCcw, Trophy, Crown, Star } from 'lucide-react';
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
    distractors: string[];
    difficulty: number;
};

type GameState = 'ready' | 'playing' | 'finished';

type LeaderboardEntry = {
    full_name: string;
    score: number;
    position: number;
};

const GAME_DURATION = 180; // 3 minutes
const MAX_STRIKES = 3;
const FEEDBACK_DELAY = 1000; // 1s delay after answer selection

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function BlitzClient({ moduleId }: { moduleId: string }) {
    const moduleData = curriculum.find(m => m.id === moduleId);

    const [gameState, setGameState] = useState<GameState>('ready');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    // Multiple choice state
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

    // Leaderboard state
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [personalBest, setPersonalBest] = useState<number>(0);
    const [isNewBest, setIsNewBest] = useState(false);
    const [savingScore, setSavingScore] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const supabaseRef = useRef(createClient());
    const gameStartTimeRef = useRef<number>(0);

    // Build shuffled options for the current question
    const buildOptions = useCallback((question: Question) => {
        const correct = question.solution_latex;
        const allOptions = shuffleArray([correct, ...question.distractors]);
        setOptions(allOptions);
        setCorrectOptionIndex(allOptions.indexOf(correct));
        setSelectedOption(null);
    }, []);

    // Fetch questions with distractors
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        const supabase = supabaseRef.current;
        const topicIds = moduleData?.topics.map(t => t.id) || [];

        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, distractors, difficulty')
            .in('subcategory', topicIds)
            .not('distractors', 'is', null)
            .limit(50);

        if (error) {
            console.error('Failed to fetch blitz questions:', error.message);
        } else if (data) {
            // Sort by difficulty then shuffle within tiers
            const sorted = [...data].sort((a, b) => a.difficulty - b.difficulty) as Question[];
            setQuestions(sorted);
        }
        setLoading(false);
    }, [moduleData]);

    // Save score to backend
    const saveScore = useCallback(async (finalScore: number, finalStrikes: number) => {
        setSavingScore(true);
        const elapsed = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
        try {
            const res = await fetch('/api/blitz/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    module_id: moduleId,
                    score: finalScore,
                    strikes: finalStrikes,
                    duration_seconds: elapsed,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setPersonalBest(data.personal_best ?? finalScore);
                setIsNewBest(data.is_new_best ?? false);
                setLeaderboard(data.leaderboard ?? []);
            }
        } catch (err) {
            console.error('Failed to save blitz score:', err);
        } finally {
            setSavingScore(false);
        }
    }, [moduleId]);

    // Start the game
    const startGame = async () => {
        await fetchQuestions();
        setGameState('playing');
        setCurrentIndex(0);
        setTimeLeft(GAME_DURATION);
        setStrikes(0);
        setScore(0);
        setLeaderboard([]);
        setPersonalBest(0);
        setIsNewBest(false);
        gameStartTimeRef.current = Date.now();
    };

    // Set up options when currentIndex changes
    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0 && currentIndex < questions.length) {
            buildOptions(questions[currentIndex]);
        }
    }, [currentIndex, gameState, questions, buildOptions]);

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

    // Save score when game finishes
    useEffect(() => {
        if (gameState === 'finished' && score >= 0) {
            saveScore(score, strikes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    // Clean up feedback timer on unmount
    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return; // Already selected
        setSelectedOption(index);

        const isCorrect = index === correctOptionIndex;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        const newStrikes = isCorrect ? strikes : strikes + 1;
        if (!isCorrect) {
            setStrikes(newStrikes);
        }

        // After feedback delay, advance or end
        feedbackTimerRef.current = setTimeout(() => {
            if (newStrikes >= MAX_STRIKES) {
                if (timerRef.current) clearInterval(timerRef.current);
                setGameState('finished');
            } else if (currentIndex + 1 >= questions.length) {
                if (timerRef.current) clearInterval(timerRef.current);
                setGameState('finished');
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }, FEEDBACK_DELAY);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

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
            <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${moduleId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h1 className="text-base sm:text-lg font-bold text-gray-900">Blitz — {moduleData?.title}</h1>
                    </div>
                </div>

                {gameState === 'playing' && (
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Timer */}
                        <div className={cn(
                            "font-mono text-lg sm:text-2xl font-bold tabular-nums",
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
                                        "w-3 h-3 rounded-full transition-colors",
                                        i < strikes ? "bg-red-500" : "bg-gray-200"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Score */}
                        <div className="font-bold text-green-600 text-base sm:text-lg">
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
                            Escolha a resposta correta o mais rapido possivel em <span className="font-bold text-gray-900">3 minutos</span>.
                        </p>
                        <p className="text-gray-400 mb-8">
                            3 erros e o jogo acaba. Problemas ficam progressivamente mais dificeis.
                        </p>
                        <button
                            onClick={startGame}
                            disabled={loading}
                            className="px-10 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg shadow-[0_4px_0_0_rgb(202,138,4)] hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(202,138,4)] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            {loading ? 'Carregando...' : 'Comecar!'}
                        </button>
                    </motion.div>
                )}

                {/* Playing state */}
                {gameState === 'playing' && questions.length > 0 && currentIndex < questions.length && (
                    <div className="w-full">
                        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 text-center min-h-[200px] flex flex-col items-center justify-center w-full relative mb-6">
                            <div className="absolute top-6 right-6 text-sm font-bold text-gray-300">
                                #{currentIndex + 1}
                            </div>

                            <div className="min-h-[80px] flex items-center justify-center">
                                {renderFormattedText(
                                    questions[currentIndex].problem,
                                    "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
                                )}
                            </div>
                        </div>

                        {/* 2x2 option grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {options.map((option, i) => {
                                const isSelected = selectedOption === i;
                                const isCorrect = i === correctOptionIndex;
                                const showFeedback = selectedOption !== null;

                                let borderClass = "border-gray-200 hover:border-yellow-400";
                                let bgClass = "bg-white hover:bg-yellow-50";

                                if (showFeedback) {
                                    if (isCorrect) {
                                        borderClass = "border-green-500";
                                        bgClass = "bg-green-50";
                                    } else if (isSelected && !isCorrect) {
                                        borderClass = "border-red-500";
                                        bgClass = "bg-red-50";
                                    } else {
                                        borderClass = "border-gray-100";
                                        bgClass = "bg-gray-50 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionSelect(i)}
                                        disabled={selectedOption !== null}
                                        className={cn(
                                            "p-3.5 sm:p-5 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center min-h-[60px] sm:min-h-[72px] flex items-center justify-center",
                                            borderClass,
                                            bgClass,
                                            selectedOption === null && "cursor-pointer",
                                            selectedOption !== null && "cursor-default",
                                        )}
                                    >
                                        {renderFormattedText(option, "text-gray-800")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Finished state */}
                {gameState === 'finished' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full max-w-lg"
                    >
                        {/* Score display */}
                        <div className="mb-6">
                            {isNewBest && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold mb-3"
                                >
                                    <Star className="w-4 h-4 fill-yellow-500" />
                                    Novo recorde!
                                </motion.div>
                            )}
                            <div className="text-5xl sm:text-7xl font-bold text-yellow-500 mb-2">{score}</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {strikes >= MAX_STRIKES ? 'Game Over!' : 'Tempo Esgotado!'}
                            </h2>
                            <p className="text-gray-500 mb-1">
                                {score === 1 ? '1 problema resolvido' : `${score} problemas resolvidos`}
                                {' '}em {formatTime(GAME_DURATION - timeLeft)}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {strikes} {strikes === 1 ? 'erro' : 'erros'}
                                {personalBest > 0 && ` · Melhor: ${personalBest}`}
                            </p>
                        </div>

                        {/* Leaderboard */}
                        {leaderboard.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
                                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-bold text-gray-900">Top 10 — {moduleData?.title}</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {leaderboard.map((entry, i) => (
                                        <div key={i} className="px-5 py-2.5 flex items-center gap-3">
                                            <span className={cn(
                                                "text-sm font-bold w-6 text-center",
                                                i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-300"
                                            )}>
                                                {i < 3 ? ['1o', '2o', '3o'][i] : `${i + 1}o`}
                                            </span>
                                            <span className="flex-1 text-sm font-medium text-gray-700 truncate text-left">
                                                {entry.full_name || 'Anonimo'}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">{entry.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {savingScore && (
                            <p className="text-xs text-gray-400 mb-4">Salvando pontuacao...</p>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setGameState('ready');
                                    setQuestions([]);
                                }}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-500 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Jogar Novamente
                            </button>
                            <Link
                                href={`/dashboard/${moduleId}`}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all flex items-center justify-center"
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
