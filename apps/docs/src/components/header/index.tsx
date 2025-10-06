'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Github } from 'lucide-react';
import Link from 'next/link';

import Button from '@components/ui/button';
import { Icon } from '@components/ui/icon';

import { HeaderSearchControls } from './search-controls';
import SeedcordMark from './seedcord-mark';

import type { ReactElement } from 'react';

export function Header(): ReactElement {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--bg)_97%,#ffffff_3%)] backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center rounded-2xl border border-transparent px-3 py-1.5 text-[var(--text)] transition hover:border-[color-mix(in_srgb,var(--border)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg)_92%,#ffffff_8%)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-a)_45%,transparent)] focus-visible:outline-offset-2"
                        aria-label="Seedcord home"
                    >
                        <SeedcordMark textClassName="transition group-hover:text-[color-mix(in_srgb,var(--text)_88%,#4b5563_12%)]" />
                    </Link>
                    <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary navigation">
                        <Link
                            href="/docs"
                            className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-1.5 text-sm font-semibold text-subtle transition hover:border-[color-mix(in_srgb,var(--accent-a)_40%,var(--border))] hover:bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent-a)_6%)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-a)_42%,transparent)] focus-visible:outline-offset-2"
                        >
                            Docs home
                        </Link>
                    </nav>
                </div>
                <Tooltip.Provider delayDuration={150}>
                    <div className="flex items-center gap-2">
                        <HeaderSearchControls />
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Open GitHub repository"
                                    className="text-[var(--text)]"
                                >
                                    <Link
                                        href="https://github.com/materwelondhruv/seedcord"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Icon icon={Github} size={20} />
                                    </Link>
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content
                                sideOffset={6}
                                className="rounded-md bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)] shadow-soft"
                            >
                                View repository
                                <Tooltip.Arrow className="fill-[var(--surface)]" />
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </div>
                </Tooltip.Provider>
            </div>
        </header>
    );
}

export default Header;
