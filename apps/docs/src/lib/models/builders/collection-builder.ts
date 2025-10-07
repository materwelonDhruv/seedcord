import { existsSync } from 'node:fs';
import path from 'node:path';

import { buildPackage } from './package-builder';

import type { DocCollection, DocIndexes, DocManifest, DocManifestPackage, DocPackageModel } from '../types';
import type { ReflectionKind } from 'typedoc';

export interface ResolveOptions {
    workspaceRoot: string;
    generatedRoot?: string;
    manifestDir: string;
    manifestOutputDir: string;
}

const collectBaseCandidates = (options: ResolveOptions): string[] => {
    const ordered = new Set<string>();

    if (options.generatedRoot) {
        ordered.add(options.generatedRoot);
    }

    ordered.add(options.workspaceRoot);

    const trimmed = options.manifestOutputDir.trim();
    if (trimmed.length > 0) {
        ordered.add(path.resolve(options.workspaceRoot, trimmed));
    }

    ordered.add(options.manifestDir);

    return Array.from(ordered);
};

const resolvePackageJsonPath = (pkg: DocManifestPackage, baseCandidates: string[]): string | null => {
    if (!pkg.output) {
        return null;
    }

    for (const base of baseCandidates) {
        const resolved = path.resolve(base, pkg.output);
        if (existsSync(resolved)) {
            return resolved;
        }

        const fallback = path.join(resolved, 'project.json');
        if (existsSync(fallback)) {
            return fallback;
        }
    }

    const first = baseCandidates[0];
    if (!first) {
        return null;
    }

    const defaultPath = path.resolve(first, pkg.output);
    return defaultPath.endsWith('.json') ? defaultPath : path.join(defaultPath, 'project.json');
};

export const buildCollection = async (manifest: DocManifest, options: ResolveOptions): Promise<DocCollection> => {
    const baseCandidates = collectBaseCandidates(options);
    const packages: DocPackageModel[] = [];

    for (const pkg of manifest.packages) {
        const projectPath = resolvePackageJsonPath(pkg, baseCandidates);
        if (!projectPath) {
            continue;
        }

        const model = await buildPackage(pkg, projectPath);
        packages.push(model);
    }

    const indexes = mergeIndexes(packages);
    return { manifest, packages, indexes };
};

const mergeIndexes = (packages: DocPackageModel[]): DocIndexes => {
    const byId = new Map<number, DocPackageModel['root']>();
    const byFullName = new Map<string, DocPackageModel['root']>();
    const bySlug = new Map<string, DocPackageModel['root']>();
    const byKind = new Map<ReflectionKind, DocPackageModel['root'][]>();
    const search: DocPackageModel['indexes']['search'] = [];

    for (const pkg of packages) {
        for (const [id, node] of pkg.indexes.byId.entries()) {
            byId.set(id, node);
        }

        for (const [fullName, node] of pkg.indexes.byFullName.entries()) {
            byFullName.set(`${pkg.manifest.name}:${fullName}`, node);
        }

        for (const [slug, node] of pkg.indexes.bySlug.entries()) {
            bySlug.set(`${pkg.manifest.name}:${slug}`, node);
        }

        for (const [kind, nodes] of pkg.indexes.byKind.entries()) {
            const existing = byKind.get(kind) ?? [];
            existing.push(...nodes);
            byKind.set(kind, existing);
        }

        search.push(...pkg.indexes.search);
    }

    return { byId, byFullName, bySlug, byKind, search };
};
