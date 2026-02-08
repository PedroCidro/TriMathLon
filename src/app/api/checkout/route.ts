import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const checkoutSchema = z.object({
    priceId: z.string().optional(),
});

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

        // Ensure profile exists before checkout so the Stripe webhook can update it
        await getSupabaseAdmin().from('profiles').upsert({
            id: userId,
            is_premium: false,
            exercises_solved: 0,
            onboarding_completed: false,
        }, { onConflict: 'id', ignoreDuplicates: true });

        const origin = req.headers.get('origin');
        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'Trimathlon Premium',
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
            success_url: `${origin}/dashboard`,
            cancel_url: `${origin}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Checkout error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
