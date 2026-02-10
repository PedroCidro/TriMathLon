import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()

    const { data: profile } = await supabase
        .from('profiles')
        .select('academic_level, email, full_name, is_premium')
        .eq('id', userId)
        .single()

    return <SettingsClient
        academicLevel={profile?.academic_level ?? null}
        email={profile?.email ?? null}
        fullName={profile?.full_name ?? null}
        isPremium={profile?.is_premium ?? false}
    />
}
