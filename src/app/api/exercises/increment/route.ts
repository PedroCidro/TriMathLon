import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await getSupabaseAdmin().rpc('increment_exercises_solved', {
            user_id: userId,
        });

        if (error) {
            console.error('Failed to increment exercises:', error.message);
            return NextResponse.json({ success: false });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Increment error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ success: false });
    }
}
