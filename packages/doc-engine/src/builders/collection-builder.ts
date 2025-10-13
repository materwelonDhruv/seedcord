import { existsSync } from 'node:fs';
import path from 'node:path';

import { buildPackage } from './package-builder';

import type { GlobalId } from '../ids';
import type { DocCollection, DocManifest, DocManifestPackage, DocPackageModel } from '../types';

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

    ordered.add(options.manifestDir);

    const resolvedOutput = resolveOutputCandidate(options.workspaceRoot, options.manifestOutputDir);
    if (resolvedOutput) {
        ordered.add(resolvedOutput);
    }

    ordered.add(options.workspaceRoot);

    return Array.from(ordered);
};

const resolveOutputCandidate = (workspaceRoot: string, outputDir: string): string | null => {
    const trimmed = outputDir.trim();
    if (trimmed.length === 0) {
        return null;
    }

    return path.resolve(workspaceRoot, trimmed);
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

    const { byKey, byGlobalSlug } = buildGlobalMaps(packages);
    return { manifest, packages, byKey, byGlobalSlug };
};

const buildGlobalMaps = (packages: DocPackageModel[]): Pick<DocCollection, 'byKey' | 'byGlobalSlug'> => {
    const byKey = new Map<GlobalId, DocPackageModel['root']>();
    const byGlobalSlug = new Map<string, DocPackageModel['root']>();

    for (const pkg of packages) {
        for (const node of pkg.indexes.byId.values()) {
            byKey.set(node.key, node);
            const slugKey = `${pkg.manifest.name}:${node.slug}`;
            byGlobalSlug.set(slugKey, node);
        }
    }

    return { byKey, byGlobalSlug };
};
