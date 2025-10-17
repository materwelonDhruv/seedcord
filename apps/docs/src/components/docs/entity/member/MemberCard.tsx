import { cn } from '@lib/utils';

import { MemberCardBody } from './MemberCardBody';
import { MemberCardHeader } from './MemberCardHeader';
import { buildTagList } from '../utils/buildTagList';

import type { EntityMemberSummary, MemberPrefix } from '../types';
import type { ReactElement } from 'react';

interface MemberCardProps {
    member: EntityMemberSummary;
    prefix: MemberPrefix;
    isLast: boolean;
}
export function MemberCard({ member, prefix, isLast }: MemberCardProps): ReactElement {
    const tags = buildTagList(member);
    const anchorId = `${prefix}-${member.id}`;
    const hasTags = tags.length > 0;

    return (
        <article
            id={anchorId}
            className={cn(
                'w-full min-w-0 max-w-full lg:scroll-mt-32',
                hasTags ? 'pt-4' : 'pt-3',
                isLast ? 'pb-4' : 'pb-6'
            )}
        >
            <MemberCardHeader member={member} anchorId={anchorId} tags={tags} prefix={prefix} />
            <MemberCardBody member={member} />
        </article>
    );
}
