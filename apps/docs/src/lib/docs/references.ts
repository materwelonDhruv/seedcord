import { kindName, type DocReference, type DocsEngine } from '@seedcord/docs-engine';

import { resolveEntityTone } from '@lib/entity-metadata';

import { resolveExternalPackageUrl } from './packages';
import { buildEntityHref } from './routes';

interface ResolveReferenceOptions {
    engine: DocsEngine;
    currentPackage: string;
}

function buildInternalHref(engine: DocsEngine, packageName: string, slug: string): string {
    const node = engine.getNodeByGlobalSlug(packageName, slug) ?? engine.getNodeBySlug(packageName, slug);
    const tone = node ? resolveEntityTone(kindName(node.kind)) : undefined;
    const symbolSlug = node?.slug ?? slug;
    const version = node?.packageVersion ?? engine.getPackage(packageName)?.manifest.version ?? null;

    return buildEntityHref({ manifestPackage: packageName, slug: symbolSlug, tone: tone ?? null, version });
}

export function resolveReferenceHref(
    reference: DocReference | null | undefined,
    options: ResolveReferenceOptions
): string | null {
    if (!reference) {
        return null;
    }

    const { engine, currentPackage } = options;

    if (reference.externalUrl) {
        return reference.externalUrl;
    }

    const resolved = engine.resolveReference(currentPackage, reference);

    if (resolved.externalUrl) {
        return resolved.externalUrl;
    }

    if (resolved.packageName && resolved.slug) {
        return buildInternalHref(engine, resolved.packageName, resolved.slug);
    }

    const packageName = reference.packageName ?? reference.name;
    const fallbackUrl = resolveExternalPackageUrl(packageName);
    if (fallbackUrl) {
        return fallbackUrl;
    }

    if (reference.qualifiedName) {
        const node = engine.getNodeByQualifiedName(currentPackage, reference.qualifiedName);
        if (node) {
            return buildInternalHref(engine, node.packageName, node.slug);
        }
    }

    return null;
}
