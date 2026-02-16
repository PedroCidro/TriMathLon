'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Swords, Trophy, Loader2, Crown, Copy, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import { motion } from 'framer-motion';
import { curriculum } from '@/data/curriculum';
import { useTranslations } from 'next-intl';
import {
    MAX_STRIKES,
    FEEDBACK_DELAY,
    shuffleArray,
    stripProblemPrefix,
    formatTime,
} from '@/lib/blitz-constants';

type Question = {
    id: string;
    problem: string;
    solution_latex: string;
    distractors: string[];
    difficulty: number;
};

type ChallengeGameState = 'loading' | 'waiting' | 'countdown' | 'playing' | 'finished';

type PollData = {
    status: string;
    game_started_at: string | null;
    game_duration_seconds: number;
    opponent_score: number;
    opponent_strikes: number;
    opponent_current_index: number;
    opponent_finished: boolean;
};

type LeaderboardEntry = {
    rank: number;
    user_id: string;
    name: string | null;
    score: number;
    strikes: number;
    is_you: boolean;
};

export default function ChallengeBlitzClient({
    challengeId,
    moduleId,
    isCreator,
    gameDuration,
    challengeStatus,
    challengeType = 'duel',
    opponentName,
    isPremium,
    unlockedPremiumTopics,
}: {
    challengeId: string;
    moduleId: string;
    isCreator: boolean;
    gameDuration: number;
    challengeStatus: string;
    challengeType: 'duel' | 'public';
    opponentName: string | null;
    isPremium: boolean;
    unlockedPremiumTopics: string[];
}) {
    const moduleData = curriculum.find(m => m.id === moduleId);
    const t = useTranslations('Challenge');
    const tBlitz = useTranslations('Blitz');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');

    const isPublic = challengeType === 'public';

    const [gameState, setGameState] = useState<ChallengeGameState>('loading');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameDuration);
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);

    // Options state
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

    // Opponent state (duel only)
    const [opponentScore, setOpponentScore] = useState(0);
    const [opponentIndex, setOpponentIndex] = useState(0);
    const [opponentFinished, setOpponentFinished] = useState(false);

    // Countdown
    const [countdownValue, setCountdownValue] = useState(3);

    // Game finished flag for sending final score
    const [myFinished, setMyFinished] = useState(false);

    // Public challenge results
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [attemptCount, setAttemptCount] = useState(0);
    const [copied, setCopied] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const scoreUpdateRef = useRef<NodeJS.Timeout | null>(null);
    const gameStartedAtRef = useRef<string | null>(null);
    const answerCountRef = useRef(0);

    const moduleTitle = tc.has(`${moduleId}.title`) ? tc(`${moduleId}.title`) : (moduleData?.title || moduleId);

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/challenge/${challengeId}`
        : '';

    // Render formatted text with inline LaTeX
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

    // Build shuffled options
    const buildOptions = useCallback((question: Question) => {
        const correct = question.solution_latex;
        const allOptions = shuffleArray([correct, ...question.distractors]);
        setOptions(allOptions);
        setCorrectOptionIndex(allOptions.indexOf(correct));
        setSelectedOption(null);
    }, []);

    // Fetch questions
    const fetchQuestions = useCallback(async () => {
        try {
            const res = await fetch(`/api/challenge/questions?challenge_id=${challengeId}`);
            if (!res.ok) return;
            const data = await res.json();
            setQuestions(data.questions || []);
        } catch (err) {
            console.error('Failed to fetch challenge questions:', err);
        }
    }, [challengeId]);

    // Send score update (duel only)
    const sendScoreUpdate = useCallback(async (finished: boolean = false) => {
        try {
            await fetch('/api/challenge/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challenge_id: challengeId,
                    score,
                    strikes,
                    current_index: currentIndex,
                    finished,
                }),
            });
        } catch (err) {
            console.error('Failed to update score:', err);
        }
    }, [challengeId, score, strikes, currentIndex]);

    // Save attempt (public only)
    const saveAttempt = useCallback(async (finalScore: number, finalStrikes: number) => {
        try {
            const res = await fetch('/api/challenge/save-attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challenge_id: challengeId,
                    score: finalScore,
                    strikes: finalStrikes,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data.leaderboard || []);
                setAttemptCount(data.attempt_count || 0);
            }
        } catch (err) {
            console.error('Failed to save attempt:', err);
        }
    }, [challengeId]);

    // Poll opponent status (duel only)
    const pollOpponent = useCallback(async () => {
        try {
            const res = await fetch(`/api/challenge/poll?challenge_id=${challengeId}`);
            if (!res.ok) return;
            const data: PollData = await res.json();

            setOpponentScore(data.opponent_score);
            setOpponentIndex(data.opponent_current_index);
            setOpponentFinished(data.opponent_finished);

            // If game status changed
            if (data.status === 'playing' && !gameStartedAtRef.current && data.game_started_at) {
                gameStartedAtRef.current = data.game_started_at;
            }

            // If status became 'ready' and we're waiting, start countdown
            if (data.status === 'ready' && gameState === 'waiting') {
                setGameState('countdown');
            }

            // If status is playing and we haven't started yet, sync timer
            if (data.status === 'playing' && data.game_started_at) {
                gameStartedAtRef.current = data.game_started_at;
                if (gameState === 'waiting' || gameState === 'countdown') {
                    setGameState('playing');
                    const elapsed = Math.floor((Date.now() - new Date(data.game_started_at).getTime()) / 1000);
                    setTimeLeft(Math.max(0, gameDuration - elapsed));
                }
            }

            return data;
        } catch (err) {
            console.error('Poll error:', err);
        }
    }, [challengeId, gameDuration, gameState]);

    // Initial load: fetch questions and determine state
    useEffect(() => {
        async function init() {
            await fetchQuestions();

            if (isPublic) {
                // Public: start playing immediately (no waiting/countdown)
                setGameState('playing');
            } else {
                // Duel: poll to get current status
                const data = await pollOpponent();

                if (data?.status === 'playing' && data.game_started_at) {
                    gameStartedAtRef.current = data.game_started_at;
                    const elapsed = Math.floor((Date.now() - new Date(data.game_started_at).getTime()) / 1000);
                    setTimeLeft(Math.max(0, gameDuration - elapsed));
                    setGameState('playing');
                } else if (data?.status === 'ready') {
                    setGameState('countdown');
                } else if (data?.status === 'finished') {
                    setGameState('finished');
                    setMyFinished(true);
                    setOpponentFinished(true);
                } else {
                    setGameState('waiting');
                }
            }
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Countdown effect (duel only)
    useEffect(() => {
        if (gameState !== 'countdown' || isPublic) return;

        setCountdownValue(3);
        const interval = setInterval(() => {
            setCountdownValue(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (isCreator) {
                        fetch('/api/challenge/start', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ challenge_id: challengeId }),
                        });
                    }
                    setGameState('playing');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, isCreator, challengeId, isPublic]);

    // Set up options when currentIndex changes
    useEffect(() => {
        if (gameState !== 'playing' || currentIndex >= questions.length) return;
        if (questions.length > 0) {
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

    // Poll opponent during playing/waiting states (duel only)
    useEffect(() => {
        if (isPublic) return;
        if (gameState !== 'playing' && gameState !== 'waiting') return;

        pollRef.current = setInterval(pollOpponent, 4000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [gameState, pollOpponent, isPublic]);

    // Send final score when game finishes
    useEffect(() => {
        if (gameState === 'finished' && !myFinished) {
            setMyFinished(true);
            if (isPublic) {
                saveAttempt(score, strikes);
            } else {
                sendScoreUpdate(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    // Clean up timers on unmount
    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            if (scoreUpdateRef.current) clearTimeout(scoreUpdateRef.current);
        };
    }, []);

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        const isCorrect = index === correctOptionIndex;
        const newScore = isCorrect ? score + 1 : score;
        const newStrikes = isCorrect ? strikes : strikes + 1;

        if (isCorrect) setScore(newScore);
        if (!isCorrect) setStrikes(newStrikes);

        answerCountRef.current++;

        // Send score update every 2 answers (duel only)
        if (!isPublic && answerCountRef.current % 2 === 0) {
            fetch('/api/challenge/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challenge_id: challengeId,
                    score: newScore,
                    strikes: newStrikes,
                    current_index: currentIndex + 1,
                    finished: false,
                }),
            }).catch(console.error);
        }

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

    // Determine winner (duel only)
    const getResultLabel = () => {
        if (score > opponentScore) return t('youWin');
        if (score < opponentScore) return t('youLose');
        return t('itsTie');
    };

    const getResultColor = () => {
        if (score > opponentScore) return 'text-green-500';
        if (score < opponentScore) return 'text-red-500';
        return 'text-yellow-500';
    };

    // Resolve premium topic names for CTA
    const premiumTopicNames = unlockedPremiumTopics
        .map(id => tc.has(`${id}.title`) ? tc(`${id}.title`) : id)
        .join(', ');

    const currentProblem = questions[currentIndex]?.problem ?? '';

    // WhatsApp share for public challenges
    const handleShareWhatsApp = () => {
        const text = t('publicShareWhatsApp', {
            score: String(score),
            topics: moduleTitle,
            link: shareUrl,
        });
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={{ pathname: '/dashboard/[module]', params: { module: moduleId } }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        {isPublic ? (
                            <Trophy className="w-5 h-5 text-orange-500" />
                        ) : (
                            <Swords className="w-5 h-5 text-orange-500" />
                        )}
                        <h1 className="text-base sm:text-lg font-bold text-gray-900">
                            {isPublic ? t('scoreAttack') : t('challengeFriend')} — {moduleTitle}
                        </h1>
                    </div>
                </div>

                {gameState === 'playing' && (
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Opponent info bar (duel only) */}
                        {!isPublic && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                                <span className="text-xs font-medium text-gray-500">{opponentName || t('opponent')}</span>
                                <span className="text-sm font-bold text-gray-900">{opponentScore}</span>
                                <span className="text-xs text-gray-400">#{opponentIndex}</span>
                            </div>
                        )}

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
                {/* Loading */}
                {gameState === 'loading' && (
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                        <p className="text-gray-500">{tCommon('loading')}</p>
                    </div>
                )}

                {/* Waiting for opponent (duel only) */}
                {gameState === 'waiting' && !isPublic && (
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waitingToStart')}</h2>
                        <p className="text-gray-500">{t('waitingForOpponent')}</p>
                    </div>
                )}

                {/* Countdown (duel only) */}
                {gameState === 'countdown' && !isPublic && (
                    <motion.div
                        key={countdownValue}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="text-center"
                    >
                        <div className="text-8xl font-bold text-orange-500 mb-4">
                            {countdownValue > 0 ? countdownValue : ''}
                        </div>
                        <p className="text-xl font-bold text-gray-900">{t('getReady')}</p>
                    </motion.div>
                )}

                {/* Playing */}
                {gameState === 'playing' && questions.length > 0 && currentIndex < questions.length && (
                    <div className="w-full">
                        {/* Mobile opponent bar (duel only) */}
                        {!isPublic && (
                            <div className="flex sm:hidden items-center justify-between mb-4 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                                <span className="text-xs font-medium text-gray-500">{opponentName || t('opponent')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{opponentScore}</span>
                                    <span className="text-xs text-gray-400">#{opponentIndex}</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 text-center min-h-[200px] flex flex-col items-center justify-center w-full relative mb-6">
                            <div className="absolute top-6 right-6 text-sm font-bold text-gray-300">
                                #{currentIndex + 1}
                            </div>

                            <div className="min-h-[80px] flex items-center justify-center">
                                {renderFormattedText(
                                    stripProblemPrefix(currentProblem),
                                    "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
                                )}
                            </div>
                        </div>

                        {/* Option grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {options.map((option, i) => {
                                const isSelected = selectedOption === i;
                                const isCorrect = i === correctOptionIndex;
                                const showFeedback = selectedOption !== null;

                                let borderClass = "border-gray-200 hover:border-orange-400";
                                let bgClass = "bg-white hover:bg-orange-50";

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

                {/* Finished — Public Challenge */}
                {gameState === 'finished' && isPublic && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full max-w-lg"
                    >
                        {/* Score header */}
                        <div className="mb-6">
                            <Trophy className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                            <div className="text-5xl font-bold text-gray-900 mb-1">{score}</div>
                            <p className="text-sm text-gray-500">
                                {tBlitz('errorsCount', { count: strikes })}
                            </p>
                        </div>

                        {/* Leaderboard */}
                        {leaderboard.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">{t('leaderboard')}</h3>
                                <div className="space-y-2">
                                    {leaderboard.map((entry) => (
                                        <div
                                            key={entry.user_id}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-xl",
                                                entry.is_you ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-sm font-bold w-6 text-center",
                                                    entry.rank <= 3 ? "text-orange-500" : "text-gray-400"
                                                )}>
                                                    {entry.rank}
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {entry.name || '???'}
                                                    {entry.is_you && (
                                                        <span className="ml-1 text-xs text-orange-500 font-bold">({t('you')})</span>
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{entry.score}</span>
                                        </div>
                                    ))}
                                </div>
                                {attemptCount > leaderboard.length && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        {t('attempts', { count: attemptCount })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Share section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">{t('shareYourScore')}</p>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-mono select-all"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={cn(
                                        "p-2 rounded-lg border transition-all",
                                        copied ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={handleShareWhatsApp}
                                className="w-full px-4 py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 hover:shadow-lg transition-all"
                            >
                                {t('shareWhatsApp')}
                            </button>
                        </div>

                        {/* Watermark */}
                        <p className="text-xs text-gray-300 mb-4">justmathing.com</p>

                        {/* Premium CTA */}
                        {unlockedPremiumTopics.length > 0 && !isPremium && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-5 mb-6">
                                <div className="flex items-start gap-3">
                                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            {t('premiumCta', { topics: premiumTopicNames })}
                                        </p>
                                        <Link
                                            href="/premium"
                                            className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                        >
                                            {t('viewPremium')} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                href={{ pathname: '/dashboard/[module]', params: { module: moduleId } }}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all flex items-center justify-center"
                            >
                                {t('backToModule')}
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Finished — Duel */}
                {gameState === 'finished' && !isPublic && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full max-w-lg"
                    >
                        {/* Result header */}
                        <div className="mb-6">
                            <div className={cn("text-3xl font-bold mb-2", getResultColor())}>
                                {getResultLabel()}
                            </div>
                        </div>

                        {/* Score comparison */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                {/* My score */}
                                <div className="text-center flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">{t('you')}</p>
                                    <p className="text-5xl font-bold text-gray-900">{score}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {tBlitz('errorsCount', { count: strikes })}
                                    </p>
                                </div>

                                {/* VS */}
                                <div className="px-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-400">{t('vsLabel')}</span>
                                    </div>
                                </div>

                                {/* Opponent score */}
                                <div className="text-center flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">{opponentName || t('opponent')}</p>
                                    {opponentFinished ? (
                                        <p className="text-5xl font-bold text-gray-900">{opponentScore}</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <p className="text-5xl font-bold text-gray-300">{opponentScore}</p>
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400 mt-1" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Premium CTA */}
                        {unlockedPremiumTopics.length > 0 && !isPremium && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-5 mb-6">
                                <div className="flex items-start gap-3">
                                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            {t('premiumCta', { topics: premiumTopicNames })}
                                        </p>
                                        <Link
                                            href="/premium"
                                            className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                        >
                                            {t('viewPremium')} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                href={{ pathname: '/dashboard/[module]', params: { module: moduleId } }}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all flex items-center justify-center"
                            >
                                {t('backToModule')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
