import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getInstitutionById } from '@/data/institutions';
import PremiumClient from './PremiumClient';

export default async function PremiumPage() {
    const { userId } = await auth();

    let institutionId: string | null = null;
    let institutionName: string | null = null;
    let premiumHeadline: string | null = null;

    if (userId) {
        const { data: profile } = await getSupabaseAdmin()
            .from('profiles')
            .select('institution')
            .eq('id', userId)
            .single();

        if (profile?.institution) {
            const config = getInstitutionById(profile.institution);
            if (config) {
                institutionId = config.id;
                institutionName = config.name;
                premiumHeadline = config.premiumHeadline;
            }
        }
    }

    return <PremiumClient
        institutionId={institutionId}
        institutionName={institutionName}
        premiumHeadline={premiumHeadline}
    />;
}
