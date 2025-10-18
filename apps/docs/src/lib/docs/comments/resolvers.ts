import { resolveReferenceHref } from '../resolveReferenceHref';

import type { InlineTagPart, FormatContext } from '../types';
import type { DocsEngine, DocNode, DocReference } from '@seedcord/docs-engine';

function listPackageCandidates(engine: DocsEngine, currentPackage: string): string[] {
    const ordered = new Set<string>();

    if (currentPackage) {
        ordered.add(currentPackage);
    }

    for (const pkgName of engine.listPackages()) {
        ordered.add(pkgName);
    }

    return Array.from(ordered);
}

function resolveNodeById(engine: DocsEngine, id: number, currentPackage: string): DocNode | null {
    for (const pkgName of listPackageCandidates(engine, currentPackage)) {
        const pkg = engine.getPackage(pkgName);
        const node = pkg?.nodes.get(id);
        if (node) {
            return node;
        }
    }

    return null;
}

export function resolveInlineHref(part: InlineTagPart, context: FormatContext): string | null {
    if (typeof part.target === 'number') {
        const node = resolveNodeById(context.engine, part.target, context.manifestPackage);
        if (node) {
            const reference: DocReference = {
                targetKey: node.key,
                name: node.name,
                packageName: node.packageName
            };

            return resolveReferenceHref(reference, {
                engine: context.engine,
                currentPackage: context.manifestPackage
            });
        }
    }

    if (typeof part.target === 'string') {
        const normalized = part.target.trim();
        if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
            return normalized;
        }
    }

    if (typeof part.url === 'string' && part.url.length > 0) {
        return part.url;
    }

    const rawLabel = typeof part.text === 'string' ? part.text : '';
    const trimmedLabel = rawLabel.trim();

    if (trimmedLabel) {
        const [candidate] = context.engine.search(trimmedLabel, context.manifestPackage);
        if (candidate) {
            const node =
                context.engine.getNodeByGlobalSlug(candidate.packageName, candidate.slug) ??
                context.engine.getNodeBySlug(candidate.packageName, candidate.slug);

            if (node) {
                const reference: DocReference = {
                    targetKey: node.key,
                    name: node.name,
                    packageName: node.packageName
                };

                return resolveReferenceHref(reference, {
                    engine: context.engine,
                    currentPackage: context.manifestPackage
                });
            }
        }
    }

    return null;
}
