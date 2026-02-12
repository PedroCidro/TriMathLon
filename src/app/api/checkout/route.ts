import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const checkoutSchema = z.object({
    priceId: z.string().optional(),
});

const UNI_COUPON_ID = 'UNI_STUDENT_50';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const result = checkoutSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Ensure profile exists before checkout so the Stripe webhook can update it
        await supabase.from('profiles').upsert({
            id: userId,
            is_premium: false,
            exercises_solved: 0,
            onboarding_completed: false,
        }, { onConflict: 'id', ignoreDuplicates: true });

        // Check if user has an institution for the coupon
        const { data: profile } = await supabase
            .from('profiles')
            .select('institution')
            .eq('id', userId)
            .single();

        const isInstitutional = !!profile?.institution;

        const origin = req.headers.get('origin');
        const stripe = getStripe();

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'JustMathing Premium',
                            description: 'Acesso total a todas as arenas de treino.',
                        },
                        unit_amount: 2990, // R$ 29,90
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            metadata: { clerk_user_id: userId },
            success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard`,
        };

        // Apply institutional coupon silently
        if (isInstitutional) {
            try {
                // Verify coupon exists
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
