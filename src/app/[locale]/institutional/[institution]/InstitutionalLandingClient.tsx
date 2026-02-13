'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const INSTITUTION_STYLES: Record<string, { accent: string; bg: string; border: string; button: string; shadow: string }> = {
    usp: {
        accent: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-500',
        shadow: 'shadow-[0_4px_0_0_rgb(29,78,216)] hover:shadow-[0_6px_0_0_rgb(29,78,216)]',
    },
    ufscar: {
        accent: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-600 hover:bg-red-500',
        shadow: 'shadow-[0_4px_0_0_rgb(185,28,28)] hover:shadow-[0_6px_0_0_rgb(185,28,28)]',
    },
};

interface InstitutionalLandingClientProps {
    institutionId: string;
    institutionName: string;
    headline: string;
    subline: string;
}

export default function InstitutionalLandingClient({
    institutionId,
    institutionName,
    headline,
    subline,
}: InstitutionalLandingClientProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const styles = INSTITUTION_STYLES[institutionId] ?? INSTITUTION_STYLES.usp;
    const t = useTranslations('Institutional');
    const tCommon = useTranslations('Common');

    const handleContinue = async () => {
        setLoading(true);
        try {
            await fetch('/api/profile/institution-landing-seen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            router.push('/dashboard');
        } catch {
            router.push('/dashboard');
        }
    };

    return (
        <div className={cn("min-h-screen flex items-center justify-center p-6", styles.bg)}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg w-full text-center"
            >
                <div className={cn(
                    "inline-flex items-center px-4 py-2 rounded-full font-bold text-sm mb-8 border",
                    styles.accent, styles.border, styles.bg
                )}>
                    {institutionName}
                </div>

                <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]", styles.accent)}>
                    {headline}
                </h1>

                <p className="text-lg text-gray-500 mb-12">
                    {subline}
                </p>

                <button
                    onClick={handleContinue}
                    disabled={loading}
                    className={cn(
                        "inline-flex items-center gap-3 text-white font-bold py-4 px-10 rounded-full text-lg transition-all hover:-translate-y-1 active:translate-y-[4px] active:shadow-none disabled:opacity-60 disabled:pointer-events-none",
                        styles.button, styles.shadow
                    )}
                >
                    {loading ? tCommon('loading') : t('continueToArena')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </motion.div>
        </div>
    );
}
