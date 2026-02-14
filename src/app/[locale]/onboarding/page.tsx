import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { detectInstitution } from '@/data/institutions';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage() {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    // Skip onboarding if already completed
    const supabase = getSupabaseAdmin();
    const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

    if (profile?.onboarding_completed) {
        return redirect('/dashboard');
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || '';
    const institution = detectInstitution(email);

    return <OnboardingClient
        institutionId={institution?.id ?? null}
        institutionName={institution?.name ?? null}
        departments={institution?.departments ?? null}
    />;
}
