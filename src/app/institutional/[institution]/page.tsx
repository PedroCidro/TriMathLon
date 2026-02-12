import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getInstitutionById } from '@/data/institutions';
import InstitutionalLandingClient from './InstitutionalLandingClient';

export default async function InstitutionalLandingPage({
    params,
}: {
    params: Promise<{ institution: string }>;
}) {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    const { institution: institutionSlug } = await params;
    const config = getInstitutionById(institutionSlug);
    if (!config) {
        return redirect('/dashboard');
    }

    const supabase = getSupabaseAdmin();
    const { data: profile } = await supabase
        .from('profiles')
        .select('institution, institution_landing_seen')
        .eq('id', userId)
        .single();

    // Guard: profile institution must match URL, and landing must not have been seen
    if (!profile || profile.institution !== institutionSlug || profile.institution_landing_seen) {
        return redirect('/dashboard');
    }

    return <InstitutionalLandingClient
        institutionId={config.id}
        institutionName={config.name}
        headline={config.landingHeadline}
        subline={config.landingSubline}
    />;
}
