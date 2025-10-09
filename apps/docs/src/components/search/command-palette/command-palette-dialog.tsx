'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';

import { CommandHeader } from './command-header';
import { COMMAND_GROUPS } from './constants';
import { CommandListSection } from './list-section';

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

    const normalizedSearch = searchValue.trim();
    const canShowResults = normalizedSearch.length >= MIN_QUERY_LENGTH;
    const resultsGroups = COMMAND_GROUPS.filter((group) => group.heading !== 'Packages');

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    data-command-overlay
                    className="fixed inset-0 bg-[color-mix(in_srgb,var(--bg)_55%,#070917_45%)]/70 backdrop-blur-sm"
                />
                <Dialog.Content
                    data-command-content
                    className="fixed inset-0 flex items-start justify-center p-4 pt-[12vh] sm:pt-[10vh]"
                >
                    <Command
                        className="max-h-[70vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-[color-mix(in_srgb,var(--bg)_98%,#070917_2%)] text-[var(--text)] shadow-soft transition"
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
                        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain pb-3">
                            {canShowResults ? (
                                <>
                                    <Command.Empty className="px-4 py-8 text-center text-sm text-subtle">
                                        No results found. Try refining your search.
                                    </Command.Empty>
                                    {resultsGroups.map((group) => (
                                        <CommandListSection key={group.heading} group={group} onSelect={handleSelect} />
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
