import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { curriculum } from '@/data/curriculum'
import LearnPageClient from './LearnPageClient'

type Params = Promise<{ module: string }>

export default async function LearnPage({ params }: { params: Params }) {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const { module: moduleId } = await params

    const moduleData = curriculum.find(m => m.id === moduleId)
    if (!moduleData) {
        return redirect('/dashboard')
    }

    return <LearnPageClient moduleId={moduleId} />
}
