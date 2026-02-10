import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { curriculum } from '@/data/curriculum'
import MethodClient from './MethodClient'

type Params = Promise<{ module: string; method: string }>

export default async function MethodPage({ params }: { params: Params }) {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const { module: moduleId, method: methodId } = await params

    // Server-side premium enforcement
    const moduleData = curriculum.find(m => m.id === moduleId)
    const topicIndex = moduleData?.topics.findIndex(t => t.id === methodId) ?? -1

    if (topicIndex === -1) {
        return redirect(`/dashboard/${moduleId}`)
    }

    const { data } = await getSupabaseAdmin()
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single()

    const isPremium = !!data?.is_premium

    if (topicIndex >= 3 && !isPremium) {
        return redirect('/premium')
    }

    return <MethodClient isPremium={isPremium} />
}
