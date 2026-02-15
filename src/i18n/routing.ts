import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    localePrefix: 'as-needed',
    pathnames: {
        '/': '/',
        '/sobre': { pt: '/sobre', en: '/about' },
        '/premium': '/premium',
        '/dashboard': '/dashboard',
        '/dashboard/stats': '/dashboard/stats',
        '/dashboard/settings': '/dashboard/settings',
        '/dashboard/[module]': '/dashboard/[module]',
        '/dashboard/[module]/[method]': '/dashboard/[module]/[method]',
        '/dashboard/[module]/blitz': '/dashboard/[module]/blitz',
        '/onboarding': '/onboarding',
        '/profile/[userId]': '/profile/[userId]',
        '/institutional/[institution]': '/institutional/[institution]',
        '/sign-in/[[...sign-in]]': '/sign-in/[[...sign-in]]',
        '/sign-up/[[...sign-up]]': '/sign-up/[[...sign-up]]',
    },
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
