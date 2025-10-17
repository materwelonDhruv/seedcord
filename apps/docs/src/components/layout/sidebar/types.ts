import type {
    DocsCatalog,
    NavigationCategory,
    NavigationEntityItem,
    PackageCatalogEntry,
    PackageVersionCatalog
} from '@lib/docs/catalog';
import type { EntityTone } from '@lib/EntityMetadata';

export type SidebarVariant = 'desktop' | 'mobile';

export type SidebarCatalog = DocsCatalog;

export interface SidebarProps {
    catalog: readonly PackageCatalogEntry[];
    activePackageId: string;
    activeVersionId: string;
    variant?: SidebarVariant;
    className?: string;
}

export interface SidebarCategoryListProps {
    categories: readonly NavigationCategory[];
    activeHref: string;
}

export interface SidebarItemProps {
    item: NavigationEntityItem;
    tone: EntityTone;
    isActive: boolean;
}

export type SidebarHeaderPackageOption = PackageCatalogEntry;
export type SidebarHeaderVersionOption = PackageVersionCatalog;
