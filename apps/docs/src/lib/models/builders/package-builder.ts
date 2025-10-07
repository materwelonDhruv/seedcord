import { ProjectLoader } from '../project-loader';
import { NodeTransformer } from '../transformers/node-transformer';
import { createTransformContext } from '../transformers/transform-context';

import type { DocIndexes, DocManifestPackage, DocNode, DocPackageModel, DocSearchEntry } from '../types';
import type { ReflectionKind } from 'typedoc';

const buildIndexes = (root: DocNode): DocIndexes => {
    const byId = new Map<number, DocNode>();
    const byFullName = new Map<string, DocNode>();
    const bySlug = new Map<string, DocNode>();
    const byKind = new Map<ReflectionKind, DocNode[]>();
    const search: DocSearchEntry[] = [];

    const visit = (node: DocNode): void => {
        byId.set(node.id, node);
        byFullName.set(node.fullName, node);
        bySlug.set(node.slug, node);

        const bucket = byKind.get(node.kind.id) ?? [];
        bucket.push(node);
        byKind.set(node.kind.id, bucket);

        const summary = node.comment?.summary ?? '';
        search.push({
            id: node.id,
            packageName: node.packageName,
            slug: node.slug,
            name: node.name,
            fullName: node.fullName,
            kind: node.kind,
            summary: summary || null,
            detail: null,
            tokens: tokenize(node, summary)
        });

        for (const child of node.children) {
            visit(child);
        }
    };

    visit(root);

    return { byId, byFullName, bySlug, byKind, search };
};

const tokenize = (node: DocNode, summary: string): string[] => {
    const base = [node.name, ...node.path, node.fullName, summary].join(' ');
    const withSplit = base
        .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
        .split(/[^a-zA-Z0-9]+/gu)
        .filter(Boolean)
        .map((token) => token.toLowerCase());

    return Array.from(new Set(withSplit));
};

export const buildPackage = async (pkg: DocManifestPackage, projectPath: string): Promise<DocPackageModel> => {
    const loader = new ProjectLoader();
    const project = await loader.fromFile(projectPath);
    const context = createTransformContext(pkg);
    const transformer = new NodeTransformer(context);
    const root = transformer.transform(project);
    const indexes = buildIndexes(root);

    return {
        manifest: pkg,
        project,
        root,
        nodes: context.nodes,
        indexes
    };
};
