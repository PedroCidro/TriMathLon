'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, GraduationCap, School, BookOpen, Brain, Users, ChevronRight, Building2, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, Link } from '@/i18n/routing';
import { toast } from 'sonner';
import Image from 'next/image';
import type { Department } from '@/data/institutions';
import { useTranslations } from 'next-intl';

type StepId = 'welcome' | 'dailyGoal' | 'motivation' | 'level' | 'institution' | 'completion';
type MotivationId = 'passing_exam' | 'deeper_understanding' | 'review' | 'curiosity';

const VALID_LEVELS = ['fundamental', 'medio', 'graduacao', 'pos', 'enthusiast'];

const MOTIVATION_TO_COMPLETION_KEY: Record<MotivationId, string> = {
    passing_exam: 'completionExam',
    deeper_understanding: 'completionUnderstand',
    review: 'completionReview',
    curiosity: 'completionCuriosity',
};

// Sprite map per step
const STEP_SPRITES: Record<string, string> = {
    welcome: '/munin/bright.png',
    dailyGoal: '/munin/base.png',
    motivation: '/munin/thinkingcurious.png',
    level: '/munin/thinking.png',
    institution: '/munin/happy.png',
    completion: '/munin/happy.png',
};

const DAILY_GOAL_PRESETS = [3, 5, 10, 15];

interface OnboardingClientProps {
    institutionId: string | null;
    institutionName: string | null;
    departments: Department[] | null;
}

export default function OnboardingClient({
    institutionId,
    institutionName,
    departments,
}: OnboardingClientProps) {
    const t = useTranslations('Onboarding');
    const tCommon = useTranslations('Common');
    const router = useRouter();

    const hasInstitution = !!institutionId;
    const hasDepartments = !!(departments && departments.length > 0);

    // Build dynamic step list
    const steps = useMemo<StepId[]>(() => {
        const base: StepId[] = ['welcome', 'dailyGoal', 'motivation', 'level'];
        if (hasInstitution) base.push('institution');
        base.push('completion');
        return base;
    }, [hasInstitution]);

    const [stepIndex, setStepIndex] = useState(0);
    const currentStep = steps[stepIndex];
    const progressPercent = ((stepIndex + 1) / steps.length) * 100;

    // Form state
    const [selectedMotivation, setSelectedMotivation] = useState<MotivationId | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [dailyGoal, setDailyGoal] = useState(5);
    const [loading, setLoading] = useState(false);

    const currentSprite = STEP_SPRITES[currentStep] ?? '/munin/base.png';

    const levels = [
        { id: 'fundamental', title: t('levelFundamental'), description: t('levelFundamentalDesc'), icon: <School className="w-6 h-6" /> },
        { id: 'medio', title: t('levelMedio'), description: t('levelMedioDesc'), icon: <BookOpen className="w-6 h-6" /> },
        { id: 'graduacao', title: t('levelGraduacao'), description: t('levelGraduacaoDesc'), icon: <GraduationCap className="w-6 h-6" /> },
        { id: 'pos', title: t('levelPos'), description: t('levelPosDesc'), icon: <Brain className="w-6 h-6" /> },
        { id: 'enthusiast', title: t('levelEnthusiast'), description: t('levelEnthusiastDesc'), icon: <Users className="w-6 h-6" /> },
    ];

    const motivations: { id: MotivationId; label: string; desc: string }[] = [
        { id: 'passing_exam', label: t('motivationExam'), desc: t('motivationExamDesc') },
        { id: 'deeper_understanding', label: t('motivationUnderstand'), desc: t('motivationUnderstandDesc') },
        { id: 'review', label: t('motivationReview'), desc: t('motivationReviewDesc') },
        { id: 'curiosity', label: t('motivationCuriosity'), desc: t('motivationCuriosityDesc') },
    ];

    const goNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(prev => prev + 1);
        }
    };

    const handleSubmitOnboarding = async () => {
        if (!selectedLevel || !VALID_LEVELS.includes(selectedLevel)) return;
        if (hasInstitution && hasDepartments && !selectedDepartment) return;
        setLoading(true);

        try {
            const res = await fetch('/api/profile/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academic_level: selectedLevel,
                    motivation: selectedMotivation,
                    institution: institutionId,
                    institution_department: selectedDepartment,
                    daily_goal: dailyGoal,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            // Redirect based on context
            if (hasInstitution) {
                router.push({ pathname: '/institutional/[institution]', params: { institution: institutionId! } });
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error(t('saveError', { msg }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200">
                <motion.div
                    className="h-full bg-purple-600 rounded-r-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait">
                        {/* ──────── Step 1: Welcome ──────── */}
                        {currentStep === 'welcome' && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                >
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={180}
                                        height={180}
                                        className="mx-auto h-[140px] sm:h-[180px] w-auto mb-6"
                                        priority
                                    />
                                </motion.div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                    {t('welcomeTitle')}
                                </h1>
                                <p className="text-lg text-gray-600 font-medium mb-3">
                                    {t('welcomeSubtitle')}
                                </p>
                                <p className="text-sm text-gray-400 font-medium italic mb-10">
                                    {t('welcomeTagline')}
                                </p>

                                <button
                                    onClick={goNext}
                                    className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none transition-all"
                                >
                                    {t('welcomeCta')}
                                </button>
                            </motion.div>
                        )}

                        {/* ──────── Step 2: Daily Goal ──────── */}
                        {currentStep === 'dailyGoal' && (
                            <motion.div
                                key="dailyGoal"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-center mb-6">
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={120}
                                        height={120}
                                        className="h-[80px] sm:h-[100px] w-auto"
                                    />
                                </div>
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                        {t('dailyGoalTitle')}
                                    </h1>
                                    <p className="text-sm text-gray-500 font-medium">{t('dailyGoalSubtitle')}</p>
                                </div>

                                {/* Number input with +/- buttons */}
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <button
                                        onClick={() => setDailyGoal(prev => Math.max(1, prev - 1))}
                                        className="w-12 h-12 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        <Minus className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <div className="w-24 text-center">
                                        <span className="text-5xl font-bold text-gray-900">{dailyGoal}</span>
                                    </div>
                                    <button
                                        onClick={() => setDailyGoal(prev => Math.min(50, prev + 1))}
                                        className="w-12 h-12 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        <Plus className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <p className="text-center text-sm text-gray-400 font-medium mb-6">
                                    {t('dailyGoalUnit')}
                                </p>

                                {/* Preset chips */}
                                <div className="flex justify-center gap-2 mb-10">
                                    {DAILY_GOAL_PRESETS.map((preset) => (
                                        <button
                                            key={preset}
                                            onClick={() => setDailyGoal(preset)}
                                            className={cn(
                                                "px-4 py-2 rounded-full border-2 font-bold text-sm transition-all",
                                                dailyGoal === preset
                                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                            )}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={goNext}
                                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                >
                                    {tCommon('continue')}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* ──────── Step 3: Motivation ──────── */}
                        {currentStep === 'motivation' && (
                            <motion.div
                                key="motivation"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-center mb-6">
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={120}
                                        height={120}
                                        className="h-[80px] sm:h-[100px] w-auto"
                                    />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center mb-8">
                                    {t('motivationTitle')}
                                </h1>

                                <div className="space-y-3">
                                    {motivations.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMotivation(m.id)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex items-center gap-4 bg-white",
                                                selectedMotivation === m.id
                                                    ? "border-blue-500 shadow-[0_4px_0_0_rgb(59,130,246)] -translate-y-1"
                                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                            )}
                                        >
                                            <div className="flex-1">
                                                <div className={cn(
                                                    "font-bold text-lg mb-0.5",
                                                    selectedMotivation === m.id ? "text-blue-600" : "text-gray-900"
                                                )}>
                                                    {m.label}
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium">{m.desc}</div>
                                            </div>
                                            {selectedMotivation === m.id && (
                                                <motion.div
                                                    layoutId="check-motivation"
                                                    className="absolute right-4 text-blue-500"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <Check className="w-6 h-6 stroke-[3]" />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-10">
                                    <button
                                        onClick={goNext}
                                        disabled={!selectedMotivation}
                                        className={cn(
                                            "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                                            !selectedMotivation
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                        )}
                                    >
                                        {tCommon('continue')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ──────── Step 3: Academic Level ──────── */}
                        {currentStep === 'level' && (
                            <motion.div
                                key="level"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-center mb-6">
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={120}
                                        height={120}
                                        className="h-[80px] sm:h-[100px] w-auto"
                                    />
                                </div>
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                        {t('stepTitle')}
                                    </h1>
                                    <p className="text-sm text-gray-500 font-medium">{t('stepSubtitle')}</p>
                                </div>

                                <div className="space-y-3">
                                    {levels.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setSelectedLevel(level.id)}
                                            className={cn(
                                                "w-full group p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex items-center gap-4 bg-white",
                                                selectedLevel === level.id
                                                    ? "border-blue-500 shadow-[0_4px_0_0_rgb(59,130,246)] -translate-y-1"
                                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-3 rounded-lg transition-colors",
                                                selectedLevel === level.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                            )}>
                                                {level.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className={cn(
                                                    "font-bold text-lg mb-0.5",
                                                    selectedLevel === level.id ? "text-blue-600" : "text-gray-900"
                                                )}>
                                                    {level.title}
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium">{level.description}</div>
                                            </div>
                                            {selectedLevel === level.id && (
                                                <motion.div
                                                    layoutId="check-level"
                                                    className="absolute right-4 text-blue-500"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <Check className="w-6 h-6 stroke-[3]" />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-10">
                                    <button
                                        onClick={goNext}
                                        disabled={!selectedLevel}
                                        className={cn(
                                            "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                                            !selectedLevel
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                        )}
                                    >
                                        {tCommon('continue')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ──────── Step 4: Institution (conditional) ──────── */}
                        {currentStep === 'institution' && (
                            <motion.div
                                key="institution"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-center mb-6">
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={120}
                                        height={120}
                                        className="h-[80px] sm:h-[100px] w-auto"
                                    />
                                </div>
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-6">
                                        <Building2 className="w-4 h-4" />
                                        {institutionName}
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 tracking-tight">
                                        {t('institutionDetected', { name: institutionName ?? '' })}
                                    </h1>
                                    <p className="text-gray-500">
                                        {hasDepartments
                                            ? t('selectDepartment')
                                            : t('personalizeExperience')}
                                    </p>
                                </div>

                                {hasDepartments && departments && (
                                    <div className="space-y-3 mb-10">
                                        {departments.map((dept) => (
                                            <button
                                                key={dept.id}
                                                onClick={() => setSelectedDepartment(dept.id)}
                                                className={cn(
                                                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex items-center gap-4 bg-white",
                                                    selectedDepartment === dept.id
                                                        ? "border-blue-500 shadow-[0_4px_0_0_rgb(59,130,246)] -translate-y-1"
                                                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <div className={cn(
                                                        "font-bold text-base",
                                                        selectedDepartment === dept.id ? "text-blue-600" : "text-gray-900"
                                                    )}>
                                                        {dept.name}
                                                    </div>
                                                </div>
                                                {selectedDepartment === dept.id && (
                                                    <Check className="w-5 h-5 text-blue-500 stroke-[3]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-10">
                                    <button
                                        onClick={goNext}
                                        disabled={hasDepartments && !selectedDepartment}
                                        className={cn(
                                            "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all w-full justify-center",
                                            hasDepartments && !selectedDepartment
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                        )}
                                    >
                                        {tCommon('continue')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ──────── Step 5: Completion ──────── */}
                        {currentStep === 'completion' && (
                            <motion.div
                                key="completion"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                >
                                    <Image
                                        src={currentSprite}
                                        alt="Munin"
                                        width={180}
                                        height={180}
                                        className="mx-auto h-[140px] sm:h-[180px] w-auto mb-6"
                                    />
                                </motion.div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                                    {t('completionTitle')}
                                </h1>

                                <p className="text-lg text-gray-600 font-medium mb-10">
                                    {selectedMotivation
                                        ? t(MOTIVATION_TO_COMPLETION_KEY[selectedMotivation])
                                        : t('completionDefault')}
                                </p>

                                <button
                                    onClick={handleSubmitOnboarding}
                                    disabled={loading}
                                    className={cn(
                                        "w-full px-8 py-4 rounded-xl font-bold text-lg transition-all",
                                        loading
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-black text-white shadow-[0_4px_0_0_black] hover:-translate-y-1 hover:shadow-[0_6px_0_0_black] active:translate-y-[2px] active:shadow-none"
                                    )}
                                >
                                    {loading
                                        ? tCommon('saving')
                                        : t('completionCta')
                                    }
                                </button>

                                {/* Subtle Premium link */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <Link
                                        href="/premium"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        {t('completionPremiumLink')}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
