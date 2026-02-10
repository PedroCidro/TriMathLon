import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import StatsClient from './StatsClient'

export default async function StatsPage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()

    const { data: profile } = await supabase
        .from('profiles')
        .select('exercises_solved, current_streak, longest_streak, xp_total')
        .eq('id', userId)
        .single()

    const { data: mastery } = await supabase
        .from('user_topic_mastery')
        .select('subcategory, attempts, correct, wrong_count, avg_self_rating, best_streak, last_practiced')
        .eq('user_id', userId)

    return <StatsClient
        exercisesSolved={profile?.exercises_solved ?? 0}
        currentStreak={profile?.current_streak ?? 0}
        longestStreak={profile?.longest_streak ?? 0}
        xpTotal={profile?.xp_total ?? 0}
        mastery={mastery ?? []}
    />
}
