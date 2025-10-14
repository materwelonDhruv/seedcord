import type { MemberAccessLevel } from '@lib/member-access';

export type MemberAccessorType = 'getter' | 'setter' | 'accessor';

export interface EntityMemberSummary {
    id: string;
    label: string;
    description: string;
    signature?: string;
    signatureHtml?: string | null;
    documentation?: string;
    inheritedFrom?: string;
    tags?: readonly string[];
    access?: MemberAccessLevel;
    sourceUrl?: string;
    accessorType?: MemberAccessorType;
}

export interface EntityMembersByKind {
    properties: readonly EntityMemberSummary[];
    methods: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
}
