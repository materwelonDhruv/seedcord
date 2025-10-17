import type { CommentExample, CommentParagraph } from '@lib/docs/comment-format';
import type { CodeRepresentation } from '@lib/docs/formatting';
import type { MemberAccessLevel } from '@lib/member-access';

export type MemberAccessorType = 'getter' | 'setter' | 'accessor';

export interface MemberSignatureDetail {
    id: string;
    anchor: string;
    code: CodeRepresentation;
    documentation: CommentParagraph[];
    examples: CommentExample[];
    sourceUrl?: string;
}

export interface EntityMemberSummary {
    id: string;
    label: string;
    description?: CommentParagraph;
    sharedDocumentation: CommentParagraph[];
    sharedExamples: CommentExample[];
    signatures: MemberSignatureDetail[];
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
