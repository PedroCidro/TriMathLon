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

        const { locale } = await req.json().catch(() => ({ locale: undefined }));
        const isInternational = locale === 'en';
        const isInstitutional = !!existingProfile?.institution;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const stripe = getStripe();

        const priceId = isInternational
            ? PRICE_INTERNATIONAL
            : isInstitutional ? PRICE_STUDENT : PRICE_UNIVERSAL;

        if (!priceId) {
            const varName = isInternational
                ? 'STRIPE_PRICE_ID_INTERNATIONAL'
                : isInstitutional ? 'STRIPE_PRICE_ID_STUDENT' : 'STRIPE_PRICE_ID_UNIVERSAL';
            console.error('Missing env var:', varName);
            return NextResponse.json(
                { error: `Server misconfiguration: missing ${varName}` },
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
            mode: 'payment',
            metadata: { clerk_user_id: userId },
            success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/dashboard`,
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Checkout error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
