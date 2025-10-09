import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@lib/entity-metadata';
import { log } from '@lib/logger';
import { cn } from '@lib/utils';
import useUIStore from '@store/ui';

import type { EntityTone } from '@lib/entity-metadata';
import type { KeyboardEvent, ReactElement } from 'react';

interface SidebarItemProps {
    label: string;
    tone: EntityTone;
}

export function SidebarItem({ label, tone }: SidebarItemProps): ReactElement {
    const togglePalette = useUIStore((state) => state.toggleCommandPalette);
    const ItemIcon = ENTITY_KIND_ICONS[tone];
    const toneStyles = ENTITY_TONE_STYLES[tone];

    const handleClick = (): void => {
        log('Sidebar item activated', { label, tone });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === 'Enter' && event.metaKey) {
            log('Sidebar shortcut requested search', { label });
            togglePalette();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
                'flex w-full items-center gap-2 rounded-lg border border-transparent bg-transparent px-3 py-2 text-left text-sm font-medium text-[var(--text)] transition focus-visible:outline-2 focus-visible:outline-offset-2',
                toneStyles.item
            )}
        >
            <span
                className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full border', toneStyles.badge)}
            >
                <ItemIcon size={14} strokeWidth={2} aria-hidden />
            </span>
            <span>{label}</span>
        </button>
    );
}

export default SidebarItem;
