'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect, useRef } from 'react';

import { cn } from '@lib/utils';
import useUIStore from '@store/ui';

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

/* eslint-disable max-lines-per-function */

function useSidebarPersistence(
    localPackageId: string,
    localVersionId: string,
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
): {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    collapsedStorageKey: string;
    composedHandleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
} {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const collapsedStorageKey = `docs.sidebar.collapsed:${localPackageId}:${localVersionId}`;
    const scrollStorageKey = `docs.sidebar.scroll:${localPackageId}:${localVersionId}`;

    useEffect(() => {
        const ls = typeof window !== 'undefined' ? window.localStorage : null;
        const el = scrollRef.current;
        if (el && ls) {
            const saved = ls.getItem(scrollStorageKey);
            if (saved) {
                const n = Number(saved);
                if (!Number.isNaN(n)) el.scrollTop = n;
            }
        }
    }, [localPackageId, localVersionId, scrollStorageKey]);

    const composedHandleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
        handleScroll(e);
        const ls = typeof window !== 'undefined' ? window.localStorage : null;
        const el = scrollRef.current;
        if (el && ls) {
            ls.setItem(scrollStorageKey, String(el.scrollTop));
        }
    };

    return { scrollRef, collapsedStorageKey, composedHandleScroll };
}

export function Sidebar({
    catalog,
    activePackageId,
    activeVersionId,
    variant = 'desktop',
    className
}: SidebarProps): ReactElement {
    const pathname = usePathname() ?? '';
    const containerStyles = getContainerStyles(variant);
    const listStyles = getListStyles(variant);
    const { handleWheel, handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd } = useSidebarScrollGuards();

    const restSegments = useMemo(() => resolveRestSegments(pathname), [pathname]);
    const [localPackageId, setLocalPackageId] = useState<string>(activePackageId);
    const [localVersionId, setLocalVersionId] = useState<string>(activeVersionId);

    const { scrollRef, collapsedStorageKey, composedHandleScroll } = useSidebarPersistence(
        localPackageId,
        localVersionId,
        handleScroll
    );

    useEffect(() => setLocalPackageId(activePackageId), [activePackageId]);
    useEffect(() => setLocalVersionId(activeVersionId), [activeVersionId]);

    const { activePackage, activeVersion, packageOptions, versionOptions } = useSidebarSelection(
        catalog,
        localPackageId,
        localVersionId
    );

    const { handlePackageChange, handleVersionChange } = useSidebarNavigationHandlers(
        catalog,
        versionOptions,
        restSegments
    );

    const setSelectedPackage = useUIStore((s) => s.setSelectedPackage);
    const setSelectedVersion = useUIStore((s) => s.setSelectedVersion);

    const onPackageChange = (value: string): void => {
        try {
            setSelectedPackage(value);
        } catch {
            // ignore
        }

        setLocalPackageId(value);
        handlePackageChange(value);
    };

    const onVersionChange = (value: string): void => {
        try {
            setSelectedVersion(value);
        } catch {
            // ignore
        }

        setLocalVersionId(value);
        handleVersionChange(value);
    };

    if (!activePackage || !activeVersion) {
        return className ? <SidebarEmptyState className={className} /> : <SidebarEmptyState />;
    }

    const isDesktop = variant === 'desktop';

    return (
        <nav
            aria-label="Library navigation"
            className={cn(
                'flex h-full flex-col p-4',
                isDesktop
                    ? 'rounded-none border-0 bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-none'
                    : 'rounded-2xl border border-border bg-surface shadow-soft',
                className
            )}
            style={containerStyles}
        >
            <div className="shrink-0 space-y-3">
                <SidebarHeader
                    packageOptions={packageOptions}
                    versionOptions={versionOptions}
                    activePackage={activePackage}
                    activeVersion={activeVersion}
                    onPackageChange={onPackageChange}
                    onVersionChange={onVersionChange}
                />
            </div>
            <div
                ref={scrollRef}
                className="relative mt-4 flex-1 min-h-0 overflow-y-auto pe-1 [overscroll-behavior:contain]"
                style={listStyles}
                onWheel={handleWheel}
                onScroll={composedHandleScroll}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <SidebarCategoryList
                    categories={activeVersion.categories}
                    activeHref={pathname}
                    storageKey={collapsedStorageKey}
                />
            </div>
        </nav>
    );
}

export default Sidebar;
