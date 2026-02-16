'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Copy, Loader2, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { Module } from '@/data/curriculum';

type ModalStep = 'select' | 'sharing' | 'waiting';

export default function ChallengeCreatorModal({
    moduleData,
    onClose,
}: {
    moduleData: Module;
    onClose: () => void;
}) {
    const t = useTranslations('Challenge');
    const tc = useTranslations('Curriculum');
    const router = useRouter();

    const [step, setStep] = useState<ModalStep>('select');
    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        moduleData.topics.map(t => t.id)
    );
    const [creating, setCreating] = useState(false);
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const shareUrl = challengeId
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${challengeId}`
        : '';

    const toggleTopic = (topicId: string) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleCreate = async () => {
        if (selectedTopics.length === 0) return;
        setCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/challenge/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    module_id: moduleData.id,
                    topic_ids: selectedTopics,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to create challenge');
                return;
            }

            const data = await res.json();
            setChallengeId(data.challenge_id);
            setStep('sharing');
        } catch {
            setError('Failed to create challenge');
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = `${t('whatsappMessage')} ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const startWaiting = () => {
        setStep('waiting');
    };

    // Poll for opponent acceptance
    useEffect(() => {
        if (step !== 'waiting' || !challengeId) return;

        const poll = async () => {
            try {
                const res = await fetch(`/api/public/challenge/${challengeId}`);
                if (!res.ok) return;
                const data = await res.json();

                if (data.has_opponent || data.status === 'ready' || data.status === 'playing') {
                    // Opponent joined — redirect to gameplay
                    router.push({
                        pathname: '/dashboard/[module]/challenge/[challengeId]',
                        params: { module: moduleData.id, challengeId },
                    });
                }
            } catch {
                // Ignore poll errors
            }
        };

        poll();
        pollRef.current = setInterval(poll, 5000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [step, challengeId, moduleData.id, router]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                        <Swords className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{t('challengeFriend')}</h2>
                        <p className="text-sm text-gray-500">{tc(`${moduleData.id}.title`)}</p>
                    </div>
                </div>

                {/* Step: Select Topics */}
                {step === 'select' && (
                    <>
                        <p className="text-sm font-medium text-gray-700 mb-3">{t('selectTopics')}</p>
                        <div className="space-y-2 mb-6">
                            {moduleData.topics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                                        selectedTopics.includes(topic.id)
                                            ? "border-orange-400 bg-orange-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                        selectedTopics.includes(topic.id)
                                            ? "bg-orange-500 border-orange-500"
                                            : "border-gray-300"
                                    )}>
                                        {selectedTopics.includes(topic.id) && (
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {tc.has(`${topic.id}.title`) ? tc(`${topic.id}.title`) : topic.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mb-3">{error}</p>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={creating || selectedTopics.length === 0}
                            className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('creating')}
                                </>
                            ) : (
                                t('createChallenge')
                            )}
                        </button>
                    </>
                )}

                {/* Step: Share Link */}
                {step === 'sharing' && (
                    <>
                        <p className="text-sm text-gray-600 mb-4">{t('shareLink')}</p>

                        {/* Link display */}
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-mono select-all"
                            />
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "p-3 rounded-xl border-2 transition-all",
                                    copied ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* WhatsApp button */}
                        <button
                            onClick={handleWhatsApp}
                            className="w-full px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-bold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-3"
                        >
                            {t('shareWhatsApp')}
                        </button>

                        {/* Continue to waiting */}
                        <button
                            onClick={startWaiting}
                            className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all"
                        >
                            {t('waitingForOpponent')}
                        </button>
                    </>
                )}

                {/* Step: Waiting */}
                {step === 'waiting' && (
                    <div className="text-center py-6">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-900 mb-2">{t('waitingForOpponent')}</p>
                        <p className="text-sm text-gray-500 mb-6">{t('challengeDesc')}</p>

                        {/* Show link again for re-sharing */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-mono select-all"
                            />
                            <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
