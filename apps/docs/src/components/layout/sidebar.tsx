'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

import { cn } from '@lib/utils';

import { SidebarCategoryList } from './sidebar/sidebar-category-list';
import { SidebarHeader } from './sidebar/sidebar-header';

import type { SidebarProps, SidebarVariant } from './sidebar/types';
import type { PackageCatalogEntry, PackageVersionCatalog } from '@lib/docs/catalog';
import type { CSSProperties, ReactElement, TouchEvent, UIEvent, WheelEvent } from 'react';

const MOBILE_MAX_HEIGHT = 'min(70vh, 520px)';
const LINE_SCROLL_PIXELS = 16;
const ENTITY_SEGMENT_START_INDEX = 4;

function applyScrollDelta(viewport: HTMLDivElement, deltaY: number): void {
    const { scrollHeight, clientHeight, scrollTop } = viewport;
    const maxScrollTop = Math.max(scrollHeight - clientHeight, 0);

    if (maxScrollTop === 0) {
        return;
    }

    const nextScrollTop = Math.min(Math.max(scrollTop + deltaY, 0), maxScrollTop);

    if (nextScrollTop !== scrollTop) {
        viewport.scrollTop = nextScrollTop;
    }
}

function normalizeWheelDelta(event: WheelEvent<HTMLDivElement>, viewport: HTMLDivElement): number {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return event.deltaY * LINE_SCROLL_PIXELS;
    }

    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return event.deltaY * viewport.clientHeight;
    }

    return event.deltaY;
}

function getContainerStyles(variant: SidebarVariant | undefined): CSSProperties | undefined {
    if (variant === 'mobile') {
        return {
            maxHeight: MOBILE_MAX_HEIGHT
        } satisfies CSSProperties;
    }

    return {
        height: '100%',
        maxHeight: '100%'
    } satisfies CSSProperties;
}

function getListStyles(variant: SidebarVariant | undefined): CSSProperties | undefined {
    if (variant === 'desktop') {
        return {
            height: '100%',
            maxHeight: '100%',
            WebkitOverflowScrolling: 'touch'
        } satisfies CSSProperties;
    }

    return {
        maxHeight: MOBILE_MAX_HEIGHT,
        WebkitOverflowScrolling: 'touch'
    } satisfies CSSProperties;
}

function useSidebarScrollGuards(): {
    handleWheel: (event: WheelEvent<HTMLDivElement>) => void;
    handleScroll: (event: UIEvent<HTMLDivElement>) => void;
    handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
    handleTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
    handleTouchEnd: () => void;
} {
    const lastTouchYRef = useRef<number | null>(null);

    const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        event.stopPropagation();

        const viewport = event.currentTarget;

        if (viewport.scrollHeight <= viewport.clientHeight) {
            return;
        }

        const normalizedDeltaY = normalizeWheelDelta(event, viewport);

        applyScrollDelta(viewport, normalizedDeltaY);
    }, []);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        lastTouchYRef.current = touch.clientY;
    }, []);

    const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();

        const viewport = event.currentTarget;

        if (viewport.scrollHeight <= viewport.clientHeight) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const previousY = lastTouchYRef.current;

        if (previousY === null) {
            lastTouchYRef.current = touch.clientY;
            return;
        }

        const deltaY = previousY - touch.clientY;

        if (deltaY !== 0) {
            applyScrollDelta(viewport, deltaY);
        }

        lastTouchYRef.current = touch.clientY;
    }, []);

    const handleTouchEnd = useCallback(() => {
        lastTouchYRef.current = null;
    }, []);

    return {
        handleWheel,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
}

const resolveRestSegments = (pathname: string): string[] => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length < ENTITY_SEGMENT_START_INDEX) {
        return [];
    }

    return segments.slice(ENTITY_SEGMENT_START_INDEX);
};

const buildVersionPath = (version: PackageVersionCatalog, restSegments: readonly string[]): string => {
    if (!restSegments.length) {
        return version.basePath;
    }

    return `${version.basePath}/${restSegments.join('/')}`;
};

const useSidebarSelection = (
    catalog: readonly PackageCatalogEntry[],
    activePackageId: string,
    activeVersionId: string
): {
    activePackage: PackageCatalogEntry | null;
    activeVersion: PackageVersionCatalog | null;
    packageOptions: readonly PackageCatalogEntry[];
    versionOptions: readonly PackageVersionCatalog[];
} => {
    const activePackage = useMemo(() => {
        if (!catalog.length) {
            return null;
        }

        return catalog.find((entry) => entry.id === activePackageId) ?? catalog[0] ?? null;
    }, [catalog, activePackageId]);

    const activeVersion = useMemo(() => {
        if (!activePackage) {
            return null;
        }

        return (
            activePackage.versions.find((version) => version.id === activeVersionId) ??
            activePackage.versions[0] ??
            null
        );
    }, [activePackage, activeVersionId]);

    return {
        activePackage,
        activeVersion,
        packageOptions: catalog,
        versionOptions: activePackage?.versions ?? []
    };
};

const useSidebarNavigationHandlers = (
    catalog: readonly PackageCatalogEntry[],
    versionOptions: readonly PackageVersionCatalog[],
    restSegments: readonly string[]
): {
    handlePackageChange: (value: string) => void;
    handleVersionChange: (value: string) => void;
} => {
    const router = useRouter();
    const handlePackageChange = useCallback(
        (value: string) => {
            const targetPackage = catalog.find((entry) => entry.id === value);
            if (!targetPackage) {
                return;
            }

            const targetVersion = targetPackage.versions[0];
            if (!targetVersion) {
                return;
            }

            router.push(targetVersion.basePath);
        },
        [catalog, router]
    );

    const handleVersionChange = useCallback(
        (value: string) => {
            const targetVersion = versionOptions.find((version) => version.id === value) ?? versionOptions[0];
            if (!targetVersion) {
                return;
            }

            router.push(buildVersionPath(targetVersion, restSegments));
        },
        [restSegments, router, versionOptions]
    );

    return {
        handlePackageChange,
        handleVersionChange
    };
};

function SidebarEmptyState({ className }: { className?: string }): ReactElement {
    return (
        <nav
            aria-label="Library navigation"
            className={cn(
                'flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft',
                className
            )}
        >
            <p className="text-sm text-subtle">No packages available.</p>
        </nav>
    );
}

export function Sidebar({
    catalog,
    activePackageId,
    activeVersionId,
    variant = 'desktop',
    className
}: SidebarProps): ReactElement {
    const pathname = usePathname();
    const containerStyles = getContainerStyles(variant);
    const listStyles = getListStyles(variant);
    const { handleWheel, handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd } = useSidebarScrollGuards();

    const restSegments = useMemo(() => resolveRestSegments(pathname), [pathname]);
    const { activePackage, activeVersion, packageOptions, versionOptions } = useSidebarSelection(
        catalog,
        activePackageId,
        activeVersionId
    );
    const { handlePackageChange, handleVersionChange } = useSidebarNavigationHandlers(
        catalog,
        versionOptions,
        restSegments
    );

    if (!activePackage || !activeVersion) {
        return className ? <SidebarEmptyState className={className} /> : <SidebarEmptyState />;
    }

    const isDesktop = variant === 'desktop';
    const navClassName = cn(
        'flex h-full flex-col p-4',
        isDesktop
            ? 'rounded-none border-0 bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-none'
            : 'rounded-2xl border border-border bg-surface shadow-soft',
        className
    );

    return (
        <nav aria-label="Library navigation" className={navClassName} style={containerStyles}>
            <div className="shrink-0 space-y-3">
                <SidebarHeader
                    packageOptions={packageOptions}
                    versionOptions={versionOptions}
                    activePackage={activePackage}
                    activeVersion={activeVersion}
                    onPackageChange={handlePackageChange}
                    onVersionChange={handleVersionChange}
                />
            </div>
            <div
                className="relative mt-4 flex-1 min-h-0 overflow-y-auto pe-1 [overscroll-behavior:contain]"
                style={listStyles}
                onWheel={handleWheel}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <SidebarCategoryList categories={activeVersion.categories} activeHref={pathname} />
            </div>
        </nav>
    );
}

export default Sidebar;
