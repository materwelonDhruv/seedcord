import { type MemberAccessLevel, MEMBER_ACCESS_RANK } from '@lib/memberAccess';

import type { EntityMemberSummary } from '../types';

export function shouldIncludeMember(member: EntityMemberSummary, threshold: MemberAccessLevel): boolean {
    const access = member.access ?? 'public';
    return MEMBER_ACCESS_RANK[access] <= MEMBER_ACCESS_RANK[threshold];
}
