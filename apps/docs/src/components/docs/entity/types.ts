import type { CodeRepresentation, CommentParagraph, CommentExample, EntityModel } from '@lib/docs/types';
import type { MemberAccessLevel } from '@lib/memberAccess';

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
    constructors: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
}
export type MemberPrefix = 'property' | 'method' | 'constructor' | 'typeParameter';
export type ClassLikeModel = Extract<EntityModel, { kind: 'class' | 'interface' }>;
export type EnumModel = Extract<EntityModel, { kind: 'enum' }>;
export type TypeModel = Extract<EntityModel, { kind: 'type' }>;
export type FunctionModel = Extract<EntityModel, { kind: 'function' }>;
export type VariableModel = Extract<EntityModel, { kind: 'variable' }>;
