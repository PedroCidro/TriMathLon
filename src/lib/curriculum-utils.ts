import { curriculum } from '@/data/curriculum';

/** Map from module ID → set of topic IDs */
export const MODULE_TOPIC_MAP = new Map<string, Set<string>>();
for (const mod of curriculum) {
    MODULE_TOPIC_MAP.set(mod.id, new Set(mod.topics.map(t => t.id)));
}

/** All valid module IDs */
export const ALL_MODULE_IDS = new Set(curriculum.map(m => m.id));

/** Expand module IDs into the union of their topic IDs */
export function topicIdsForModules(moduleIds: string[]): string[] {
    const topics: string[] = [];
    for (const mid of moduleIds) {
        const set = MODULE_TOPIC_MAP.get(mid);
        if (set) topics.push(...set);
    }
    return topics;
}
