import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
    throw new Error('CRITICAL: STRIPE_SECRET_KEY is missing from environment variables');
}

export const stripe = new Stripe(apiKey, {
    apiVersion: '2026-01-28.clover' as any,
    typescript: true,
});
