'use client';

import { useCallback } from 'react';

import { cn } from '@lib/utils';

import { SidebarCategoryList } from './sidebar/sidebar-category-list';
import { SidebarHeader } from './sidebar/sidebar-header';
import { useCatalogSelection } from './sidebar/use-catalog-selection';

import type { SidebarProps } from './sidebar/types';
import type { CSSProperties, ReactElement, TouchEvent, UIEvent, WheelEvent } from 'react';

const DESKTOP_CONTAINER_HEIGHT = 'calc(100vh - 3rem)';
const MOBILE_MAX_HEIGHT = 'min(70vh, 520px)';
const SCROLL_EDGE_THRESHOLD = 1;

function getContainerStyles(variant: 'desktop' | 'mobile'): CSSProperties | undefined {
    if (variant === 'desktop') {
        return {
            height: DESKTOP_CONTAINER_HEIGHT,
            maxHeight: DESKTOP_CONTAINER_HEIGHT
        };
    }

    return {
        maxHeight: MOBILE_MAX_HEIGHT
    };
}

export function Sidebar({ variant = 'desktop', className }: SidebarProps): ReactElement {
    const selection = useCatalogSelection();
    const containerStyles = getContainerStyles(variant);
    const listStyles: CSSProperties | undefined =
        variant === 'desktop'
            ? {
                  height: '100%',
                  maxHeight: '100%',
                  WebkitOverflowScrolling: 'touch'
              }
            : {
                  maxHeight: MOBILE_MAX_HEIGHT,
                  WebkitOverflowScrolling: 'touch'
              };

    if (!selection) {
        return (
            <nav
                aria-label="Library navigation"
                className={cn('rounded-2xl border border-border bg-surface p-4 shadow-soft', className)}
            >
                <p className="text-sm text-subtle">No packages available.</p>
            </nav>
        );
    }

    const { packageOptions, versionOptions, activePackage, activeVersion, onPackageChange, onVersionChange } =
        selection;
    const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const viewport = event.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const isScrollable = scrollHeight - clientHeight > SCROLL_EDGE_THRESHOLD;
        const isScrollingUp = event.deltaY < 0;
        const isScrollingDown = event.deltaY > 0;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_EDGE_THRESHOLD;

        if (!isScrollable || (isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
            event.preventDefault();
        }
    }, []);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    return (
        <nav
            aria-label="Library navigation"
            className={cn(
                'flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft',
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
                className="relative mt-4 flex-1 min-h-0 overflow-y-auto pe-1 [overscroll-behavior:contain]"
                style={listStyles}
                onWheel={handleWheel}
                onScroll={handleScroll}
                onTouchMove={handleTouchMove}
            >
                <SidebarCategoryList categories={activeVersion.categories} />
            </div>
        </nav>
    );
}
export default Sidebar;
