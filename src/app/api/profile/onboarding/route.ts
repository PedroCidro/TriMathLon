import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const bodySchema = z.object({
    academic_level: z.enum(['fundamental', 'medio', 'graduacao', 'pos', 'enthusiast']),
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid academic_level' }, { status: 400 });
        }

        const { error } = await getSupabaseAdmin()
            .from('profiles')
            .update({
                academic_level: parsed.data.academic_level,
                onboarding_completed: true,
            })
            .eq('id', userId);

        if (error) {
            console.error('Failed to save onboarding:', error.message);
            return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Onboarding error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
