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
    const topic = curriculum
        .find(m => m.id === moduleId)
        ?.topics.find(t => t.id === methodId)

    if (!topic) {
        return redirect(`/dashboard/${moduleId}`)
    }

    if (topic.difficulty === 'Hard') {
        const { data } = await getSupabaseAdmin()
            .from('profiles')
            .select('is_premium')
            .eq('id', userId)
            .single()

        if (!data?.is_premium) {
            return redirect(`/dashboard/${moduleId}`)
        }
    }

    return <MethodClient />
}
