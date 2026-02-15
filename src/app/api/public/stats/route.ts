import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { formatDisplayName } from '@/lib/rankings';
import { getInstitutionById } from '@/data/institutions';
import { rateLimit } from '@/lib/rate-limit';

type CachedData = {
    total_exercises_solved: number;
    total_active_students: number;
    total_questions_available: number;
    top_students: { user_id: string; display_name: string; exercises_solved: number; position: number }[];
    university_battle: { institution_id: string; institution_name: string; total_exercises: number }[];
};

let cache: { data: CachedData; expiresAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const blocked = rateLimit(ip, 'public');
    if (blocked) return blocked;

    const now = Date.now();
    if (cache && now < cache.expiresAt) {
        return NextResponse.json(cache.data, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
        });
    }

    const supabase = getSupabaseAdmin();

    // Run queries in parallel
    const [exercisesResult, activeResult, topStudentsResult, ...uniResults] = await Promise.all([
        // Total exercises solved across all users
        supabase.from('profiles').select('exercises_solved'),
        // Active students (anyone with >= 1 exercise)
        supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .gt('exercises_solved', 0),
        // Top 5 opted-in students
        supabase
            .from('profiles')
            .select('id, full_name, exercises_solved')
            .eq('ranking_opt_in', true)
            .order('exercises_solved', { ascending: false })
            .limit(5),
        // University totals
        ...['usp', 'ufscar'].map(instId =>
            supabase
                .from('profiles')
                .select('exercises_solved')
                .eq('institution', instId),
        ),
    ]);

    const total_exercises_solved = (exercisesResult.data ?? []).reduce(
        (sum, p) => sum + (p.exercises_solved ?? 0),
        0,
    );

    const total_active_students = activeResult.count ?? 0;

    const top_students = (topStudentsResult.data ?? []).map((u, i) => ({
        user_id: u.id,
        display_name: formatDisplayName(u.full_name),
        exercises_solved: u.exercises_solved ?? 0,
        position: i + 1,
    }));

    const institutionIds = ['usp', 'ufscar'];
    const university_battle = institutionIds
        .map((instId, i) => {
            const total = (uniResults[i].data ?? []).reduce(
                (sum, p) => sum + (p.exercises_solved ?? 0),
                0,
            );
            const config = getInstitutionById(instId);
            return {
                institution_id: instId,
                institution_name: config?.name ?? instId,
                total_exercises: total,
            };
        })
        .sort((a, b) => b.total_exercises - a.total_exercises);

    const data: CachedData = {
        total_exercises_solved,
        total_active_students,
        total_questions_available: 56000,
        top_students,
        university_battle,
    };

    cache = { data, expiresAt: now + CACHE_TTL };

    return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
}
