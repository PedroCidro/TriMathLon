import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import { getInstitutionById } from '@/data/institutions'
import { curriculum } from '@/data/curriculum'
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
                await supabase.from('profiles').update({
                    is_premium: true,
                    stripe_customer_id: customerId,
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
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()
    if (!existingProfile) {
        await supabase.from('profiles').insert({
            id: userId,
            is_premium: false,
            exercises_solved: 0,
            onboarding_completed: false,
        })
    }

    // Always sync email and name from Clerk (may have been missing on initial creation)
    await supabase.from('profiles').update({
        email,
        full_name: fullName,
    }).eq('id', userId)

    // Read current profile (with engagement data + institution)
    const { data } = await supabase
        .from('profiles')
        .select('is_premium, exercises_solved, current_streak, xp_total, xp_today, last_xp_reset_date, institution')
        .eq('id', userId)
        .single()

    // Reset xp_today if it's a new day
    const today = new Date().toISOString().slice(0, 10)
    const xpToday = data?.last_xp_reset_date === today ? (data?.xp_today ?? 0) : 0

    // Fetch mastery data for progress bars
    const { data: mastery } = await supabase
        .from('user_topic_mastery')
        .select('subcategory, attempts')
        .eq('user_id', userId)

    // Compute per-module progress
    const moduleProgress: Record<string, { practiced: number; total: number }> = {}
    for (const mod of curriculum) {
        const practiced = mod.topics.filter(t =>
            mastery?.some(m => m.subcategory === t.id && m.attempts > 0)
        ).length
        moduleProgress[mod.id] = { practiced, total: mod.topics.length }
    }

    // Compute uni ranking balloon for institutional users
    let uniRankingBalloon: { institutionName: string; totalExercises: number; qualified: boolean } | null = null
    if (data?.institution) {
        const instConfig = getInstitutionById(data.institution)
        if (instConfig) {
            const { data: uniProfiles } = await supabase
                .from('profiles')
                .select('exercises_solved')
                .eq('institution', data.institution)

            const totalExercises = (uniProfiles ?? []).reduce((sum, p) => sum + (p.exercises_solved ?? 0), 0)
            uniRankingBalloon = {
                institutionName: instConfig.name,
                totalExercises,
                qualified: totalExercises >= 100,
            }
        }
    }

    return <DashboardClient
        isPremium={data?.is_premium ?? false}
        exercisesSolved={data?.exercises_solved ?? 0}
        currentStreak={data?.current_streak ?? 0}
        xpTotal={data?.xp_total ?? 0}
        xpToday={xpToday}
        moduleProgress={moduleProgress}
        uniRankingBalloon={uniRankingBalloon}
    />
}
