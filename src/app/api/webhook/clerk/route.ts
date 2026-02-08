import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('CLERK_WEBHOOK_SECRET is not configured');
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const body = await req.text();
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    let event: any;
    try {
        const wh = new Webhook(webhookSecret);
        event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        });
    } catch (err) {
        console.error('Clerk webhook verification failed:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
        case 'user.created': {
            const { id, email_addresses, first_name, last_name } = event.data;
            const email = email_addresses?.[0]?.email_address || null;

            const { error } = await getSupabaseAdmin().from('profiles').upsert({
                id,
                email,
                full_name: [first_name, last_name].filter(Boolean).join(' ') || null,
                is_premium: false,
                exercises_solved: 0,
                onboarding_completed: false,
            }, { onConflict: 'id' });

            if (error) {
                console.error('Failed to create profile:', error.message);
                return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
            }
            break;
        }

        case 'user.deleted': {
            const { id } = event.data;
            if (id) {
                const { error } = await getSupabaseAdmin()
                    .from('profiles')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Failed to delete profile:', error.message);
                }
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}
