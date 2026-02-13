'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('Error');
    const tCommon = useTranslations('Common');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center max-w-md">
                <div className="text-6xl font-bold text-gray-200 mb-4">{t('oops')}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboardError')}</h1>
                <p className="text-gray-500 mb-8">
                    {t('dashboardErrorDesc')}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-md"
                    >
                        {tCommon('tryAgain')}
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-400 transition-all"
                    >
                        {tCommon('backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
