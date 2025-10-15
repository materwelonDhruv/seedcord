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
    Sigma,
    SquareDot,
    SquareStack,
    Variable
} from 'lucide-react';

import type { SearchResultKind, CommandGroupModel, CommandAction } from './types';
import type { LucideIcon } from 'lucide-react';

export const FOCUS_DELAY_MS = 10;

export const SEARCH_KIND_ICONS: Record<SearchResultKind, LucideIcon> = {
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

export const SEARCH_KIND_LABELS: Record<SearchResultKind, string> = {
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

export const SEARCH_KIND_ACCENTS: Record<SearchResultKind, string> = {
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

export const COMMAND_GROUPS: CommandGroupModel[] = [
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

export const DEFAULT_COMMAND_ACTIONS: CommandAction[] = COMMAND_GROUPS.flatMap((group) => group.actions);
