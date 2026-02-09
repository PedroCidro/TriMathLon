import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not configured');
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    let event;
    try {
        event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const clerkUserId = session.metadata?.clerk_user_id;

            if (!clerkUserId) {
                console.error('No clerk_user_id in checkout session metadata');
                break;
            }

            const customerId = typeof session.customer === 'string' ? session.customer : null;
            const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;

            const { error } = await getSupabaseAdmin()
                .from('profiles')
                .update({
                    is_premium: true,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                })
                .eq('id', clerkUserId);

            if (error) {
                console.error('Failed to update premium status:', error.message);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
            break;
        }

        case 'customer.subscription.deleted':
        case 'customer.subscription.updated': {
            const subscription = event.data.object;
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';

            const { error } = await getSupabaseAdmin()
                .from('profiles')
                .update({ is_premium: isActive })
                .eq('stripe_subscription_id', subscription.id);

            if (error) {
                console.error('Failed to update subscription status:', error.message);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}
