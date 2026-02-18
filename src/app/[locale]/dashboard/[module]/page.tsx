import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import ModuleClient from './ModuleClient'

export default async function ModulePage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    const supabase = getSupabaseAdmin()

    const [{ data: profile }, { data: mastery }] = await Promise.all([
        supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', userId)
            .single(),
        supabase
            .from('user_topic_mastery')
            .select('subcategory, attempts, correct, best_streak, easy_count')
            .eq('user_id', userId),
    ])

    // Build topic progress map
    const topicProgress: Record<string, { attempts: number; correct: number; bestStreak: number; easyCount: number }> = {}
    for (const row of mastery ?? []) {
        topicProgress[row.subcategory] = {
            attempts: row.attempts ?? 0,
            correct: row.correct ?? 0,
            bestStreak: row.best_streak ?? 0,
            easyCount: row.easy_count ?? 0,
        }
    }

    return (
        <ModuleClient
            isPremium={profile?.is_premium ?? false}
            topicProgress={topicProgress}
        />
    )
}
