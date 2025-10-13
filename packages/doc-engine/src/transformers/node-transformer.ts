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
    mapTypeParameters,
    primaryUrlFromSources
} from './mappers';
import { formatRenderedDeclarationHeader, renderDeclarationHeader } from './signature-renderer';
import { registerNode, type TransformContext } from './transform-context';
import { toGlobalId } from '../ids';
import { kindLabel } from '../kinds';
import { slugForNode } from '../slugger';

import type { DocInheritance, DocNode } from '../types';

const buildPathSegments = (
    reflection: ProjectReflection | DeclarationReflection,
    _context: TransformContext,
    parentPath: readonly string[]
): string[] => {
    const label = typeof reflection.name === 'string' && reflection.name.length > 0 ? reflection.name : 'anonymous';

    if (reflection.kind === ReflectionKind.Project) {
        return []; // project is the root, no path segments
    }

    // if we're at the first level under the project, start the path with the label
    return parentPath.length === 0 ? [label] : [...parentPath, label];
};

const kindLabelOf = (kind: ReflectionKind): string => kindLabel(kind);

const createEmptyInheritance = (): DocInheritance => ({
    extends: [],
    implements: [],
    extendedBy: [],
    implementedBy: []
});

interface CreateNodeParams {
    reflection: ProjectReflection | DeclarationReflection;
    reflectionName: string;
    packageName: string;
    path: string[];
    qualifiedName: string;
    slug: string;
}

export class NodeTransformer {
    constructor(private readonly context: TransformContext) {}

    transform(project: ProjectReflection): DocNode {
        return this.visit(project, []);
    }

    private visit(reflection: ProjectReflection | DeclarationReflection, parentPath: readonly string[]): DocNode {
        const path = buildPathSegments(reflection, this.context, parentPath);
        const qualifiedName = path.join('.');
        const slug = slugForNode(this.context.slugger, path);
        const packageName = String(this.context.manifest.name);
        const reflectionName =
            typeof reflection.name === 'string' && reflection.name.length > 0 ? reflection.name : packageName;
        const node = this.createBaseNode({
            reflection,
            reflectionName,
            packageName,
            path,
            qualifiedName,
            slug
        });

        registerNode(this.context, node);

        const container = reflection as ContainerReflection;
        const declaration = reflection.kind !== ReflectionKind.Project ? (reflection as DeclarationReflection) : null;

        if (declaration) {
            this.applyDeclarationDetails(node, declaration);
            this.populateSignatures(node, declaration);
        }

        this.populateChildren(node, container, path);
        this.applyGroups(node, container);

        return node;
    }

    private packageVersion(): string | undefined {
        const version = this.context.manifest.version;
        return typeof version === 'string' && version.length > 0 ? version : undefined;
    }

    private createBaseNode(params: CreateNodeParams): DocNode {
        const { reflection, reflectionName, packageName, path, qualifiedName, slug } = params;
        const node: DocNode = {
            id: reflection.id,
            key: toGlobalId(packageName, reflection.id),
            name: reflectionName,
            packageName,
            path,
            qualifiedName,
            slug,
            kind: reflection.kind,
            kindLabel: kindLabelOf(reflection.kind),
            flags: mapFlags(reflection),
            comment: this.context.commentTransformer.toDocComment(reflection.comment),
            typeParameters: [],
            signatures: [],
            children: [],
            groups: [],
            sources: [],
            inheritance: createEmptyInheritance(),
            overwrites: null,
            inheritedFrom: null,
            implementationOf: null
        };

        const version = this.packageVersion();
        if (version) {
            node.packageVersion = version;
        }

        return node;
    }

    private applyDeclarationDetails(node: DocNode, reflection: DeclarationReflection): void {
        const mappedType = mapType(reflection.type);
        if (mappedType !== null) {
            node.type = mappedType;
        }

        node.typeParameters = mapTypeParameters(this.context, reflection.typeParameters);
        node.sources = mapSources(reflection.sources);
        const inheritance = mapInheritance(reflection);
        node.inheritance = inheritance;
        node.header = renderDeclarationHeader(this.context, node.name, {
            kind: node.kind,
            flags: node.flags,
            typeParams: node.typeParameters,
            inheritance
        });
        node.headerText = formatRenderedDeclarationHeader(node.header);
        node.overwrites = mapReference(this.context, reflection.overwrites);
        node.inheritedFrom = mapReference(this.context, reflection.inheritedFrom);
        node.implementationOf = mapReference(this.context, reflection.implementationOf);

        const def = (reflection as unknown as { defaultValue?: string }).defaultValue;
        if (typeof def === 'string' && def.length > 0) {
            node.defaultValue = def;
        }

        const sourceUrl = primaryUrlFromSources(reflection.sources);
        if (typeof sourceUrl === 'string') {
            node.sourceUrl = sourceUrl;
        }
    }

    private populateSignatures(node: DocNode, reflection: DeclarationReflection): void {
        const acc = reflection as unknown as { getSignature?: SignatureReflection; setSignature?: SignatureReflection };
        const out: SignatureReflection[] = [];

        if (Array.isArray(reflection.signatures)) out.push(...reflection.signatures);
        if (acc.getSignature) out.push(acc.getSignature);
        if (acc.setSignature) out.push(acc.setSignature);

        const fragments = new Set<string>();

        node.signatures = out.map((sig, i) =>
            mapSignature(this.context, sig, { id: node.id, name: node.name, slug: node.slug }, i, fragments)
        );
    }

    private populateChildren(node: DocNode, container: ContainerReflection, parentPath: readonly string[]): void {
        const children = Array.isArray(container.children) ? container.children : [];
        for (const child of children) {
            const childNode = this.visit(child, parentPath);
            node.children.push(childNode);
        }
    }

    private applyGroups(node: DocNode, container: ContainerReflection): void {
        if (!Array.isArray(container.groups) || container.groups.length === 0) {
            return;
        }

        node.groups = container.groups.map((group) => mapGroups(group, node.packageName));
    }
}
