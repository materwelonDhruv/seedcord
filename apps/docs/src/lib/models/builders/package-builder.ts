import path from 'node:path';

import { ProjectLoader } from '../project-loader';
import { NodeTransformer } from '../transformers/node-transformer';
import { createTransformContext } from '../transformers/transform-context';

import type { DocIndexes, DocManifestPackage, DocNode, DocPackageModel, DocSearchEntry } from '../types';
import type { ReflectionKind } from 'typedoc';

const buildIndexes = (root: DocNode, manifest: DocManifestPackage): DocIndexes => {
    const byId = new Map<number, DocNode>();
    const bySlug = new Map<string, DocNode>();
    const byQName = new Map<string, DocNode>();
    const byKind = new Map<ReflectionKind, DocNode[]>();
    const search: DocSearchEntry[] = [];

    const visit = (node: DocNode): void => {
        byId.set(node.id, node);
        bySlug.set(node.slug, node);
        if (node.qualifiedName.length > 0) {
            byQName.set(node.qualifiedName, node);
        }

        const bucket = byKind.get(node.kind) ?? [];
        bucket.push(node);
        byKind.set(node.kind, bucket);

        search.push(createSearchEntry(node, manifest));

        for (const child of node.children) {
            visit(child);
        }
    };

    visit(root);

    return { byId, bySlug, byQName, byKind, search };
};

const createSearchEntry = (node: DocNode, manifest: DocManifestPackage): DocSearchEntry => {
    const summary = node.comment?.summary ?? '';
    const aliases = collectAliases(node);
    const fileName = node.sources[0]?.fileName;
    const file = typeof fileName === 'string' && fileName.length > 0 ? path.basename(fileName) : undefined;

    const tokens = collectTokens(node, summary, file, aliases);

    const entry: DocSearchEntry = {
        slug: node.slug,
        name: node.name,
        qualifiedName: node.qualifiedName,
        packageName: node.packageName,
        kind: node.kind,
        summary: summary || null,
        tokens
    };

    if (typeof manifest.version === 'string' && manifest.version.length > 0) {
        entry.packageVersion = manifest.version;
    }

    if (aliases.length > 0) {
        entry.aliases = aliases;
    }

    if (file) {
        entry.file = file;
    }

    return entry;
};

const collectAliases = (node: DocNode): string[] => {
    const comment = node.comment;
    if (!comment) {
        return [];
    }

    const aliasTags = comment.blockTags.filter((tag) => tag.tag === '@alias' || tag.tag === '@label');
    const values = aliasTags.map((tag) => tag.text.trim()).filter((text) => text.length > 0);

    return Array.from(new Set(values));
};

// eslint-disable-next-line max-statements, complexity
const collectTokens = (node: DocNode, summary: string, file: string | undefined, aliases: string[]): string[] => {
    const tokens = new Set<string>();

    const addTokensFromText = (value: string): void => {
        const normalized = value
            .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
            .split(/[^a-zA-Z0-9]+/gu)
            .filter(Boolean);

        for (const part of normalized) {
            tokens.add(part.toLowerCase());
        }
    };

    const textSources = [node.name, ...node.path, node.qualifiedName, summary];
    if (file) {
        textSources.push(file);
    }

    for (const source of textSources) {
        if (source && source.length > 0) {
            addTokensFromText(source);
        }
    }

    for (const signature of node.signatures) {
        for (const parameter of signature.parameters) {
            if (parameter.name.length > 0) {
                addTokensFromText(parameter.name);
            }
        }

        for (const typeParam of signature.typeParameters) {
            if (typeParam.name.length > 0) {
                addTokensFromText(typeParam.name);
            }
        }
    }

    for (const typeParam of node.typeParameters) {
        if (typeParam.name.length > 0) {
            addTokensFromText(typeParam.name);
        }
    }

    for (const alias of aliases) {
        addTokensFromText(alias);
    }

    for (const signature of node.signatures) {
        const tags = signature.comment?.blockTags ?? [];
        for (const t of tags) {
            if (t.tag === '@alias' || t.tag === '@label') {
                const txt = t.text.trim();
                if (txt) addTokensFromText(txt);
            }
        }
    }

    return Array.from(tokens);
};

export const buildPackage = async (pkg: DocManifestPackage, projectPath: string): Promise<DocPackageModel> => {
    const loader = new ProjectLoader();
    const project = await loader.fromFile(projectPath);
    const context = createTransformContext(pkg);
    const transformer = new NodeTransformer(context);
    const root = transformer.transform(project);
    const indexes = buildIndexes(root, pkg);

    return {
        manifest: pkg,
        project,
        root,
        nodes: context.nodes,
        indexes
    };
};
