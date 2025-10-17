'use client';

import Link from 'next/link';

import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@/lib/entityMetadata';

import { log } from '@lib/logger';
import { cn } from '@lib/utils';

import type { SidebarItemProps } from './types';
import type { ReactElement } from 'react';

export function SidebarItem({ item, tone, isActive }: SidebarItemProps): ReactElement {
    const ItemIcon = ENTITY_KIND_ICONS[tone];
    const toneStyles = ENTITY_TONE_STYLES[tone];
    const { label, href } = item;

    return (
        <Link
            href={href}
            className={cn(
                'flex w-full items-center gap-2 rounded-lg border border-transparent bg-transparent px-3 py-2 text-left text-sm font-medium text-[var(--text)] transition focus-visible:outline-2 focus-visible:outline-offset-2',
                toneStyles.item,
                isActive
                    ? 'border-[color-mix(in_srgb,var(--accent-b)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent-b)_14%,var(--bg)_86%)]'
                    : null
            )}
            onClick={() => {
                log('Sidebar item activated', { label, tone, href });
            }}
        >
            <span
                className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full border', toneStyles.badge)}
            >
                <ItemIcon size={14} strokeWidth={2} aria-hidden />
            </span>
            <span>{label}</span>
        </Link>
    );
}

export default SidebarItem;
