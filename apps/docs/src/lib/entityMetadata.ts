import { Braces, FunctionSquare, ListTree, Puzzle, SquareStack, Variable } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type EntityTone = 'class' | 'interface' | 'type' | 'function' | 'enum' | 'variable';

interface EntityToneStyle {
    heading: string;
    item: string;
    badge: string;
    tag: string;
    accent: string;
}

export const ENTITY_TONE_STYLES: Record<EntityTone, EntityToneStyle> = {
    class: {
        heading: 'text-[color-mix(in_srgb,var(--entity-class-color)_85%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-class-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-class-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-class-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-class-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-class-color)_18%,transparent)]',
            'text-[var(--entity-class-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-class-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-class-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-class-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-class-color)_68%,var(--text))]'
    },
    interface: {
        heading: 'text-[color-mix(in_srgb,var(--entity-interface-color)_80%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-interface-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-interface-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-interface-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-interface-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-interface-color)_18%,transparent)]',
            'text-[var(--entity-interface-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-interface-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-interface-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-interface-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-interface-color)_68%,var(--text))]'
    },
    type: {
        heading: 'text-[color-mix(in_srgb,var(--entity-type-color)_80%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-type-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-type-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-type-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-type-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-type-color)_18%,transparent)]',
            'text-[var(--entity-type-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-type-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-type-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-type-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-type-color)_68%,var(--text))]'
    },
    function: {
        heading: 'text-[color-mix(in_srgb,var(--entity-function-color)_80%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-function-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-function-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-function-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-function-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-function-color)_18%,transparent)]',
            'text-[var(--entity-function-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-function-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-function-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-function-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-function-color)_68%,var(--text))]'
    },
    enum: {
        heading: 'text-[color-mix(in_srgb,var(--entity-enum-color)_80%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-enum-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-enum-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-enum-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-enum-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-enum-color)_18%,transparent)]',
            'text-[var(--entity-enum-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-enum-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-enum-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-enum-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-enum-color)_68%,var(--text))]'
    },
    variable: {
        heading: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
        item: [
            'hover:border-[color-mix(in_srgb,var(--entity-variable-color)_55%,transparent)]',
            'hover:bg-[color-mix(in_srgb,var(--entity-variable-color)_12%,transparent)]',
            'focus-visible:outline-[var(--entity-variable-color)]'
        ].join(' '),
        badge: [
            'border-[color-mix(in_srgb,var(--entity-variable-color)_35%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-variable-color)_18%,transparent)]',
            'text-[var(--entity-variable-color)]'
        ].join(' '),
        tag: [
            'border-[color-mix(in_srgb,var(--entity-variable-color)_28%,transparent)]',
            'bg-[color-mix(in_srgb,var(--entity-variable-color)_12%,transparent)]',
            'text-[color-mix(in_srgb,var(--entity-variable-color)_70%,var(--text))]'
        ].join(' '),
        accent: 'text-[color-mix(in_srgb,var(--entity-variable-color)_68%,var(--text))]'
    }
};

const ENTITY_TONE_LABELS: Record<EntityTone, string> = {
    class: 'Class',
    interface: 'Interface',
    type: 'Type',
    function: 'Function',
    enum: 'Enum',
    variable: 'Variable'
};

export const ENTITY_KIND_ICONS: Record<EntityTone, LucideIcon> = {
    class: SquareStack,
    interface: Puzzle,
    type: Braces,
    function: FunctionSquare,
    enum: ListTree,
    variable: Variable
};

const KIND_LOOKUP: Record<string, EntityTone> = {
    class: 'class',
    classes: 'class',
    interface: 'interface',
    interfaces: 'interface',
    type: 'type',
    types: 'type',
    typealias: 'type',
    alias: 'type',
    function: 'function',
    functions: 'function',
    method: 'function',
    methods: 'function',
    parameter: 'type',
    parameters: 'type',
    enum: 'enum',
    enums: 'enum',
    enumeration: 'enum',
    variable: 'variable',
    variables: 'variable',
    const: 'variable',
    constant: 'variable',
    constants: 'variable',
    property: 'variable',
    properties: 'variable'
};

export function resolveEntityTone(input?: string | null): EntityTone {
    if (!input) {
        return 'class';
    }

    const normalized = input.toLowerCase();
    return KIND_LOOKUP[normalized] ?? 'class';
}

export function formatEntityKindLabel(input?: string | null): string {
    const tone = resolveEntityTone(input ?? undefined);
    return ENTITY_TONE_LABELS[tone];
}
