import Link from 'next/link';
import { notFound } from 'next/navigation';

import EntityContent from '@components/docs/entity/entity-content';
import { findCatalogEntry, findCatalogVersion, loadDocsCatalog } from '@lib/docs/catalog';
import { loadEntityModel } from '@lib/docs/entity-loader';
import { parseEntityPathSegments } from '@lib/docs/routes';
import { ENTITY_TONE_STYLES } from '@lib/entity-metadata';

import type { NavigationCategory, PackageCatalogEntry, PackageVersionCatalog } from '@lib/docs/catalog';
import type { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

type PageParams = Record<string, string | string[] | undefined>;

const decodeParam = (value: string | string[] | undefined): string => {
    if (!value) return '';
    const raw = Array.isArray(value) ? value[0] : value;
    const safe = raw ?? '';
    try {
        return decodeURIComponent(safe);
    } catch {
        return safe;
    }
};

const getCatalogContext = async (
    params: PageParams
): Promise<{ entry: PackageCatalogEntry; version: PackageVersionCatalog }> => {
    const catalog = await loadDocsCatalog();
    const decodedPackageId = decodeParam(params.packageId);

    if (!decodedPackageId) notFound();

    const entry = findCatalogEntry(catalog, decodedPackageId);
    if (!entry) notFound();

    const decodedVersionId = decodeParam(params.versionId);
    const versionCandidate = decodedVersionId ? findCatalogVersion(entry, decodedVersionId) : null;
    const version = versionCandidate ?? entry.versions[0] ?? null;
    if (!version) notFound();

    return { entry, version };
};

const renderCategory = (category: NavigationCategory): ReactElement => {
    const toneStyles = ENTITY_TONE_STYLES[category.tone];

    return (
        <div key={category.id} className="space-y-3">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-subtle">{category.title}</span>
                    <span className="text-xs text-[color-mix(in_srgb,var(--text)_65%,var(--accent-b)_35%)]">
                        {category.items.length} item{category.items.length === 1 ? '' : 's'}
                    </span>
                </div>
            </header>
            <ul className="space-y-2">
                {category.items.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={item.href}
                            className="flex items-center justify-between rounded-xl border border-transparent bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-2 text-sm font-medium text-[var(--text)] shadow-soft transition hover:border-[color-mix(in_srgb,var(--accent-b)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--surface)_88%,var(--accent-b)_12%)] focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <span>{item.label}</span>
                            <span
                                className={`${toneStyles.badge} inline-flex h-6 min-w-[2.25rem] items-center justify-center rounded-full border text-xs font-semibold px-2 py-1`}
                            >
                                {category.tone}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function PackageVersionOverview({
    entry,
    version
}: {
    entry: PackageCatalogEntry;
    version: PackageVersionCatalog;
}): ReactElement {
    return (
        <section className="space-y-8">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtle">Reference overview</p>
                <h1 className="text-3xl font-semibold text-[var(--text)] sm:text-4xl">
                    {entry.label} · {version.label}
                </h1>
            </header>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {version.categories.length ? (
                    version.categories.map(renderCategory)
                ) : (
                    <p className="text-sm text-subtle">No reference entries are available for this version yet.</p>
                )}
            </div>
        </section>
    );
}

export default async function PackageEntityPage({ params }: { params: Promise<PageParams> }): Promise<ReactElement> {
    const resolvedParams = await params;
    const { entry, version } = await getCatalogContext(resolvedParams);

    const rawSegments = resolvedParams.entitySegments;
    const normalizedSegments: string[] | undefined = (() => {
        if (Array.isArray(rawSegments)) return rawSegments;
        if (typeof rawSegments === 'string') return [rawSegments];
        return undefined;
    })();

    if (!normalizedSegments || normalizedSegments.length === 0) {
        return <PackageVersionOverview entry={entry} version={version} />;
    }

    const parsedSegments = parseEntityPathSegments(normalizedSegments);

    if (!parsedSegments.slug) {
        notFound();
    }

    const entity = await loadEntityModel({
        manifestPackage: entry.manifestName,
        slug: parsedSegments.slug,
        ...(parsedSegments.tone ? { kind: parsedSegments.tone } : {})
    });

    if (!entity) {
        notFound();
    }

    return <EntityContent model={entity} />;
}
