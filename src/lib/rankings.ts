import { getSupabaseAdmin } from '@/lib/supabase/admin';

type RankedUser = {
    display_name: string;
    exercises_solved: number;
    is_self: boolean;
    position: number;
};

type ExternalUniEntry = {
    institution: string;
    total_exercises: number;
};

export type RankingData = {
    global_top_3: RankedUser[];
    my_global_position: number | null;
    institution: string | null;
    internal_ranking: RankedUser[];
    my_internal_position: number | null;
    external_ranking: ExternalUniEntry[];
    uni_total_exercises: number;
    uni_qualified: boolean;
};

export function formatDisplayName(fullName: string | null): string {
    if (!fullName || fullName.trim() === '') return 'Anonimo';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const lastInitial = parts[parts.length - 1][0].toUpperCase();
    return `${first} ${lastInitial}.`;
}

export async function fetchRankingData(userId: string): Promise<RankingData> {
    const supabase = getSupabaseAdmin();

    // Get current user's profile
    const { data: myProfile } = await supabase
        .from('profiles')
        .select('full_name, exercises_solved, institution, ranking_opt_in')
        .eq('id', userId)
        .single();

    const myInstitution = myProfile?.institution ?? null;
    const myOptIn = myProfile?.ranking_opt_in ?? false;
    const myExercises = myProfile?.exercises_solved ?? 0;

    // Global top 3 (opted-in only)
    const { data: globalTop } = await supabase
        .from('profiles')
        .select('id, full_name, exercises_solved')
        .eq('ranking_opt_in', true)
        .order('exercises_solved', { ascending: false })
        .limit(3);

    const global_top_3: RankedUser[] = (globalTop ?? []).map((u, i) => ({
        display_name: formatDisplayName(u.full_name),
        exercises_solved: u.exercises_solved ?? 0,
        is_self: u.id === userId,
        position: i + 1,
    }));

    // My global position (if opted in)
    let my_global_position: number | null = null;
    if (myOptIn) {
        const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('ranking_opt_in', true)
            .gt('exercises_solved', myExercises);

        my_global_position = (count ?? 0) + 1;
    }

    // Internal ranking (same institution, opted-in, top 10)
    let internal_ranking: RankedUser[] = [];
    let my_internal_position: number | null = null;

    if (myInstitution) {
        const { data: internalTop } = await supabase
            .from('profiles')
            .select('id, full_name, exercises_solved')
            .eq('ranking_opt_in', true)
            .eq('institution', myInstitution)
            .order('exercises_solved', { ascending: false })
            .limit(3);

        internal_ranking = (internalTop ?? []).map((u, i) => ({
            display_name: formatDisplayName(u.full_name),
            exercises_solved: u.exercises_solved ?? 0,
            is_self: u.id === userId,
            position: i + 1,
        }));

        if (myOptIn) {
            const { count } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('ranking_opt_in', true)
                .eq('institution', myInstitution)
                .gt('exercises_solved', myExercises);

            my_internal_position = (count ?? 0) + 1;
        }
    }

    // External uni ranking — aggregate exercises per institution
    let external_ranking: ExternalUniEntry[] = [];
    let uni_total_exercises = 0;

    const institutionIds = ['usp', 'ufscar'];
    for (const instId of institutionIds) {
        const { data: instProfiles } = await supabase
            .from('profiles')
            .select('exercises_solved')
            .eq('institution', instId);

        const total = (instProfiles ?? []).reduce((sum, p) => sum + (p.exercises_solved ?? 0), 0);
        if (instId === myInstitution) {
            uni_total_exercises = total;
        }
        if (total >= 100) {
            external_ranking.push({ institution: instId, total_exercises: total });
        }
    }
    external_ranking.sort((a, b) => b.total_exercises - a.total_exercises);

    const uni_qualified = myInstitution ? uni_total_exercises >= 100 : false;

    return {
        global_top_3,
        my_global_position,
        institution: myInstitution,
        internal_ranking,
        my_internal_position,
        external_ranking,
        uni_total_exercises,
        uni_qualified,
    };
}
