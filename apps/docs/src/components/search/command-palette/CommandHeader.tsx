'use client';

import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';

import Button from '@ui/Button';
import Icon from '@ui/Icon';

import type { ReactElement, RefObject } from 'react';

interface CommandHeaderProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onValueChange: (value: string) => void;
    searchValue: string;
}

function CommandHeader({ inputRef, onClose, onValueChange, searchValue }: CommandHeaderProps): ReactElement {
    return (
        <div className="border-b border-border px-4 py-3">
            <div
                className="
                    flex items-center gap-2 rounded-lg
                    border border-(--border)/80
                    bg-(--surface-muted)
                    px-3 py-2 transition
                    focus-within:border-[color-mix(in_oklab,var(--accent-b)_35%,var(--border))]
                    focus-within:bg-[color-mix(in_oklab,var(--surface)_96%,var(--accent-b)_4%)]
                "
            >
                <Icon icon={Search} size={16} className="text-subtle" aria-hidden />

                <Command.Input
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={onValueChange}
                    placeholder="Search entities or their members"
                    aria-label="Search documentation"
                    className="
                      flex-1 bg-transparent text-sm text-(--text) placeholder:text-subtle
                      outline-none focus:outline-none
                    "
                />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close command palette"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-subtle transition hover:text-(--text) sm:hidden"
                >
                    <Icon icon={X} size={16} aria-hidden />
                </Button>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close command palette"
                    className="
                        hidden sm:inline-flex items-center gap-1
                        rounded-md border border-(--border)/70
                        bg-(--surface-muted) px-2 py-1
                        text-[0.7rem] font-semibold uppercase tracking-wide
                        text-subtle transition
                        hover:text-[color-mix(in_oklab,var(--text)_85%,transparent)]
                        hover:border-[color-mix(in_oklab,var(--accent-b)_35%,var(--border))]
                        hover:bg-[color-mix(in_oklab,var(--surface)_96%,var(--accent-b)_6%)]
                    "
                >
                    Esc
                </button>
            </div>
        </div>
    );
}

export default CommandHeader;
