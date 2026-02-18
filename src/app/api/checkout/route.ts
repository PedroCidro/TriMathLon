import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const PRICE_UNIVERSAL = process.env.STRIPE_PRICE_ID_UNIVERSAL;
        const PRICE_STUDENT = process.env.STRIPE_PRICE_ID_STUDENT;
        const PRICE_INTERNATIONAL = process.env.STRIPE_PRICE_ID_INTERNATIONAL;
        const PRICE_MONTHLY_UNIVERSAL = process.env.STRIPE_PRICE_ID_MONTHLY_UNIVERSAL;
        const PRICE_MONTHLY_STUDENT = process.env.STRIPE_PRICE_ID_MONTHLY_STUDENT;
        const PRICE_MONTHLY_INTERNATIONAL = process.env.STRIPE_PRICE_ID_MONTHLY_INTERNATIONAL;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'checkout');
        if (limited) return limited;

        const supabase = getSupabaseAdmin();

        // Ensure profile exists before checkout
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, institution')
            .eq('id', userId)
            .single();

        if (!existingProfile) {
            await supabase.from('profiles').insert({
                id: userId,
                is_premium: false,
                exercises_solved: 0,
                onboarding_completed: false,
            });
        }

        const { locale, plan } = await req.json().catch(() => ({ locale: undefined, plan: undefined }));
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const stripe = getStripe();

        // USP Bixos one-time deal
        if (plan === 'usp-bixos') {
            const PRICE_USP_BIXOS = process.env.STRIPE_PRICE_ID_USP_BIXOS;
            if (!PRICE_USP_BIXOS) {
                console.error('Missing env var: STRIPE_PRICE_ID_USP_BIXOS');
                return NextResponse.json(
                    { error: 'Server misconfiguration: missing STRIPE_PRICE_ID_USP_BIXOS' },
                    { status: 500 },
                );
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{ price: PRICE_USP_BIXOS, quantity: 1 }],
                mode: 'payment',
                metadata: { clerk_user_id: userId },
                success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/usp`,
            });

            return NextResponse.json({ url: session.url });
        }

        const isInternational = locale === 'en';
        const isInstitutional = !!existingProfile?.institution;
        const isMonthly = plan === 'monthly';

        const priceId = isMonthly
            ? (isInternational
                ? PRICE_MONTHLY_INTERNATIONAL
                : isInstitutional ? PRICE_MONTHLY_STUDENT : PRICE_MONTHLY_UNIVERSAL)
            : (isInternational
                ? PRICE_INTERNATIONAL
                : isInstitutional ? PRICE_STUDENT : PRICE_UNIVERSAL);

        if (!priceId) {
            const prefix = isMonthly ? 'STRIPE_PRICE_ID_MONTHLY_' : 'STRIPE_PRICE_ID_';
            const suffix = isInternational
                ? 'INTERNATIONAL'
                : isInstitutional ? 'STUDENT' : 'UNIVERSAL';
            console.error('Missing env var:', prefix + suffix);
            return NextResponse.json(
                { error: `Server misconfiguration: missing ${prefix + suffix}` },
                { status: 500 },
            );
        }

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: isMonthly ? 'subscription' : 'payment',
            metadata: { clerk_user_id: userId },
            success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/dashboard`,
        };

        if (isMonthly) {
            sessionParams.subscription_data = {
                metadata: { clerk_user_id: userId },
            };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Checkout error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
