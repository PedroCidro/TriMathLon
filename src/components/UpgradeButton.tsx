'use client';

import { Link } from '@/i18n/routing';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UpgradeButton() {
    const tCommon = useTranslations('Common');

    return (
        <Link
            href="/premium"
            className="flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-3 sm:px-5 py-1.5 rounded-full font-bold shadow-sm hover:bg-blue-50 hover:-translate-y-0.5 transition-all text-sm"
        >
            <Zap className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">{tCommon('premium')}</span>
        </Link>
    );
}
