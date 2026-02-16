export const GAME_DURATION: Record<string, number> = {
    derivadas: 180,  // 3 minutes
    integrais: 180,  // 3 minutes
    edos: 600,       // 10 minutes
};

export const MAX_STRIKES = 3;
export const FEEDBACK_DELAY = 1000; // 1s delay after answer selection

export function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function stripProblemPrefix(text: string): string {
    return text.replace(/^(Resolva a EDO:\s*|Calcule\s+|Derive\s+|Resolva\s+|Encontre\s+|Determine\s+)/i, '');
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
