import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
    if (!_stripe) {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
        }
        _stripe = new Stripe(apiKey, {
            apiVersion: '2026-01-28.clover' as any,
            typescript: true,
        });
    }
    return _stripe;
}
