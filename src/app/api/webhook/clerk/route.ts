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

            const supabase = getSupabaseAdmin();
            const fullName = [first_name, last_name].filter(Boolean).join(' ') || null;

            // Check if this email already exists under a different Clerk ID
            // (e.g., user re-registered after switching Clerk environments)
            if (email) {
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', email)
                    .neq('id', id)
                    .maybeSingle();

                if (existing) {
                    // Migrate all data from old ID to new ID
                    const { error: migrateError } = await supabase.rpc('migrate_user_id', {
                        old_id: existing.id,
                        new_id: id,
                    });

                    if (migrateError) {
                        console.error('Failed to migrate user ID:', migrateError.message);
                        return NextResponse.json({ error: 'User migration failed' }, { status: 500 });
                    }

                    // Sync latest name from Clerk
                    await supabase.from('profiles').update({
                        full_name: fullName,
                    }).eq('id', id);

                    console.log(`Migrated user ${email} from ${existing.id} to ${id}`);
                    break;
                }
            }

            // No existing profile for this email — create a new one
            await supabase.from('profiles').upsert({
                id,
                is_premium: false,
                exercises_solved: 0,
                onboarding_completed: false,
            }, { onConflict: 'id', ignoreDuplicates: true });

            // Always sync email and name from Clerk
            const { error } = await supabase.from('profiles').update({
                email,
                full_name: fullName,
            }).eq('id', id);

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
