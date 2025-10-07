import type { PackageDocResult } from '@seedcord/api-docs';
import type { CommentDisplayPart, JSONOutput, ProjectReflection, ReflectionKind, VarianceModifier } from 'typedoc';

export interface DocManifestPackage extends Omit<PackageDocResult, 'outputPath' | 'warnings' | 'errors'> {
    output: string | null;
    warningCount: number;
    errorCount: number;
    warnings: string[];
    errors: string[];
}

export interface DocManifest {
    generatedAt: string;
    tool: string;
    typedocVersion: string;
    outputDir: string;
    packages: DocManifestPackage[];
}

export interface DocReference {
    name: string;
    packageName?: string;
    qualifiedName?: string;
    externalUrl?: string;
    target?: number | string | null;
}

export interface DocCommentBlockTag {
    tag: string;
    content: CommentDisplayPart[];
    text: string;
    name?: string;
}

export interface DocCommentExample {
    caption?: string;
    content: string;
    language?: string;
}

export interface DocComment {
    summary: string;
    summaryParts: CommentDisplayPart[];
    blockTags: DocCommentBlockTag[];
    modifierTags: string[];
    examples: DocCommentExample[];
}

export interface DocFlags {
    access: 'public' | 'protected' | 'private' | null;
    isStatic: boolean;
    isAbstract: boolean;
    isReadonly: boolean;
    isOptional: boolean;
    isDeprecated: boolean;
    isInherited: boolean;
}

export interface DocSource {
    fileName: string;
    line: number;
    character: number;
    url?: string;
}

export type DocType = JSONOutput.SomeType;

export interface DocTypeParameter {
    id: number;
    name: string;
    constraint?: DocType | null;
    default?: DocType | null;
    variance?: VarianceModifier;
    comment?: DocComment | null;
}

export interface DocSignatureParameter {
    id: number;
    name: string;
    kind: ReflectionKind;
    type?: DocType | null | undefined;
    defaultValue?: string | undefined;
    comment?: DocComment | null | undefined;
    flags: DocFlags;
}

export interface DocSignature {
    id: number;
    name: string;
    kind: ReflectionKind;
    kindLabel: string;
    fragment: string;
    anchor: string;
    overloadIndex: number;
    type?: DocType | null;
    parameters: DocSignatureParameter[];
    typeParameters: DocTypeParameter[];
    comment?: DocComment | null;
    returnsComment?: DocCommentBlockTag | null;
    throws?: DocCommentBlockTag[];
    sources: DocSource[];
    overwrites?: DocReference | null;
    inheritedFrom?: DocReference | null;
    implementationOf?: DocReference | null;
}

export interface DocKind {
    id: ReflectionKind;
    label: string;
}

export interface DocMembersGroup {
    title: string;
    kind: ReflectionKind | null;
    children: DocNode[];
}

export interface DocMembers {
    all: DocNode[];
    properties: DocNode[];
    methods: DocNode[];
    accessors: DocNode[];
    constructors: DocNode[];
    enumMembers: DocNode[];
    functions: DocNode[];
    namespaces: DocNode[];
    interfaces: DocNode[];
    classes: DocNode[];
    typeAliases: DocNode[];
    variables: DocNode[];
    others: DocNode[];
}

export interface DocInheritance {
    extends?: DocType[];
    implements?: DocType[];
    extendedBy?: DocType[];
    implementedBy?: DocType[];
}

export interface DocNode {
    id: number;
    name: string;
    packageName: string;
    path: string[];
    fullName: string;
    slug: string;
    kind: DocKind;
    flags: DocFlags;
    comment?: DocComment | null;
    external?: DocReference | null;
    type?: DocType | null;
    typeParameters: DocTypeParameter[];
    signatures: DocSignature[];
    members: DocMembers;
    groups: DocMembersGroup[];
    sources: DocSource[];
    defaultValue?: string;
    inheritance: DocInheritance;
    overwrites?: DocReference | null;
    inheritedFrom?: DocReference | null;
    implementationOf?: DocReference | null;
    children: DocNode[];
}

export interface DocSearchEntry {
    id: number;
    packageName: string;
    slug: string;
    name: string;
    fullName: string;
    kind: DocKind;
    summary: string | null;
    detail: string | null;
    tokens: string[];
}

export interface DocIndexes {
    byId: Map<number, DocNode>;
    byFullName: Map<string, DocNode>;
    bySlug: Map<string, DocNode>;
    byKind: Map<ReflectionKind, DocNode[]>;
    search: DocSearchEntry[];
}

export interface DocPackageModel {
    manifest: DocManifestPackage;
    project: ProjectReflection;
    root: DocNode;
    nodes: Map<number, DocNode>;
    indexes: DocIndexes;
}

export interface DocCollection {
    manifest: DocManifest;
    packages: DocPackageModel[];
    indexes: DocIndexes;
}
