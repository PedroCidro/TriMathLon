'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LocaleToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const switchLocale = () => {
        const nextLocale = locale === 'pt' ? 'en' : 'pt';
        router.replace(
            // @ts-expect-error -- params may include dynamic segments
            { pathname, params },
            { locale: nextLocale }
        );
    };

    return (
        <button
            onClick={switchLocale}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
            title={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        >
            {locale === 'pt' ? 'EN' : 'PT'}
        </button>
    );
}
