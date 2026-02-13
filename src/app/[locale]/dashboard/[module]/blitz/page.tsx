import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import BlitzClient from './BlitzClient'

type Params = Promise<{ module: string }>

export default async function BlitzPage({ params }: { params: Params }) {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const { module: moduleId } = await params

    return <BlitzClient moduleId={moduleId} />
}
