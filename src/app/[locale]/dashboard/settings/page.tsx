import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getInstitutionById } from '@/data/institutions'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()

    const { data: profile } = await supabase
        .from('profiles')
        .select('academic_level, email, full_name, is_premium, ranking_opt_in, institution, institution_department')
        .eq('id', userId)
        .single()

    const institutionConfig = profile?.institution ? getInstitutionById(profile.institution) : null

    return <SettingsClient
        academicLevel={profile?.academic_level ?? null}
        email={profile?.email ?? null}
        fullName={profile?.full_name ?? null}
        isPremium={profile?.is_premium ?? false}
        rankingOptIn={profile?.ranking_opt_in ?? false}
        institutionName={institutionConfig?.name ?? null}
        institutionDepartment={profile?.institution_department ?? null}
        institutionDepartmentName={
            institutionConfig?.departments?.find(d => d.id === profile?.institution_department)?.name ?? null
        }
    />
}
