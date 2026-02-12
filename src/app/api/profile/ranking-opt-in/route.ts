import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseAdmin();

        // Get current value
        const { data: profile } = await supabase
            .from('profiles')
            .select('ranking_opt_in')
            .eq('id', userId)
            .single();

        const newValue = !(profile?.ranking_opt_in ?? false);

        const { error } = await supabase
            .from('profiles')
            .update({ ranking_opt_in: newValue })
            .eq('id', userId);

        if (error) {
            console.error('Failed to toggle ranking opt-in:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ranking_opt_in: newValue });
    } catch (err) {
        console.error('Ranking opt-in error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
