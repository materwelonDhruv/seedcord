'use client';

import { Search, Command } from 'lucide-react';

import { log } from '@lib/logger';
import useUIStore from '@store/ui';
import Button from '@ui/Button';
import Icon from '@ui/Icon';

import type { ReactElement } from 'react';

function DesktopSearchButton(): ReactElement {
    const open = useUIStore((state) => state.isCommandPaletteOpen);
    const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

    const handleClick = (): void => {
        log('Search button clicked');
        setCommandPaletteOpen(!open);
    };

    return (
        <Button
            variant="ghost"
            className="group w-full max-w-[280px] items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--border)_88%,var(--accent-a)_12%)] bg-[color-mix(in_oklab,var(--surface)_90%,#ffffff_6%)] px-3 py-2 text-sm text-(--text) shadow-soft transition hover:border-[color-mix(in_oklab,var(--accent-a)_38%,var(--border))] hover:bg-[color-mix(in_oklab,var(--surface)_86%,var(--accent-a)_10%)] focus:border-[color-mix(in_oklab,var(--accent-a)_55%,var(--border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-a)_52%,transparent)] focus:ring-offset-2 focus:ring-offset-[color-mix(in_oklab,var(--surface)_94%,transparent)]"
            onClick={handleClick}
            aria-label="Search documentation"
        >
            <span className="flex items-center gap-2 text-subtle transition group-hover:text-(--text) group-focus:text-(--text)">
                <Icon icon={Search} size={16} />
                <span>Search docs</span>
            </span>
            <div className="flex items-center gap-2 text-[0.65rem] text-subtle">
                <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-95 px-2 py-1 font-semibold uppercase tracking-wide">
                    <Icon icon={Command} size={11} />
                    <span className="text-[0.7rem] leading-none">K</span>
                </kbd>
            </div>
        </Button>
    );
}

export default DesktopSearchButton;
