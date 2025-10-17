'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { log } from '@lib/logger';
import useUIStore from '@store/ui';
import Button from '@ui/button';
import Icon from '@ui/icon';

import { FOCUS_DELAY_MS } from './command-palette/constants';

import type { UIStore } from '@store/ui';
import type { LucideIcon } from 'lucide-react';
import type { KeyboardEvent, ReactElement, RefObject } from 'react';

export type SearchResultKind =
    | 'package'
    | 'page'
    | 'resource'
    | 'class'
    | 'interface'
    | 'type'
    | 'enum'
    | 'function'
    | 'method'
    | 'property'
    | 'variable'
    | 'parameter'
    | 'typeParameter';

interface CommandAction {
    id: string;
    label: string;
    path: string;
    href: string;
    kind: SearchResultKind;
    description?: string;
    isExternal?: boolean;
}

export interface CommandGroupModel {
    heading: string;
    actions: CommandAction[];
    icon: LucideIcon;
}

interface CommandHeaderProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onValueChange: (value: string) => void;
    searchValue: string;
}

function CommandHeader({ inputRef, onClose, onValueChange, searchValue }: CommandHeaderProps): ReactElement {
    return (
        <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-3 py-2 transition focus-within:border-[color-mix(in_srgb,var(--accent-a)_40%,var(--border))] focus-within:bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]">
                <Icon icon={Search} size={18} className="text-subtle" aria-hidden />
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
                    className="text-subtle transition hover:text-[var(--text)]"
                >
                    <Icon icon={X} size={18} aria-hidden />
                </Button>
            </div>
        </div>
    );
}

interface CommandPaletteController {
    open: boolean;
    mounted: boolean;
    searchValue: string;
    inputRef: RefObject<HTMLInputElement | null>;
    handleOpenChange: (open: boolean) => void;
    handleValueChange: (value: string) => void;
    handleClose: () => void;
    handleSelect: (action: CommandAction) => void;
    handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

function useCommandPaletteController(): CommandPaletteController {
    const { open, setCommandPaletteOpen } = useUIStore(
        useShallow((state: UIStore) => ({
            open: state.isCommandPaletteOpen,
            setCommandPaletteOpen: state.setCommandPaletteOpen
        }))
    );
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) {
            return undefined;
        }

        if (open) {
            setSearchValue('');
            const timeout = window.setTimeout(() => {
                inputRef.current?.focus();
            }, FOCUS_DELAY_MS);
            log('Command palette opened', { fromPath: pathname });
            return () => window.clearTimeout(timeout);
        }

        log('Command palette closed');
        return undefined;
    }, [mounted, open, pathname]);

    const handleClose = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

    const handleSelect = useCallback(
        (action: CommandAction): void => {
            log('Command palette item selected', action);
            handleClose();

            if (action.isExternal) {
                window.open(action.href, '_blank', 'noopener');
                return;
            }

            router.push(action.href);
        },
        [handleClose, router]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        },
        [handleClose]
    );

    return {
        open,
        mounted,
        searchValue,
        inputRef,
        handleOpenChange: setCommandPaletteOpen,
        handleValueChange: setSearchValue,
        handleClose,
        handleSelect,
        handleKeyDown
    };
}

function CommandPaletteDialog({ controller }: { controller: CommandPaletteController }): ReactElement {
    const { open, handleOpenChange, searchValue, handleValueChange, handleClose, handleKeyDown, inputRef } = controller;

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    data-command-overlay
                    className="fixed inset-0 bg-[color-mix(in_srgb,var(--bg)_55%,#070917_45%)]/70 backdrop-blur-sm"
                />
                <Dialog.Content
                    data-command-content
                    className="fixed inset-0 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12 lg:py-16"
                >
                    <Command
                        className="max-h-[calc(100vh-6rem)] w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-[var(--bg)] text-[var(--text)] shadow-soft transition sm:max-w-2xl sm:rounded-3xl md:max-w-3xl md:-translate-y-8 lg:-translate-y-12"
                        label="Documentation search"
                        onKeyDown={handleKeyDown}
                    >
                        <Dialog.Title className="sr-only">Command palette</Dialog.Title>
                        <Dialog.Description className="sr-only">
                            Search documentation content and navigation items.
                        </Dialog.Description>
                        <CommandHeader
                            inputRef={inputRef}
                            onClose={handleClose}
                            onValueChange={handleValueChange}
                            searchValue={searchValue}
                        />
                        <Command.List className="max-h-[calc(100vh-14rem)] overflow-y-auto pb-3">
                            <Command.Empty className="px-4 py-8 text-center text-sm text-subtle">
                                No matches yet. Results will populate once the TypeDoc index is wired up.
                            </Command.Empty>
                        </Command.List>
                    </Command>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function CommandPalette(): ReactElement | null {
    const controller = useCommandPaletteController();

    if (!controller.mounted) {
        return null;
    }

    return <CommandPaletteDialog controller={controller} />;
}

export default CommandPalette;
