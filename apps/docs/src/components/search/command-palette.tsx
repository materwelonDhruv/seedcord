/* eslint-disable max-lines */
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import {
    Binary,
    Braces,
    ExternalLink,
    FileText,
    FunctionSquare,
    Layers,
    ListTree,
    PackageSearch,
    Puzzle,
    Search,
    Sigma,
    SquareDot,
    SquareStack,
    Variable,
    X
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Button from '@components/ui/button';
import Icon from '@components/ui/icon';
import { log } from '@lib/logger';
import { cn } from '@lib/utils';
import useUIStore from '@store/ui';

import type { UIStore } from '@store/ui';
import type { LucideIcon } from 'lucide-react';
import type { KeyboardEvent, ReactElement, RefObject } from 'react';

type SearchResultKind =
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

interface CommandGroupModel {
    heading: string;
    actions: CommandAction[];
    icon: LucideIcon;
}

const FOCUS_DELAY_MS = 10;

const SEARCH_KIND_ICONS: Record<SearchResultKind, LucideIcon> = {
    package: PackageSearch,
    page: FileText,
    resource: ExternalLink,
    class: SquareStack,
    interface: Puzzle,
    type: Braces,
    enum: ListTree,
    function: FunctionSquare,
    method: FunctionSquare,
    property: SquareDot,
    variable: Variable,
    parameter: Binary,
    typeParameter: Sigma
};

const SEARCH_KIND_LABELS: Record<SearchResultKind, string> = {
    package: 'Package',
    page: 'Page',
    resource: 'Resource',
    class: 'Class',
    interface: 'Interface',
    type: 'Type',
    enum: 'Enum',
    function: 'Function',
    method: 'Method',
    property: 'Property',
    variable: 'Variable',
    parameter: 'Parameter',
    typeParameter: 'Type Parameter'
};

const SEARCH_KIND_ACCENTS: Record<SearchResultKind, string> = {
    package: 'text-[color-mix(in_srgb,var(--accent-b)_70%,var(--text))]',
    page: 'text-[color-mix(in_srgb,var(--accent-a)_68%,var(--text))]',
    resource: 'text-[color-mix(in_srgb,#8b90a7_70%,var(--text))]',
    class: 'text-[color-mix(in_srgb,var(--entity-class-color)_78%,var(--text))]',
    interface: 'text-[color-mix(in_srgb,var(--entity-interface-color)_78%,var(--text))]',
    type: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]',
    enum: 'text-[color-mix(in_srgb,var(--entity-enum-color)_75%,var(--text))]',
    function: 'text-[color-mix(in_srgb,var(--entity-function-color)_78%,var(--text))]',
    method: 'text-[color-mix(in_srgb,var(--entity-function-color)_78%,var(--text))]',
    property: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    variable: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    parameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_70%,var(--text))]',
    typeParameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]'
};

const COMMAND_GROUPS: CommandGroupModel[] = [
    {
        heading: 'Packages',
        icon: PackageSearch,
        actions: [
            {
                id: 'pkg-core',
                label: '@seedcord/core',
                path: '/packages/core',
                href: '/docs?package=core',
                kind: 'package',
                description: 'Core runtime APIs and lifecycle primitives.'
            },
            {
                id: 'pkg-plugins',
                label: '@seedcord/plugins',
                path: '/packages/plugins',
                href: '/docs?package=plugins',
                kind: 'package',
                description: 'Decorator helpers and plugin bootstrap.'
            },
            {
                id: 'pkg-services',
                label: '@seedcord/services',
                path: '/packages/services',
                href: '/docs?package=services',
                kind: 'package',
                description: 'Service registry, schedulers, and orchestrators.'
            }
        ]
    },
    {
        heading: 'Symbols',
        icon: Layers,
        actions: [
            {
                id: 'core::Client',
                label: 'Client',
                path: '/packages/core/classes/client',
                href: '/docs/entity?pkg=@seedcord/core&symbol=Client',
                kind: 'class',
                description: 'Primary gateway into the Discord runtime.'
            },
            {
                id: 'core::ClientOptions',
                label: 'ClientOptions',
                path: '/packages/core/interfaces/client-options',
                href: '/docs/entity?pkg=@seedcord/core&symbol=ClientOptions',
                kind: 'interface',
                description: 'Configuration contract consumed by Client.'
            },
            {
                id: 'core::LifecycleHook',
                label: 'LifecycleHook',
                path: '/packages/core/types/lifecycle-hook',
                href: '/docs/entity?pkg=@seedcord/core&symbol=LifecycleHook',
                kind: 'type',
                description: 'Union type representing lifecycle extension points.'
            },
            {
                id: 'core::LogLevel',
                label: 'LogLevel',
                path: '/packages/core/enums/log-level',
                href: '/docs/entity?pkg=@seedcord/core&symbol=LogLevel',
                kind: 'enum',
                description: 'Logger severity levels used across Seedcord.'
            },
            {
                id: 'core::createPlugin',
                label: 'createPlugin',
                path: '/packages/plugins/functions/create-plugin',
                href: '/docs/entity?pkg=@seedcord/plugins&symbol=createPlugin',
                kind: 'function',
                description: 'Factory helper for composing Seedcord plugins.'
            },
            {
                id: 'core::DEFAULT_TIMEOUT',
                label: 'DEFAULT_TIMEOUT',
                path: '/packages/core/variables/default-timeout',
                href: '/docs/entity?pkg=@seedcord/core&symbol=DEFAULT_TIMEOUT',
                kind: 'variable',
                description: 'Default duration applied to async workflows.'
            },
            {
                id: 'core::Client#use<TPlugin>',
                label: 'TPlugin',
                path: '/packages/core/classes/client#typeparam-TPlugin',
                href: '/docs/entity?pkg=@seedcord/core&symbol=Client&typeparam=TPlugin',
                kind: 'typeParameter',
                description: 'Generic constraint used by Client.use() to scope plugin contracts.'
            }
        ]
    },
    {
        heading: 'Members',
        icon: FunctionSquare,
        actions: [
            {
                id: 'core::Client#connect',
                label: 'Client.connect()',
                path: '/packages/core/classes/client#connect',
                href: '/docs/entity?pkg=@seedcord/core&symbol=Client&member=connect',
                kind: 'method',
                description: 'Establishes the WebSocket connection to Discord.'
            },
            {
                id: 'core::Client#options',
                label: 'Client.options',
                path: '/packages/core/classes/client#options',
                href: '/docs/entity?pkg=@seedcord/core&symbol=Client&member=options',
                kind: 'property',
                description: 'Resolved ClientOptions available after boot.'
            },
            {
                id: 'core::Client#connect.timeout',
                label: 'connect(options).timeout',
                path: '/packages/core/classes/client#connect:timeout',
                href: '/docs/entity?pkg=@seedcord/core&symbol=Client&member=connect&param=timeout',
                kind: 'parameter',
                description: 'Timeout (ms) applied to the connect handshake.'
            }
        ]
    },
    {
        heading: 'Navigation',
        icon: FileText,
        actions: [
            {
                id: 'page-home',
                label: 'Landing page',
                path: '/',
                href: '/',
                kind: 'page',
                description: 'Seedcord platform overview.'
            },
            {
                id: 'page-docs',
                label: 'Documentation index',
                path: '/docs',
                href: '/docs',
                kind: 'page',
                description: 'Browse packages and symbol groups.'
            }
        ]
    },
    {
        heading: 'Resources',
        icon: ExternalLink,
        actions: [
            {
                id: 'ext-guide',
                label: 'Seedcord guide',
                path: 'https://github.com/materwelonDhruv/seedcord-guide',
                href: 'https://github.com/materwelonDhruv/seedcord-guide',
                kind: 'resource',
                description: 'Deep dive tutorials and workflows.',
                isExternal: true
            },
            {
                id: 'ext-repo',
                label: 'GitHub repository',
                path: 'https://github.com/materwelonDhruv/seedcord',
                href: 'https://github.com/materwelonDhruv/seedcord',
                kind: 'resource',
                description: 'Source code, issues, and roadmap.',
                isExternal: true
            }
        ]
    }
];

interface CommandListItemProps {
    action: CommandAction;
    onSelect: (action: CommandAction) => void;
}

function CommandListItem({ action, onSelect }: CommandListItemProps): ReactElement {
    const ItemIcon = SEARCH_KIND_ICONS[action.kind];
    const accentClass = SEARCH_KIND_ACCENTS[action.kind];
    const badgeLabel = SEARCH_KIND_LABELS[action.kind];

    return (
        <Command.Item
            value={`${action.label} ${action.path} ${badgeLabel} ${action.id} ${action.description ?? ''}`}
            onSelect={() => onSelect(action)}
            data-command-id={action.id}
            title={action.path}
            className={cn(
                'group/item flex cursor-pointer items-start gap-3 rounded-xl border border-transparent bg-transparent px-3 py-3 text-sm text-[var(--text)] outline-none transition',
                'hover:border-[color-mix(in_srgb,var(--accent-a)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-a)_8%,transparent)]',
                'focus-visible:outline-none',
                'data-[selected=true]:border-[color-mix(in_srgb,var(--accent-a)_35%,transparent)]',
                'data-[selected=true]:bg-[color-mix(in_srgb,var(--accent-a)_10%,transparent)]'
            )}
            aria-label={action.label}
        >
            <span
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]',
                    accentClass
                )}
            >
                <Icon icon={ItemIcon} size={18} aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium">{action.label}</span>
                    <span className="rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-subtle">
                        {badgeLabel}
                    </span>
                </div>
                <span className="truncate font-mono text-xs text-subtle">{action.path}</span>
                {action.description ? <span className="text-xs text-subtle">{action.description}</span> : null}
            </div>
            {action.isExternal ? <Icon icon={ExternalLink} size={16} className="mt-1 text-subtle" aria-hidden /> : null}
        </Command.Item>
    );
}

function CommandListSection({
    group,
    onSelect
}: {
    group: CommandGroupModel;
    onSelect: (action: CommandAction) => void;
}): ReactElement {
    const GroupIcon = group.icon;

    return (
        <Command.Group heading={group.heading} className="space-y-1 px-2 py-2">
            <div className="flex items-center gap-2 px-1 text-subtle">
                <Icon icon={GroupIcon} size={16} aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide">{group.heading}</span>
            </div>
            <div className="mt-1 space-y-1">
                {group.actions.map((action) => (
                    <CommandListItem key={action.id} action={action} onSelect={onSelect} />
                ))}
            </div>
        </Command.Group>
    );
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
                            {COMMAND_GROUPS.map((group) => (
                                <CommandListSection key={group.heading} group={group} onSelect={handleSelect} />
                            ))}
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
