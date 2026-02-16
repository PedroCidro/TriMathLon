import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const isProtectedRoute = createRouteMatcher([
    '/:locale/dashboard(.*)',
    '/dashboard(.*)',
    '/:locale/onboarding(.*)',
    '/onboarding(.*)',
    '/:locale/institutional(.*)',
    '/institutional(.*)',
    '/:locale/groups',
    '/groups',
    '/:locale/groups/:groupId',
    '/groups/:groupId',
])

export default clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
        await auth.protect()
    }

    // Skip intl middleware for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return
    }

    return intlMiddleware(request)
})

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
