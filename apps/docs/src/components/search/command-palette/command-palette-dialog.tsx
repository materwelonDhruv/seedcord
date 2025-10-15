'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { useRef } from 'react';

import { CommandHeader } from './command-header';
import { DEFAULT_COMMAND_ACTIONS } from './constants';
import { CommandListItem } from './list-item';

import type { CommandPaletteController } from './use-command-palette-controller';
import type { ReactElement } from 'react';

const MIN_QUERY_LENGTH = 3;

export function CommandPaletteDialog({ controller }: { controller: CommandPaletteController }): ReactElement {
    const {
        open,
        handleOpenChange,
        searchValue,
        handleValueChange,
        handleClose,
        handleSelect,
        handleKeyDown,
        inputRef
    } = controller;

    const commandRef = useRef<HTMLDivElement | null>(null);

    const normalizedSearch = searchValue.trim();
    const canShowResults = normalizedSearch.length >= MIN_QUERY_LENGTH;

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    data-command-overlay
                    className="fixed inset-0 bg-[color-mix(in_srgb,var(--bg)_55%,#070917_45%)]/70 backdrop-blur-sm"
                />
                <Dialog.Content
                    data-command-content
                    className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-20 pb-8 sm:px-6 sm:pt-24 md:pt-28 md:pb-12 lg:pt-32 lg:pb-16"
                    onInteractOutside={handleClose}
                    onPointerDown={(event) => {
                        const target = event.target as Node | null;
                        if (!commandRef.current || !target) return;
                        if (!commandRef.current.contains(target)) {
                            handleClose();
                        }
                    }}
                >
                    <Command
                        ref={commandRef}
                        className="mx-auto w-full max-h-[78vh] max-w-xl overflow-hidden rounded-2xl border border-border bg-[color-mix(in_srgb,var(--bg)_98%,#070917_2%)] text-[var(--text)] shadow-soft transition sm:max-w-2xl md:max-w-3xl"
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
                        <Command.List className="max-h-[calc(78vh-5.25rem)] overflow-y-auto overscroll-contain pb-3">
                            {canShowResults ? (
                                <>
                                    <Command.Empty className="px-4 py-8 text-center text-sm text-subtle">
                                        No results found. Try refining your search.
                                    </Command.Empty>
                                    {DEFAULT_COMMAND_ACTIONS.map((action) => (
                                        <CommandListItem key={action.id} action={action} onSelect={handleSelect} />
                                    ))}
                                </>
                            ) : (
                                <div className="px-4 py-12 text-center text-sm text-subtle">
                                    Type at least {MIN_QUERY_LENGTH} characters to explore the documentation index.
                                </div>
                            )}
                        </Command.List>
                    </Command>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
