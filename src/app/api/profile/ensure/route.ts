import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
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

        // Check if profile already exists
        const { data: existing } = await supabase
            .from('profiles')
            .select('id, is_premium, exercises_solved')
            .eq('id', userId)
            .single();

        if (existing) {
            return NextResponse.json({ profile: existing });
        }

        // Profile doesn't exist — create it
        const user = await currentUser();
        const email = user?.emailAddresses?.[0]?.emailAddress || null;
        const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || null;

        const { data: profile, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email,
                full_name: fullName,
                is_premium: false,
                exercises_solved: 0,
                onboarding_completed: false,
            }, { onConflict: 'id' })
            .select('id, is_premium, exercises_solved')
            .single();

        if (error) {
            console.error('Failed to ensure profile:', error.message);
            return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
        }

        return NextResponse.json({ profile });
    } catch (err) {
        console.error('Ensure profile error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
