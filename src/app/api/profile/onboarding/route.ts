import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { detectInstitution } from '@/data/institutions';
import { z } from 'zod';

const bodySchema = z.object({
    academic_level: z.enum(['fundamental', 'medio', 'graduacao', 'pos', 'enthusiast']),
    institution: z.string().nullable().optional(),
    institution_department: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const limited = rateLimit(userId, 'standard');
        if (limited) return limited;

        const body = await req.json();
        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }

        const { academic_level, institution, institution_department } = parsed.data;

        // Server-side validation: verify claimed institution matches email domain
        let validatedInstitution: string | null = null;
        let validatedDepartment: string | null = null;

        if (institution) {
            const user = await currentUser();
            const email = user?.emailAddresses?.[0]?.emailAddress || '';
            const detected = detectInstitution(email);

            if (detected && detected.id === institution) {
                validatedInstitution = institution;
                if (institution_department && detected.departments?.some(d => d.id === institution_department)) {
                    validatedDepartment = institution_department;
                }
            }
            // If institution doesn't match email, silently ignore it
        }

        const upsertData: Record<string, unknown> = {
            id: userId,
            academic_level,
            onboarding_completed: true,
        };

        if (validatedInstitution !== null) {
            upsertData.institution = validatedInstitution;
            upsertData.institution_department = validatedDepartment;
        }

        const { error } = await getSupabaseAdmin()
            .from('profiles')
            .upsert(upsertData, { onConflict: 'id' });

        if (error) {
            console.error('Failed to save onboarding:', error.message, error.details, error.hint);
            return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Onboarding error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
