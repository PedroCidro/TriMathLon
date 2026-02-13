'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('Error');
    const tCommon = useTranslations('Common');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('notFoundTitle')}</h1>
                <p className="text-gray-500 mb-8">
                    {t('notFoundDesc')}
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-black text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-md"
                >
                    {tCommon('backToHome')}
                </Link>
            </div>
        </div>
    );
}
