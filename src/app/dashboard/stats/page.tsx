import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { fetchRankingData } from '@/lib/rankings'
import StatsClient from './StatsClient'

export default async function StatsPage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()

    const { data: profile } = await supabase
        .from('profiles')
        .select('exercises_solved, current_streak, longest_streak, xp_total, ranking_opt_in')
        .eq('id', userId)
        .single()

    const { data: mastery } = await supabase
        .from('user_topic_mastery')
        .select('subcategory, attempts, correct, wrong_count, avg_self_rating, best_streak, last_practiced')
        .eq('user_id', userId)

    const rankingData = await fetchRankingData(userId)

    // Fetch blitz best scores per module
    const { data: blitzScores } = await supabase
        .from('blitz_scores')
        .select('module_id, score')
        .eq('user_id', userId)
        .order('score', { ascending: false })

    // Aggregate best score per module
    const blitzBests: Record<string, number> = {}
    for (const row of blitzScores ?? []) {
        if (!blitzBests[row.module_id] || row.score > blitzBests[row.module_id]) {
            blitzBests[row.module_id] = row.score
        }
    }

    return <StatsClient
        exercisesSolved={profile?.exercises_solved ?? 0}
        currentStreak={profile?.current_streak ?? 0}
        longestStreak={profile?.longest_streak ?? 0}
        xpTotal={profile?.xp_total ?? 0}
        mastery={mastery ?? []}
        rankingData={rankingData}
        rankingOptIn={profile?.ranking_opt_in ?? false}
        blitzBests={blitzBests}
    />
}
