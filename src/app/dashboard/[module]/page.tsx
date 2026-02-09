import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import ModuleClient from './ModuleClient'

export default async function ModulePage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const { data } = await getSupabaseAdmin()
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single()

    return <ModuleClient isPremium={data?.is_premium ?? false} />
}
