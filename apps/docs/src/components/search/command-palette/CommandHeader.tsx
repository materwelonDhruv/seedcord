'use client';

import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';

import Button from '@ui/Button';
import { Icon } from '@ui/Icon';

import type { ReactElement, RefObject } from 'react';

interface CommandHeaderProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onValueChange: (value: string) => void;
    searchValue: string;
}

export function CommandHeader({ inputRef, onClose, onValueChange, searchValue }: CommandHeaderProps): ReactElement {
    return (
        <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 transition focus-within:border-[color-mix(in_srgb,var(--accent-b)_35%,var(--border))] focus-within:bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent-b)_4%)]">
                <Icon icon={Search} size={16} className="text-subtle" aria-hidden />
                <Command.Input
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={onValueChange}
                    placeholder="Search packages, symbols, members, and resources"
                    className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-subtle focus:outline-none focus-visible:outline-none"
                    aria-label="Search documentation"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close command palette"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-subtle transition hover:text-[var(--text)] sm:hidden"
                >
                    <Icon icon={X} size={16} aria-hidden />
                </Button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close command palette"
                    className="hidden items-center gap-1 rounded-md border border-border/70 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-subtle transition hover:text-[var(--text)] sm:inline-flex"
                >
                    Esc
                </button>
            </div>
        </div>
    );
}
