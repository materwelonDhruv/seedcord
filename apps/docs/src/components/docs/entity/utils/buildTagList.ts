import type { EntityMemberSummary } from '../types';

export function buildTagList(member: EntityMemberSummary): string[] {
    const collected = new Set(member.tags ?? []);

    // Remove modifiers that should be shown in the signature instead of as tags
    const toRemove = new Set(['static', 'readonly', 'abstract', 'async', 'public', 'private', 'protected']);

    for (const tag of Array.from(collected)) {
        if (toRemove.has(tag)) collected.delete(tag);
    }

    // Do not add accessor-specific tags here; accessor handling will be moved to signatures in a follow-up
    return Array.from(collected);
}
