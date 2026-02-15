import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { formatDisplayName } from '@/lib/rankings';
import { getInstitutionById } from '@/data/institutions';
import { curriculum } from '@/data/curriculum';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> },
) {
    const { userId } = await params;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const blocked = rateLimit(ip, 'public');
    if (blocked) return blocked;

    const supabase = getSupabaseAdmin();

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, academic_level, institution, exercises_solved, current_streak, longest_streak, xp_total, ranking_opt_in')
        .eq('id', userId)
        .single();

    if (!profile || !profile.ranking_opt_in) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Fetch mastery and blitz in parallel
    const [masteryResult, blitzResult] = await Promise.all([
        supabase
            .from('user_topic_mastery')
            .select('subcategory, attempts, correct')
            .eq('user_id', userId),
        supabase
            .from('blitz_scores')
            .select('module_id, score')
            .eq('user_id', userId)
            .order('score', { ascending: false }),
    ]);

    // Per-module accuracy
    const masteryMap = new Map(
        (masteryResult.data ?? []).map(m => [m.subcategory, m]),
    );

    const module_accuracy = curriculum.map(mod => {
        const modTopics = mod.topics
            .map(t => masteryMap.get(t.id))
            .filter((m): m is { subcategory: string; attempts: number; correct: number } => !!m && m.attempts > 0);
        const totalCorrect = modTopics.reduce((s, m) => s + m.correct, 0);
        const totalAttempts = modTopics.reduce((s, m) => s + m.attempts, 0);
        return {
            module_id: mod.id,
            accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
            topics_practiced: modTopics.length,
            topics_total: mod.topics.length,
        };
    });

    // Blitz bests
    const blitzBests: Record<string, number> = {};
    for (const row of blitzResult.data ?? []) {
        if (!blitzBests[row.module_id] || row.score > blitzBests[row.module_id]) {
            blitzBests[row.module_id] = row.score;
        }
    }

    const institutionConfig = profile.institution ? getInstitutionById(profile.institution) : null;

    return NextResponse.json({
        display_name: formatDisplayName(profile.full_name),
        academic_level: profile.academic_level,
        institution: institutionConfig?.name ?? null,
        exercises_solved: profile.exercises_solved ?? 0,
        current_streak: profile.current_streak ?? 0,
        longest_streak: profile.longest_streak ?? 0,
        xp_total: profile.xp_total ?? 0,
        module_accuracy,
        blitz_bests: blitzBests,
    }, {
        headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60' },
    });
}
