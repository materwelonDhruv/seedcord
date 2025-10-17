import type { CommentParagraph, CommentExample, EntityModel, WithCode, WithDocs, WithSourceUrl } from '@lib/docs/types';
import type { MemberAccessLevel } from '@lib/memberAccess';

export type MemberAccessorType = 'getter' | 'setter' | 'accessor';

export interface MemberSignatureDetail extends WithCode, WithDocs<'documentation', 'examples'>, WithSourceUrl {
    id: string;
    anchor: string;
}

export interface EntityMemberSummary extends WithSourceUrl {
    id: string;
    label: string;
    description?: CommentParagraph;
    sharedDocumentation: CommentParagraph[];
    sharedExamples: CommentExample[];
    signatures: MemberSignatureDetail[];
    inheritedFrom?: string | { name: string; href?: string };
    tags?: readonly string[];
    access?: MemberAccessLevel;
    accessorType?: MemberAccessorType;
}

export interface EntityMembersByKind {
    properties: readonly EntityMemberSummary[];
    methods: readonly EntityMemberSummary[];
    constructors: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
}
export type MemberPrefix = 'property' | 'method' | 'constructor' | 'typeParameter';
export type ClassLikeModel = Extract<EntityModel, { kind: 'class' | 'interface' }>;
export type EnumModel = Extract<EntityModel, { kind: 'enum' }>;
export type TypeModel = Extract<EntityModel, { kind: 'type' }>;
export type FunctionModel = Extract<EntityModel, { kind: 'function' }>;
export type VariableModel = Extract<EntityModel, { kind: 'variable' }>;
