import { NextResponse } from 'next/server';

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}

type RateLimitConfig = {
    /** Max requests allowed in the window */
    limit: number;
    /** Window size in seconds */
    windowSeconds: number;
};

const CONFIGS = {
    /** Standard API routes (profile updates, rankings, etc.) */
    standard: { limit: 30, windowSeconds: 60 },
    /** Exercise completions — generous but not unlimited */
    exercise: { limit: 60, windowSeconds: 60 },
    /** Checkout — strict to prevent card testing */
    checkout: { limit: 5, windowSeconds: 60 },
    /** Blitz score saves — one game takes ~60s minimum */
    blitz: { limit: 10, windowSeconds: 60 },
    /** Public endpoints — rate limited by IP */
    public: { limit: 20, windowSeconds: 60 },
    /** Challenge mode — create, accept, update scores */
    challenge: { limit: 20, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitConfig>;

export type RateLimitPreset = keyof typeof CONFIGS;

/**
 * Check rate limit for a given key. Returns null if allowed, or a 429 Response if blocked.
 */
export function rateLimit(userId: string, preset: RateLimitPreset): NextResponse | null {
    cleanup();

    const config = CONFIGS[preset];
    const key = `${preset}:${userId}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
        return null;
    }

    entry.count++;
    if (entry.count > config.limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
            { error: 'Too many requests' },
            {
                status: 429,
                headers: { 'Retry-After': String(retryAfter) },
            },
        );
    }

    return null;
}
