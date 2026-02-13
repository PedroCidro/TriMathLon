'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

const LOCALES = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
] as const;

export default function LocaleToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

    const switchTo = (code: string) => {
        setOpen(false);
        if (code === locale) return;
        router.replace(
            // @ts-expect-error -- params may include dynamic segments
            { pathname, params },
            { locale: code }
        );
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
            >
                <span>{current.flag}</span>
                <span>{current.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                    {LOCALES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => switchTo(l.code)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                                l.code === locale
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                            }`}
                        >
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
