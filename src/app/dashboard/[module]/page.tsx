import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import ModuleClient from './ModuleClient'

export default async function ModulePage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    return <ModuleClient />
}
