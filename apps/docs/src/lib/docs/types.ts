import type { EntityTone } from '../entityMetadata';
import type { DocsEngine } from './engine';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { DirectoryEntity, DocComment } from '@seedcord/docs-engine';

export interface FormatContext {
    engine: DocsEngine;
    manifestPackage: string;
}

export interface CodeRepresentation {
    text: string;
    html: string | null;
}

export type CommentDisplayPart = NonNullable<DocComment['summaryParts']>[number];

export type InlineTagPart = CommentDisplayPart & {
    kind: 'inline-tag';
    tag?: string;
    text?: string;
    target?: unknown;
    url?: string;
};

export type CodePart = CommentDisplayPart & { kind: 'code'; text?: string };
export type TextPart = CommentDisplayPart & { kind: 'text'; text?: string };

export interface CommentParagraph {
    plain: string;
    html: string;
}

export interface CommentExample {
    caption?: string;
    code: CodeRepresentation;
}

export interface FormattedComment {
    paragraphs: CommentParagraph[];
    examples: CommentExample[];
}
export interface NavigationEntityItem {
    id: string;
    label: string;
    href: string;
}

export interface NavigationCategory {
    id: DirectoryEntity;
    title: string;
    tone: EntityTone;
    items: readonly NavigationEntityItem[];
}

export interface PackageVersionCatalog {
    id: string;
    label: string;
    summary: string;
    manifestVersion: string;
    basePath: string;
    categories: readonly NavigationCategory[];
}

export interface PackageCatalogEntry {
    id: string;
    manifestName: string;
    label: string;
    description: string;
    versions: readonly PackageVersionCatalog[];
}

export type DocsCatalog = readonly PackageCatalogEntry[];

export interface CategoryConfig {
    readonly entity: DirectoryEntity;
    readonly title: string;
    readonly tone: EntityTone;
}

export type EntityKind = EntityTone;

export interface BaseEntityModel {
    kind: EntityKind;
    name: string;
    slug: string;
    qualifiedName: string;
    manifestPackage: string;
    displayPackage: string;
    version?: string;
    summary: CommentParagraph[];
    summaryExamples: CommentExample[];
    signature: CodeRepresentation;
    sourceUrl?: string;
    isDeprecated: boolean;
}

export interface ClassLikeEntityModel extends BaseEntityModel {
    typeParameters: EntityMemberSummary[];
    properties: EntityMemberSummary[];
    methods: EntityMemberSummary[];
    constructors: EntityMemberSummary[];
}

export interface EnumMemberModel {
    id: string;
    label: string;
    value?: string;
    summary: CommentParagraph[];
    signature: CodeRepresentation;
    sourceUrl?: string;
}

export interface EnumEntityModel extends BaseEntityModel {
    kind: 'enum';
    members: EnumMemberModel[];
}

export interface TypeEntityModel extends BaseEntityModel {
    kind: 'type';
    declaration: CodeRepresentation;
    typeParameters: EntityMemberSummary[];
}

export interface FunctionSignatureParameterModel {
    name: string;
    optional: boolean;
    type?: string;
    defaultValue?: string;
    documentation: CommentParagraph[];
}

export interface FunctionSignatureModel {
    id: string;
    code: CodeRepresentation;
    overloadIndex: number;
    parameters: FunctionSignatureParameterModel[];
    returnType?: string;
    summary: CommentParagraph[];
    examples: CommentExample[];
    sourceUrl?: string;
}

export interface FunctionEntityModel extends BaseEntityModel {
    kind: 'function';
    signatures: FunctionSignatureModel[];
}

export interface VariableEntityModel extends BaseEntityModel {
    kind: 'variable';
    declaration: CodeRepresentation;
}

export type EntityModel =
    | (ClassLikeEntityModel & { kind: 'class' })
    | (ClassLikeEntityModel & { kind: 'interface' })
    | EnumEntityModel
    | TypeEntityModel
    | FunctionEntityModel
    | VariableEntityModel;

export type ExternalDocumentationMap = ReadonlyMap<string, string>;
export interface EntityQueryParams {
    pkg?: string;
    manifestPackage?: string;
    slug?: string;
    symbol?: string;
    qualifiedName?: string;
    kind?: string;
}
export interface InternalEntityLookupParams {
    manifestPackage: string;
    slug?: string;
    symbol?: string;
    qualifiedName?: string;
    kind: EntityKind | null;
}
export interface BuildEntityHrefOptions {
    manifestPackage: string;
    slug: string;
    version?: string | null;
    tone?: string | null;
}

export interface ParagraphAccumulator {
    append(plain: string, html: string): void;
    breakParagraph(): void;
    toParagraphs(): CommentParagraph[];
}
