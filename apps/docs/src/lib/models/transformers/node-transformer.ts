import {
    ReflectionKind,
    type ContainerReflection,
    type DeclarationReflection,
    type ProjectReflection,
    type SignatureReflection
} from 'typedoc';

import {
    mapFlags,
    mapGroups,
    mapInheritance,
    mapReference,
    mapSignature,
    mapSources,
    mapType,
    mapTypeParameters
} from './mappers';
import { registerNode, type TransformContext } from './transform-context';

import type { DocInheritance, DocMembers, DocNode } from '../types';

const createEmptyMembers = (): DocMembers => ({
    all: [],
    properties: [],
    methods: [],
    accessors: [],
    constructors: [],
    enumMembers: [],
    functions: [],
    namespaces: [],
    interfaces: [],
    classes: [],
    typeAliases: [],
    variables: [],
    others: []
});

const createEmptyInheritance = (): DocInheritance => ({
    extends: [],
    implements: [],
    extendedBy: [],
    implementedBy: []
});

const buildPathSegments = (
    reflection: ProjectReflection | DeclarationReflection,
    context: TransformContext,
    parentPath: readonly string[]
): string[] => {
    if (parentPath.length === 0) {
        return [String(context.manifest.name)];
    }

    const label = typeof reflection.name === 'string' && reflection.name.length > 0 ? reflection.name : 'anonymous';
    return [...parentPath, label];
};

const kindLabelOf = (kind: ReflectionKind): string => {
    if (typeof ReflectionKind.singularString === 'function') {
        return ReflectionKind.singularString(kind);
    }

    const fallback = ReflectionKind[kind];
    return typeof fallback === 'string' ? fallback : `#${kind}`;
};

export class NodeTransformer {
    constructor(private readonly context: TransformContext) {}

    transform(project: ProjectReflection): DocNode {
        return this.visit(project, []);
    }

    private visit(reflection: ProjectReflection | DeclarationReflection, parentPath: readonly string[]): DocNode {
        const path = buildPathSegments(reflection, this.context, parentPath);
        const fullName = path.join('.');
        const slug = this.context.slugger.slug(path);
        const reflectionName =
            typeof reflection.name === 'string' && reflection.name.length > 0
                ? reflection.name
                : String(this.context.manifest.name);
        const packageName = String(this.context.manifest.name);
        const kindLabel = kindLabelOf(reflection.kind);
        const isDeclaration = reflection.kind !== ReflectionKind.Project;
        const decl = reflection as DeclarationReflection;

        const node: DocNode = {
            id: reflection.id,
            name: reflectionName,
            packageName,
            path,
            fullName,
            slug,
            kind: {
                id: reflection.kind,
                label: kindLabel
            },
            flags: mapFlags(reflection),
            comment: this.context.commentTransformer.toDocComment(reflection.comment),
            external: null,
            type: isDeclaration ? mapType(decl.type) : null,
            typeParameters: isDeclaration ? mapTypeParameters(this.context, decl.typeParameters) : [],
            signatures: [],
            members: createEmptyMembers(),
            groups: [],
            sources: isDeclaration ? mapSources(decl.sources) : [],
            inheritance: isDeclaration ? mapInheritance(decl) : createEmptyInheritance(),
            overwrites: isDeclaration ? mapReference(decl.overwrites) : null,
            inheritedFrom: isDeclaration ? mapReference(decl.inheritedFrom) : null,
            implementationOf: isDeclaration ? mapReference(decl.implementationOf) : null,
            children: []
        };

        registerNode(this.context, node);

        const container = reflection as ContainerReflection;

        if (isDeclaration) {
            this.populateSignatures(node, decl);
        }

        this.populateChildren(node, container, path);
        this.applyGroups(node, container);

        return node;
    }

    private populateSignatures(node: DocNode, reflection: DeclarationReflection): void {
        if (!Array.isArray(reflection.signatures)) {
            return;
        }

        node.signatures = reflection.signatures.map((signature: SignatureReflection, index: number) =>
            mapSignature(this.context, signature, { id: node.id, name: node.name, slug: node.slug }, index)
        );
    }

    private populateChildren(node: DocNode, container: ContainerReflection, parentPath: readonly string[]): void {
        const children = Array.isArray(container.children) ? container.children : [];
        for (const child of children) {
            const childNode = this.visit(child, parentPath);
            node.children.push(childNode);
            node.members.all.push(childNode);
            bucketize(node.members, child.kind, childNode);
        }
    }

    private applyGroups(node: DocNode, container: ContainerReflection): void {
        if (!Array.isArray(container.groups) || container.groups.length === 0) {
            return;
        }

        node.groups = container.groups.map((group) => mapGroups(group, this.context.nodes));
    }
}

const bucketize = (members: DocMembers, kind: ReflectionKind, node: DocNode): void => {
    const assign = (key: keyof DocMembers): void => {
        members[key].push(node);
    };

    switch (kind) {
        case ReflectionKind.Property:
            assign('properties');
            break;
        case ReflectionKind.Method:
            assign('methods');
            break;
        case ReflectionKind.Accessor:
            assign('accessors');
            break;
        case ReflectionKind.Constructor:
            assign('constructors');
            break;
        case ReflectionKind.EnumMember:
            assign('enumMembers');
            break;
        case ReflectionKind.Function:
            assign('functions');
            break;
        case ReflectionKind.Namespace:
            assign('namespaces');
            break;
        case ReflectionKind.Interface:
            assign('interfaces');
            break;
        case ReflectionKind.Class:
            assign('classes');
            break;
        case ReflectionKind.TypeAlias:
            assign('typeAliases');
            break;
        case ReflectionKind.Variable:
            assign('variables');
            break;
        default:
            assign('others');
            break;
    }
};
