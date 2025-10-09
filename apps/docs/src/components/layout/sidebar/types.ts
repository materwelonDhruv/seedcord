import type { EntityTone } from '../../../lib/entity-metadata';

export interface SidebarVariantData {
    title: string;
    tone: EntityTone;
    items: readonly string[];
}

export interface PackageVersion {
    id: string;
    label: string;
    summary: string;
    categories: readonly SidebarVariantData[];
}

export interface PackageCatalogEntry {
    id: string;
    label: string;
    description: string;
    versions: readonly PackageVersion[];
}

export type SidebarVariant = 'desktop' | 'mobile';

export interface SidebarProps {
    variant?: SidebarVariant;
    className?: string;
}

export interface CatalogSelection {
    packageOptions: readonly PackageCatalogEntry[];
    versionOptions: readonly PackageVersion[];
    activePackage: PackageCatalogEntry;
    activeVersion: PackageVersion;
    onPackageChange: (value: string) => void;
    onVersionChange: (value: string) => void;
}
