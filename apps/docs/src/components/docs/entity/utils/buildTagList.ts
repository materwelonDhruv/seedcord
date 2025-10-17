import type { EntityMemberSummary } from '../types';

export function buildTagList(member: EntityMemberSummary): string[] {
    const collected = new Set(member.tags ?? []);

    if (member.accessorType) {
        collected.add(member.accessorType);
        collected.add('accessor');
    }

    return Array.from(collected);
}
