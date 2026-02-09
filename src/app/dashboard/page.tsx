import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import DashboardClient from './DashboardClient'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()
    const params = await searchParams

    // If returning from Stripe checkout, verify and apply premium immediately
    if (typeof params.session_id === 'string') {
        try {
            const session = await getStripe().checkout.sessions.retrieve(params.session_id)
            if (session.payment_status === 'paid' && session.metadata?.clerk_user_id === userId) {
                const customerId = typeof session.customer === 'string' ? session.customer : null
                const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null
                await supabase.from('profiles').update({
                    is_premium: true,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                }).eq('id', userId)
            }
        } catch (e) {
            console.error('Failed to verify checkout session:', e)
        }
    }

    // Ensure profile exists (insert only if missing)
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress || null
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || null
    await supabase.from('profiles').upsert({
        id: userId,
        email,
        full_name: fullName,
        is_premium: false,
        exercises_solved: 0,
        onboarding_completed: false,
    }, { onConflict: 'id', ignoreDuplicates: true })

    // Read current profile
    const { data } = await supabase
        .from('profiles')
        .select('is_premium, exercises_solved')
        .eq('id', userId)
        .single()

    return <DashboardClient
        isPremium={data?.is_premium ?? false}
        exercisesSolved={data?.exercises_solved ?? 0}
    />
}
