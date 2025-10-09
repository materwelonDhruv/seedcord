'use client';

import { Command, MonitorSmartphone, MoonStar, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import Button from '@components/ui/button';
import { Icon } from '@components/ui/icon';
import { log } from '@lib/logger';
import { useUIStore } from '@store/ui';

import type { ReactElement } from 'react';

function ThemeToggle(): ReactElement {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = (): void => {
        const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        log('Theme toggle activated', { from: resolvedTheme, to: nextTheme });
    };

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                title="Toggle theme"
                className="text-[var(--text)]"
                disabled
            >
                <Icon icon={MonitorSmartphone} size={18} />
            </Button>
        );
    }

    const icon = resolvedTheme === 'dark' ? <Icon icon={Sun} size={18} /> : <Icon icon={MoonStar} size={18} />;
    const label = resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            aria-label={label}
            title={label}
            className="text-[var(--text)]"
        >
            {icon}
        </Button>
    );
}

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
            className="group hidden w-full max-w-[280px] items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--border)_88%,var(--accent-a)_12%)] bg-[color-mix(in_srgb,var(--surface)_90%,#ffffff_6%)] px-3 py-2 text-sm text-[var(--text)] shadow-soft transition hover:border-[color-mix(in_srgb,var(--accent-a)_38%,var(--border))] hover:bg-[color-mix(in_srgb,var(--surface)_86%,var(--accent-a)_10%)] focus:border-[color-mix(in_srgb,var(--accent-a)_55%,var(--border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-a)_52%,transparent)] focus:ring-offset-2 focus:ring-offset-[color-mix(in_srgb,var(--surface)_94%,transparent)] sm:flex"
            onClick={handleClick}
            aria-label="Search documentation"
        >
            <span className="flex items-center gap-2 text-subtle transition group-hover:text-[var(--text)] group-focus:text-[var(--text)]">
                <Icon icon={Search} size={16} />
                <span>Search docs</span>
            </span>
            <div className="flex items-center gap-2 text-[0.65rem] text-subtle">
                <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] px-2 py-1 font-semibold uppercase tracking-wide">
                    <Icon icon={Command} size={11} />
                    <span className="text-[0.7rem] leading-none">K</span>
                </kbd>
            </div>
        </Button>
    );
}

function MobileSearchButton(): ReactElement {
    const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

    return (
        <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-[var(--text)]"
            onClick={() => {
                log('Mobile search button clicked');
                setCommandPaletteOpen(true);
            }}
            aria-label="Open command palette"
        >
            <Icon icon={Search} size={16} />
        </Button>
    );
}

export function HeaderSearchControls(): ReactElement {
    return (
        <div className="flex items-center gap-2">
            <DesktopSearchButton />
            <MobileSearchButton />
            <ThemeToggle />
        </div>
    );
}
