'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Dumbbell, Eye, Check, X, RotateCcw, Lock, Zap } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/ui/MathRenderer';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { curriculum } from '@/data/curriculum';
import { useTranslations, useLocale } from 'next-intl';
import CrowFeedback from '@/components/ui/CrowFeedback';
import { getLearnContent } from '@/data/learn-content';
import LearnBlockRenderer from '@/components/ui/LearnBlockRenderer';
import FunctionGraphBlock from '@/components/ui/blocks/FunctionGraphBlock';
import { parseGraphFromQuestion } from '@/lib/latexToJs';
import { shuffleArray } from '@/lib/blitz-constants';

type Tab = 'learn' | 'practice' | 'recognize';

type Question = {
    id: string;
    problem: string;
    solution_latex: string;
    difficulty: number;
    distractors?: string[] | null;
    problem_en?: string | null;
    solution_latex_en?: string | null;
};

type RecognizeQuestion = {
    id: string;
    problem: string;
    subcategory: string;
};

export default function MethodClient({ isPremium }: { isPremium: boolean }) {
    const [activeTab, setActiveTab] = useState<Tab>('learn');
    const params = useParams();
    const t = useTranslations('Method');
    const tc = useTranslations('Curriculum');
    const tCommon = useTranslations('Common');
    const te = useTranslations('Explanations');
    const locale = useLocale();

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

    // ── Practice Mode Toggle (open vs alternatives) ──
    const [practiceMode, setPracticeMode] = useState<'open' | 'alternatives'>('open');
    const [mcOptions, setMcOptions] = useState<string[]>([]);
    const [mcCorrectIndex, setMcCorrectIndex] = useState<number>(0);
    const [mcSelected, setMcSelected] = useState<number | null>(null);

    // ── Recognize Tab State ──
    const [recognizeQuestions, setRecognizeQuestions] = useState<RecognizeQuestion[]>([]);
    const [recognizeIndex, setRecognizeIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [recognizeOptions, setRecognizeOptions] = useState<string[]>([]);
    const [recognizeLoading, setRecognizeLoading] = useState(false);
    const [recognizeScore, setRecognizeScore] = useState({ correct: 0, total: 0 });
    const recognizeFetched = useRef(false);

    // ── Crow Feedback State ──
    const [crowFeedback, setCrowFeedback] = useState<'correct' | 'wrong' | null>(null);

    // ── Emotional Feedback State ──
    const [borderFlash, setBorderFlash] = useState<'green' | 'rose' | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [encouragementKey, setEncouragementKey] = useState<string | null>(null);
    const streakRef = useRef(0);
    const [streak, setStreak] = useState(0);

    const supabaseRef = useRef(createClient());

    // Index of current topic in the module (used for recognize gating)
    const currentTopicIndex = useMemo(() => {
        if (!moduleData) return -1;
        return moduleData.topics.findIndex(t => t.id === methodId);
    }, [moduleData, methodId]);

    // Recognize is only available from the 4th topic onwards (index >= 3)
    const recognizeAvailable = currentTopicIndex >= 3;

    // Previous topics only (excludes current) — used for recognize exercises
    const previousTopicIds = useMemo(() => {
        if (!moduleData || currentTopicIndex <= 0) return [];
        return moduleData.topics.slice(0, currentTopicIndex).map(t => t.id);
    }, [moduleData, currentTopicIndex]);

    // Graph data for graph_sketching questions (parsed from problem + solution)
    const graphData = useMemo(() => {
        if (methodId !== 'graph_sketching') return null;
        const q = questions[currentIndex];
        if (!q) return null;
        return parseGraphFromQuestion(q.problem, q.solution_latex);
    }, [methodId, questions, currentIndex]);

    // ── Practice: Fetch Questions ──
    const fetchQuestions = useCallback(async () => {
        if (!params.method || questionsFetched.current) return;
        setLoading(true);
        const supabase = supabaseRef.current;

        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, solution_latex, difficulty, distractors, problem_en, solution_latex_en')
            .eq('subcategory', params.method)
            .limit(20);

        if (error) {
            console.error('Failed to fetch questions:', error.message);
        } else if (data) {
            setQuestions([...data].sort(() => Math.random() - 0.5));
            questionsFetched.current = true;
        }
        setLoading(false);
    }, [params.method]);

    useEffect(() => {
        if (activeTab === 'practice' && !questionsFetched.current) {
            fetchQuestions();
        }
    }, [activeTab, fetchQuestions]);

    // ── MC helpers ──
    const stripAnswerPrefix = (latex: string): string => {
        return latex.replace(/^\$\s*(?:f'\(x\)\s*=\s*|y'\s*=\s*|y\s*=\s*)/i, '$');
    };

    /** Check if a question's distractors are comparable in length to the answer.
     *  If the correct answer is much longer than the distractors, the longest
     *  option is an obvious giveaway — fall back to open mode instead. */
    const hasGoodDistractors = useCallback((question: Question): boolean => {
        if (!question.distractors || question.distractors.length < 3) return false;
        const correctLen = question.solution_latex.replace(/\$/g, '').length;
        const maxDistractorLen = Math.max(
            ...question.distractors.map(d => d.replace(/\$/g, '').length)
        );
        // If correct answer is more than 1.8× the longest distractor, it's too obvious
        return correctLen <= maxDistractorLen * 1.8;
    }, []);

    const buildMcOptions = useCallback((question: Question) => {
        if (!hasGoodDistractors(question)) return;
        const correct = stripAnswerPrefix(question.solution_latex);
        const allOptions = shuffleArray([correct, ...question.distractors!]);
        setMcOptions(allOptions);
        setMcCorrectIndex(allOptions.indexOf(correct));
        setMcSelected(null);
    }, [hasGoodDistractors]);

    // Build MC options when question or mode changes
    useEffect(() => {
        if (practiceMode !== 'alternatives') return;
        const q = questions[currentIndex];
        if (q && hasGoodDistractors(q)) {
            buildMcOptions(q);
        }
    }, [practiceMode, currentIndex, questions, buildMcOptions, hasGoodDistractors]);

    const XP_MAP: Record<string, number> = { Easy: 10, Medium: 20, Hard: 30 };

    const handleMcSelect = (index: number) => {
        if (mcSelected !== null || ratingSubmitted) return;
        setMcSelected(index);
        handleRate(index === mcCorrectIndex ? 'good' : 'wrong');
    };

    const ENCOURAGEMENT_KEYS = [
        'encouragement1', 'encouragement2', 'encouragement3',
        'encouragement4', 'encouragement5', 'encouragement6',
    ];

    const handleRate = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
        if (ratingSubmitted) return;
        setRatingSubmitted(true);

        const difficulty = topicData?.difficulty || 'Medium';
        const xp = XP_MAP[difficulty] || 20;

        // Streak logic
        if (rating === 'wrong') {
            streakRef.current = 0;
            setStreak(0);
        } else {
            streakRef.current += 1;
            setStreak(streakRef.current);
        }

        // XP popup — suppress for wrong
        if (rating !== 'wrong') {
            setXpPopup(xp);
            setTimeout(() => setXpPopup(null), 1200);
        }

        // Show crow feedback
        setCrowFeedback(rating === 'wrong' ? 'wrong' : 'correct');
        setTimeout(() => setCrowFeedback(null), 1200);

        // Border flash — green for good/easy, rose for wrong, none for hard
        if (rating === 'good' || rating === 'easy') {
            setBorderFlash('green');
            setTimeout(() => setBorderFlash(null), 500);
        } else if (rating === 'wrong') {
            setBorderFlash('rose');
            setTimeout(() => setBorderFlash(null), 500);
        }

        // Confetti — only for good/easy
        if (rating === 'good' || rating === 'easy') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 800);
        }

        // Encouragement — only for wrong
        if (rating === 'wrong') {
            const key = ENCOURAGEMENT_KEYS[Math.floor(Math.random() * ENCOURAGEMENT_KEYS.length)];
            setEncouragementKey(key);
            setTimeout(() => setEncouragementKey(null), 2000);
        }

        // Call the complete endpoint
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
            setMcSelected(null);
            setCurrentIndex((prev) => (prev + 1) % questions.length);
        }, 600);
    };

    // ── Recognize: Fetch Questions ──
    const fetchRecognizeQuestions = useCallback(async () => {
        if (recognizeFetched.current || previousTopicIds.length === 0) return;
        setRecognizeLoading(true);
        const supabase = supabaseRef.current;

        // Fetch a large pool so we can randomly sample a fresh set each time
        const { data, error } = await supabase
            .from('questions')
            .select('id, problem, subcategory')
            .in('subcategory', previousTopicIds)
            .limit(200);

        if (error) {
            console.error('Failed to fetch recognize questions:', error.message);
        } else if (data && data.length > 0) {
            // Shuffle the full pool, then take 20
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setRecognizeQuestions(shuffled.slice(0, 20));
            recognizeFetched.current = true;
        }
        setRecognizeLoading(false);
    }, [previousTopicIds]);

    useEffect(() => {
        if (activeTab === 'recognize' && !recognizeFetched.current) {
            fetchRecognizeQuestions();
        }
    }, [activeTab, fetchRecognizeQuestions]);

    // Compute options when question changes — distractors from previous topics only
    useEffect(() => {
        if (recognizeQuestions.length === 0 || recognizeIndex >= recognizeQuestions.length) return;

        const correctId = recognizeQuestions[recognizeIndex].subcategory;
        const others = previousTopicIds.filter(id => id !== correctId);

        // Pick up to 3 distractors
        const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
        const options = [correctId, ...shuffledOthers.slice(0, 3)];

        // Shuffle final options
        setRecognizeOptions([...options].sort(() => Math.random() - 0.5));
    }, [recognizeIndex, recognizeQuestions, previousTopicIds]);

    const handleRecognizeAnswer = (optionId: string) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(optionId);
        const isCorrect = optionId === recognizeQuestions[recognizeIndex].subcategory;
        setRecognizeScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1,
        }));

        // Show crow feedback
        setCrowFeedback(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => setCrowFeedback(null), 1200);

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
        return tc.has(`${topicId}.title`) ? tc(`${topicId}.title`) : topicId;
    };

    // Strip Portuguese instruction prefixes from DB problem text
    // (the translated prompt is already shown separately via i18n)
    const stripProblemPrefix = (text: string) =>
        text.replace(/^(Calcule\s+|Derive\s+|Resolva\s+|Encontre\s+|Determine\s+|Calculate\s+|Differentiate\s+|Solve\s+|Find\s+|Determine\s+)/i, '');

    // Locale-aware field selectors
    const lp = (q: Question) => locale === 'en' && q.problem_en ? q.problem_en : q.problem;
    const ls = (q: Question) => locale === 'en' && q.solution_latex_en ? q.solution_latex_en : q.solution_latex;

    // Helper to render mixed text and LaTeX (e.g. "Derive $f(x)$")
    const renderFormattedText = (text: string, className: string = "") => {
        const parts = text.split('$');
        return (
            <span className={className}>
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return <span key={index} className="font-normal">{part}</span>;
                    } else {
                        // Use displaystyle for operators with limits (lim, sum, prod) so
                        // subscripts render below instead of to the side
                        const needsDisplay = /\\(lim|sum|prod)(?![a-zA-Z])/.test(part);
                        const latex = needsDisplay ? `\\displaystyle ${part}` : part;
                        return <MathRenderer key={index} latex={latex} />;
                    }
                })}
            </span>
        );
    };

    // Render solution with semicolon line-breaks
    const renderSolution = (text: string, className: string = "") => {
        const segments = text.split(';').map(s => s.trim()).filter(Boolean);
        if (segments.length <= 1) {
            return renderFormattedText(text, className);
        }
        return (
            <div className={className}>
                {segments.map((seg, i) => (
                    <div key={i} className="mb-1">
                        {renderFormattedText(seg, "")}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={{ pathname: '/dashboard/[module]', params: { module: params.module as string } }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tc.has(`${moduleId}.title`) ? tc(`${moduleId}.title`) : (moduleData?.title || params.module)}</span>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900">{tc.has(`${methodId}.title`) ? tc(`${methodId}.title`) : t('topic')}</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[
                        { id: 'learn', label: t('tabLearn'), icon: BookOpen },
                        { id: 'practice', label: t('tabPractice'), icon: Dumbbell },
                        ...(recognizeAvailable ? [{ id: 'recognize', label: t('tabRecognize'), icon: Eye }] : []),
                    ].map((tab) => {
                        const locked = tab.id === 'recognize' && !isPremium;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => !locked && setActiveTab(tab.id as Tab)}
                                className={cn(
                                    "flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all",
                                    locked
                                        ? "text-gray-300 cursor-not-allowed"
                                        : activeTab === tab.id
                                        ? "bg-white text-black shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {locked ? <Lock className="w-3.5 h-3.5" /> : <tab.icon className="w-4 h-4" />}
                                <span className="hidden sm:block">{tab.label}</span>
                            </button>
                        );
                    })}
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
                            // New block-based layout for topics with content
                            const blocks = getLearnContent(locale)[methodId];
                            if (blocks) {
                                const topicTitle = tc.has(`${methodId}.title`) ? tc(`${methodId}.title`) : (topicData?.title || methodId);
                                return <LearnBlockRenderer blocks={blocks} topicTitle={topicTitle} onSwitchToTrain={() => setActiveTab('practice')} />;
                            }

                            // Fallback: old i18n-based renderer
                            const hasExplanation = te.has(`${methodId}.intuitionTitle`);
                            // Use te.raw() for all explanation fields — they contain LaTeX
                            // with braces that next-intl would misinterpret as ICU placeholders
                            const raw = (key: string) => String(te.raw(`${methodId}.${key}`));
                            return (
                                <div className="space-y-6">
                                    {hasExplanation ? (
                                        <>
                                            {/* Intuition section */}
                                            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-xl sm:text-2xl font-bold mb-4">{raw('intuitionTitle')}</h2>
                                                <div className="text-gray-600 leading-relaxed text-lg mb-6">
                                                    {renderFormattedText(raw('intuition'), "")}
                                                </div>
                                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 block">{t('mainFormula')}</span>
                                                    <MathRenderer latex={raw('formulaLatex')} display className="text-xl sm:text-3xl text-blue-700" />
                                                </div>
                                            </div>

                                            {/* Proof / formal explanation */}
                                            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-xl sm:text-2xl font-bold mb-4">{raw('proofTitle')}</h2>
                                                <div className="text-gray-600 leading-loose text-base sm:text-[1.175rem]">
                                                    {renderFormattedText(raw('proof'), "")}
                                                </div>
                                            </div>

                                            {/* Worked examples */}
                                            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200">
                                                <h2 className="text-2xl font-bold mb-6">{t('workedExamples')}</h2>
                                                <div className="space-y-6">
                                                    {[0, 1].map((i) => (
                                                        <div key={i} className="border border-gray-100 rounded-xl p-6">
                                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                                                {t('exampleLabel', { n: i + 1 })}
                                                            </div>
                                                            <div className="text-lg font-bold text-gray-900 mb-4">
                                                                {renderFormattedText(String(te.raw(`${methodId}.examples.${i}.problem`)), "")}
                                                            </div>
                                                            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                                                <span className="text-xs font-bold text-green-600 uppercase mb-2 block">{t('solution')}</span>
                                                                <div className="text-gray-700 leading-relaxed">
                                                                    {renderFormattedText(String(te.raw(`${methodId}.examples.${i}.solution`)), "")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                                            <h2 className="text-2xl font-bold mb-4">{t('intuitionFallback')}</h2>
                                            <p className="text-gray-500">{t('contentInDevelopment')}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {activeTab === 'practice' && (
                            <>
                            {/* Munin above the card */}
                            <div className="flex justify-center mb-4 h-[80px]">
                                <AnimatePresence>
                                    {crowFeedback && (
                                        <motion.div
                                            key={crowFeedback}
                                            initial={{ opacity: 0, scale: 0.6, y: 20 }}
                                            animate={{ opacity: 1, scale: streak >= 5 && crowFeedback === 'correct' ? 1.15 : 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.6, y: -10 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <Image
                                                src={crowFeedback === 'correct' ? '/munin/congrats.png' : '/munin/sad.png'}
                                                alt={crowFeedback === 'correct' ? 'Correct!' : 'Wrong'}
                                                width={80}
                                                height={80}
                                                className="h-[80px] w-auto drop-shadow-[0_4px_12px_rgba(139,92,246,0.35)]"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className={cn(
                                "bg-[rgba(139,92,246,0.02)] rounded-2xl p-5 sm:p-8 shadow-md border border-[rgba(139,92,246,0.12)] text-center min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden",
                                borderFlash === 'green' && 'border-flash-green',
                                borderFlash === 'rose' && 'border-flash-rose',
                                streak >= 10 && 'streak-glow',
                            )}>
                                {/* Progress bar */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100 rounded-t-2xl overflow-hidden">
                                    <div className="h-full bg-[#7C3AED] transition-all duration-300"
                                         style={{ width: `${(currentIndex / Math.max(questions.length, 1)) * 100}%` }} />
                                </div>

                                {/* Mode toggle */}
                                <div className="absolute top-4 left-4 z-10 flex bg-gray-100 rounded-lg p-0.5">
                                    {(['open', 'alternatives'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setPracticeMode(mode)}
                                            className={cn(
                                                "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                                practiceMode === mode
                                                    ? "bg-white text-gray-900 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            {mode === 'open' ? t('modeOpen') : t('modeAlternatives')}
                                        </button>
                                    ))}
                                </div>

                                {/* Confetti */}
                                {showConfetti && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="confetti-dot"
                                                style={{
                                                    left: `${20 + i * 15}%`, top: '40%',
                                                    backgroundColor: i % 2 === 0 ? '#7C3AED' : '#F59E0B',
                                                    animationDelay: `${i * 0.08}s`,
                                                }} />
                                        ))}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="text-gray-400 animate-pulse">{t('loadingQuestions')}</div>
                                ) : questions.length > 0 ? (
                                    <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-full max-w-2xl"
                                    >
                                        <div className="absolute top-6 right-6 text-sm font-bold text-gray-900 flex items-center gap-2">
                                            {streak >= 3 && (
                                                <span className="text-orange-500">🔥 {streak}</span>
                                            )}
                                            #{currentIndex + 1} / {questions.length}
                                        </div>

                                        <span className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 block">
                                            {practiceMode === 'alternatives' && hasGoodDistractors(questions[currentIndex])
                                                ? t('modeAlternatives')
                                                : t(`prompt${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}`)}
                                        </span>

                                        <div className="mb-12 min-h-[120px] flex items-center justify-center">
                                            {renderFormattedText(stripProblemPrefix(lp(questions[currentIndex])), "text-2xl sm:text-4xl md:text-5xl font-bold text-[#7C3AED]")}
                                        </div>

                                        {/* Alternatives mode with distractors */}
                                        {practiceMode === 'alternatives' && hasGoodDistractors(questions[currentIndex]) ? (
                                            <div className="space-y-4 relative">
                                                {/* XP popup animation */}
                                                <AnimatePresence>
                                                    {xpPopup !== null && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 0 }}
                                                            animate={{ opacity: 1, y: -30 }}
                                                            exit={{ opacity: 0, y: -50 }}
                                                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold text-amber-500 pointer-events-none"
                                                        >
                                                            +{xpPopup} XP
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                                    {mcOptions.map((option, i) => {
                                                        const isSelected = mcSelected === i;
                                                        const isCorrect = i === mcCorrectIndex;
                                                        const showFeedback = mcSelected !== null;

                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleMcSelect(i)}
                                                                disabled={showFeedback}
                                                                className={cn(
                                                                    "p-3.5 sm:p-5 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center min-h-[60px] sm:min-h-[72px] flex items-center justify-center",
                                                                    showFeedback && isCorrect
                                                                        ? "border-green-500 bg-green-50"
                                                                        : showFeedback && isSelected && !isCorrect
                                                                        ? "border-red-500 bg-red-50"
                                                                        : showFeedback
                                                                        ? "border-gray-100 bg-gray-50 opacity-50"
                                                                        : "border-gray-200 bg-white hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
                                                                )}
                                                            >
                                                                {renderFormattedText(option, "text-gray-800")}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                        /* Open mode OR no distractors — existing flow */
                                        <>
                                        <AnimatePresence>
                                            {showAnswer && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-8"
                                                >
                                                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                                        <span className="text-xs font-bold text-green-600 uppercase mb-2 block">{t('answer')}</span>
                                                        {renderSolution(ls(questions[currentIndex]), "text-xl sm:text-2xl text-green-700 font-bold")}
                                                    </div>
                                                    {graphData && (
                                                        <div className="mt-4">
                                                            <FunctionGraphBlock block={{
                                                                id: 'practice-graph',
                                                                type: 'graph',
                                                                content: '',
                                                                fn: graphData.fn,
                                                                domain: graphData.domain,
                                                                annotations: graphData.annotations,
                                                            }} />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!showAnswer ? (
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    onClick={() => setShowAnswer(true)}
                                                    className="px-6 sm:px-8 py-2 sm:py-2.5 border-2 border-purple-400 text-gray-900 rounded-full hover:bg-purple-50 font-bold transition-all purple-mist"
                                                >
                                                    {t('showAnswer')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 relative">
                                                {/* XP popup animation */}
                                                <AnimatePresence>
                                                    {xpPopup !== null && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 0 }}
                                                            animate={{ opacity: 1, y: -30 }}
                                                            exit={{ opacity: 0, y: -50 }}
                                                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold text-amber-500 pointer-events-none"
                                                        >
                                                            +{xpPopup} XP
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Self-rating buttons */}
                                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block">
                                                    {t('howWasIt')}
                                                </span>
                                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                                                    {[
                                                        { id: 'wrong' as const, label: t('ratingWrong'), color: 'border-rose-300 text-rose-500 hover:bg-rose-50' },
                                                        { id: 'hard' as const, label: t('ratingHard'), color: 'border-orange-300 text-orange-500 hover:bg-orange-50' },
                                                        { id: 'good' as const, label: t('ratingGood'), color: 'border-purple-300 text-purple-500 hover:bg-purple-50' },
                                                        { id: 'easy' as const, label: t('ratingEasy'), color: 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' },
                                                    ].map((btn) => (
                                                        <button
                                                            key={btn.id}
                                                            onClick={() => handleRate(btn.id)}
                                                            disabled={ratingSubmitted}
                                                            className={cn(
                                                                "px-6 py-2 rounded-full border-2 font-bold transition-all text-xs sm:text-sm purple-mist",
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
                                        </>
                                        )}
                                    </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="text-gray-400">
                                        <p>{t('noQuestions')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Encouragement message */}
                            <AnimatePresence>
                                {encouragementKey && (
                                    <motion.p key={encouragementKey}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center text-rose-400 font-medium mt-4 text-sm">
                                        {t(encouragementKey)}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            </>
                        )}

                        {activeTab === 'recognize' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center relative">
                                {recognizeLoading ? (
                                    <div className="text-gray-400 animate-pulse">{t('loadingQuestions')}</div>
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
                                                {t('whichMethod')}
                                            </span>

                                            <div className="mb-12 min-h-[120px] flex items-center justify-center">
                                                {renderFormattedText(
                                                    stripProblemPrefix(recognizeQuestions[recognizeIndex].problem),
                                                    "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
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
                                            <div className="text-4xl sm:text-6xl font-bold mb-2">
                                                <span className="text-green-500">{recognizeScore.correct}</span>
                                                <span className="text-gray-300"> / </span>
                                                <span className="text-gray-400">{recognizeScore.total}</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('roundComplete')}</h2>
                                            <p className="text-gray-500 mb-8">
                                                {recognizeScore.correct === recognizeScore.total
                                                    ? t('perfectScore')
                                                    : t('scoreResult', { correct: recognizeScore.correct, total: recognizeScore.total })
                                                }
                                            </p>
                                            <button
                                                onClick={handleRecognizeRestart}
                                                className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                                {tCommon('playAgain')}
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-400">
                                        <p>{t('noRecognizeQuestions')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Watermark */}
            <div className="pb-6 -mt-4 text-center text-lg text-gray-400 font-extrabold tracking-wide select-none">
                JustMathing.com
            </div>

            {activeTab === 'recognize' && <CrowFeedback type={crowFeedback} streak={streak} />}
        </div>
    );
}
