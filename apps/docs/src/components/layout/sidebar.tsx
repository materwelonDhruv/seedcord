'use client';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useCallback } from 'react';

import { cn } from '@lib/utils';

import { SidebarCategoryList } from './sidebar/sidebar-category-list';
import { SidebarHeader } from './sidebar/sidebar-header';
import { useCatalogSelection } from './sidebar/use-catalog-selection';

import type { SidebarProps } from './sidebar/types';
import type { CSSProperties, ReactElement, WheelEvent } from 'react';

const DESKTOP_CONTAINER_HEIGHT = 'calc(100vh - 8rem)';
const MOBILE_MAX_HEIGHT = 'min(70vh, 520px)';

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
    const scrollAreaStyles: CSSProperties | undefined =
        variant === 'desktop'
            ? {
                  height: '100%',
                  maxHeight: '100%'
              }
            : {
                  maxHeight: MOBILE_MAX_HEIGHT
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
    const handleViewportWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        const viewport = event.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const isScrollable = scrollHeight > clientHeight;
        const isScrollingUp = event.deltaY < 0;
        const isScrollingDown = event.deltaY > 0;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (!isScrollable || (isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
            event.preventDefault();
            event.stopPropagation();
        }
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
            <ScrollArea.Root
                className="relative mt-4 flex-1 min-h-0 overflow-hidden"
                style={scrollAreaStyles}
                type="hover"
            >
                <ScrollArea.Viewport
                    className="h-full w-full pr-2 overscroll-contain"
                    onWheelCapture={handleViewportWheel}
                >
                    <SidebarCategoryList categories={activeVersion.categories} />
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                    orientation="vertical"
                    className="flex w-2 touch-none select-none transition-opacity data-[state=hidden]:opacity-0"
                >
                    <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[color-mix(in_srgb,var(--border)_86%,var(--accent-b)_14%)]" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="bg-transparent" />
            </ScrollArea.Root>
        </nav>
    );
}
export default Sidebar;
