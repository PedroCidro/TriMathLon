import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';
import { rateLimit } from '@/lib/rate-limit';

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'standard');
        if (limited) return limited;

        const supabase = getSupabaseAdmin();

        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_subscription_id')
            .eq('id', userId)
            .single();

        if (!profile?.stripe_subscription_id) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
        }

        // Cancel at period end so the user keeps access until their billing cycle ends
        const stripe = getStripe();
        await stripe.subscriptions.update(profile.stripe_subscription_id, {
            cancel_at_period_end: true,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Cancel subscription error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
}
