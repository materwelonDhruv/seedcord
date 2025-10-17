import { cache } from 'react';

import { getDocsEngine } from './engine';
import { formatDisplayPackageName } from './packages';
import { buildEntityHref, buildPackageBasePath } from './routes';

import type { EntityTone } from '@lib/entity-metadata';
import type { DirectoryEntity } from '@seedcord/docs-engine';

export interface NavigationEntityItem {
    id: string;
    label: string;
    href: string;
}

export interface NavigationCategory {
    id: DirectoryEntity;
    title: string;
    tone: EntityTone;
    items: readonly NavigationEntityItem[];
}

export interface PackageVersionCatalog {
    id: string;
    label: string;
    summary: string;
    manifestVersion: string;
    basePath: string;
    categories: readonly NavigationCategory[];
}

export interface PackageCatalogEntry {
    id: string;
    manifestName: string;
    label: string;
    description: string;
    versions: readonly PackageVersionCatalog[];
}

export type DocsCatalog = readonly PackageCatalogEntry[];

interface CategoryConfig {
    readonly entity: DirectoryEntity;
    readonly title: string;
    readonly tone: EntityTone;
}

const CATEGORY_CONFIG: readonly CategoryConfig[] = [
    { entity: 'classes', title: 'Classes', tone: 'class' },
    { entity: 'interfaces', title: 'Interfaces', tone: 'interface' },
    { entity: 'functions', title: 'Functions', tone: 'function' },
    { entity: 'enums', title: 'Enums', tone: 'enum' },
    { entity: 'types', title: 'Types', tone: 'type' },
    { entity: 'variables', title: 'Variables', tone: 'variable' }
] as const;

const formatVersionLabel = (version: string): string => (version.startsWith('v') ? version : `v${version}`);

const createNavigationItem = (
    manifestPackage: string,
    version: string,
    slug: string,
    label: string,
    tone: EntityTone
): NavigationEntityItem => ({
    id: slug,
    label,
    href: buildEntityHref({ manifestPackage, version, slug, tone })
});

const buildCategories = (
    manifestPackage: string,
    version: string,
    directory: ReturnType<import('@seedcord/docs-engine').DocsEngine['getPackageDirectory']>
): NavigationCategory[] => {
    if (!directory) {
        return [];
    }

    return CATEGORY_CONFIG.flatMap(({ entity, tone, title }) => {
        const entries = Array.from(directory.entries(entity));
        if (!entries.length) {
            return [];
        }

        const items = entries
            .map(([slug, node]) => createNavigationItem(manifestPackage, version, slug, node.name, tone))
            .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        if (!items.length) {
            return [];
        }

        return [
            {
                id: entity,
                title,
                tone,
                items
            } satisfies NavigationCategory
        ];
    });
};

const buildPackageEntry = (
    manifestPackage: string,
    version: string,
    directory: ReturnType<import('@seedcord/docs-engine').DocsEngine['getPackageDirectory']>
): PackageCatalogEntry => {
    const displayName = formatDisplayPackageName(manifestPackage);
    const description = `Reference documentation for ${displayName}.`;
    const versionLabel = formatVersionLabel(version);
    const categories = buildCategories(manifestPackage, version, directory);

    const versionCatalog: PackageVersionCatalog = {
        id: version,
        label: versionLabel,
        summary: `${displayName} API (${versionLabel})`,
        manifestVersion: version,
        basePath: buildPackageBasePath(manifestPackage, version),
        categories
    };

    return {
        id: displayName,
        manifestName: manifestPackage,
        label: displayName,
        description,
        versions: [versionCatalog]
    } satisfies PackageCatalogEntry;
};

export const loadDocsCatalog = cache(async (): Promise<DocsCatalog> => {
    const engine = await getDocsEngine();
    const packages = engine.listPackages();

    return packages
        .map((manifestPackage) => {
            const pkg = engine.getPackage(manifestPackage);
            if (!pkg) {
                return null;
            }

            const version = pkg.manifest.version;
            const directory = engine.getPackageDirectory(manifestPackage);

            return buildPackageEntry(manifestPackage, version, directory);
        })
        .filter((entry): entry is PackageCatalogEntry => entry !== null)
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
});

export const findCatalogEntry = (catalog: DocsCatalog, packageId: string): PackageCatalogEntry | undefined =>
    catalog.find((entry) => entry.id === packageId);

export const findCatalogVersion = (entry: PackageCatalogEntry, versionId: string): PackageVersionCatalog | undefined =>
    entry.versions.find((version) => version.id === versionId);
