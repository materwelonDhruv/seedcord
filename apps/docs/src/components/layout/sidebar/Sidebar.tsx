'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { cn } from '@lib/utils';

import { SidebarCategoryList } from './SidebarCategoryList';
import { SidebarEmptyState } from './SidebarEmptyState';
import { SidebarHeader } from './SidebarHeader';
import { getContainerStyles } from './utils/getContainerStyles';
import { getListStyles } from './utils/getListStyles';
import { resolveRestSegments } from './utils/resolveRestSegments';
import { useSidebarNavigationHandlers } from './utils/useSidebarNavigationHandlers';
import { useSidebarScrollGuards } from './utils/useSidebarScrollGuards';
import { useSidebarSelection } from './utils/useSidebarSelection';

import type { SidebarProps } from './types';
import type { ReactElement } from 'react';

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
