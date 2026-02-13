import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

const UNI_COUPON_ID = 'UNI_STUDENT_50';

const PRICE_UNIVERSAL = process.env.STRIPE_PRICE_ID_UNIVERSAL!;
const PRICE_STUDENT = process.env.STRIPE_PRICE_ID_STUDENT!;

export async function POST(req: NextRequest) {
    try {
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

        const isInstitutional = !!existingProfile?.institution;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const stripe = getStripe();

        const priceId = isInstitutional ? PRICE_STUDENT : PRICE_UNIVERSAL;

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            metadata: { clerk_user_id: userId },
            success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/dashboard`,
        };

        // Apply institutional coupon silently
        if (isInstitutional) {
            try {
                await stripe.coupons.retrieve(UNI_COUPON_ID);
                sessionParams.discounts = [{ coupon: UNI_COUPON_ID }];
            } catch (couponErr) {
                console.error('Coupon not found, proceeding without discount:', couponErr instanceof Error ? couponErr.message : 'Unknown');
            }
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Checkout error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
