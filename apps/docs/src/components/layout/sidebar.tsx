'use client';

import { useCallback, useRef } from 'react';

import { cn } from '@lib/utils';

import { SidebarCategoryList } from './sidebar/sidebar-category-list';
import { SidebarHeader } from './sidebar/sidebar-header';
import { useCatalogSelection } from './sidebar/use-catalog-selection';

import type { SidebarProps } from './sidebar/types';
import type { CSSProperties, ReactElement, TouchEvent, UIEvent, WheelEvent } from 'react';

const MOBILE_MAX_HEIGHT = 'min(70vh, 520px)';
const LINE_SCROLL_PIXELS = 16;

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

function getContainerStyles(variant: 'desktop' | 'mobile'): CSSProperties | undefined {
    if (variant === 'mobile') {
        return {
            maxHeight: MOBILE_MAX_HEIGHT
        };
    }

    return {
        height: '100%',
        maxHeight: '100%'
    };
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
        event.preventDefault();
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
        event.preventDefault();
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

export function Sidebar({ variant = 'desktop', className }: SidebarProps): ReactElement {
    const selection = useCatalogSelection();
    const containerStyles = getContainerStyles(variant);
    const isDesktop = variant === 'desktop';
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
    const { handleWheel, handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd } = useSidebarScrollGuards();

    if (!selection) {
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

    const { packageOptions, versionOptions, activePackage, activeVersion, onPackageChange, onVersionChange } =
        selection;

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
                className="relative mt-4 flex-1 min-h-0 overflow-y-auto pe-1 [overscroll-behavior:contain]"
                style={listStyles}
                onWheel={handleWheel}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <SidebarCategoryList categories={activeVersion.categories} />
            </div>
        </nav>
    );
}
export default Sidebar;
