import { Braces, FunctionSquare, ListTree, Puzzle, SquareStack, Variable } from 'lucide-react';

const ENTITIES_INTERNAL = {
    class: {
        label: 'Class',
        icon: SquareStack,
        styles: {
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
        }
    },
    interface: {
        label: 'Interface',
        icon: Puzzle,
        styles: {
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
        }
    },
    type: {
        label: 'Type',
        icon: Braces,
        styles: {
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
        }
    },
    function: {
        label: 'Function',
        icon: FunctionSquare,
        styles: {
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
        }
    },
    enum: {
        label: 'Enum',
        icon: ListTree,
        styles: {
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
        }
    },
    variable: {
        label: 'Variable',
        icon: Variable,
        styles: {
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
    }
} as const;

export type EntityTone = keyof typeof ENTITIES_INTERNAL;
export type EntityToneConfig = (typeof ENTITIES_INTERNAL)[EntityTone];
export type EntityToneStyle = EntityToneConfig['styles'];

export const ENTITIES: typeof ENTITIES_INTERNAL = ENTITIES_INTERNAL;

const TONE_DIRECTORY_MAP = {
    class: 'classes',
    interface: 'interfaces',
    type: 'types',
    function: 'functions',
    enum: 'enums',
    variable: 'variables'
} as const;

export type DirectoryEntityFrontend = (typeof TONE_DIRECTORY_MAP)[EntityTone];

export const toneToDirectory = (tone: EntityTone): DirectoryEntityFrontend => TONE_DIRECTORY_MAP[tone];

const TONE_SYNONYMS: Partial<Record<string, EntityTone>> = {
    typealias: 'type',
    alias: 'type',
    method: 'function',
    parameter: 'type',
    const: 'variable',
    constant: 'variable',
    property: 'variable',
    enumeration: 'enum'
};

const isEntityTone = (value: string): value is EntityTone => value in ENTITIES;

const SINGLE_CHARACTER = 1;
const DOUBLE_CHARACTER = 2;
const TRIPLE_CHARACTER = 3;

const buildToneCandidates = (value: string): string[] => {
    const candidates = new Set<string>([value]);

    if (value.endsWith('s')) {
        const withoutS = value.slice(0, value.length - SINGLE_CHARACTER);
        if (withoutS) {
            candidates.add(withoutS);
        }
    }

    if (value.endsWith('es')) {
        const withoutEs = value.slice(0, value.length - DOUBLE_CHARACTER);
        if (withoutEs) {
            candidates.add(withoutEs);
        }
    }

    if (value.endsWith('ies')) {
        const withoutIes = `${value.slice(0, value.length - TRIPLE_CHARACTER)}y`;
        if (withoutIes) {
            candidates.add(withoutIes);
        }
    }

    return [...candidates];
};

export function getToneConfig(tone: EntityTone): EntityToneConfig {
    return ENTITIES[tone];
}

export function resolveEntityTone(input?: string | null): EntityTone {
    if (!input) {
        return 'class';
    }

    const normalized = input.trim().toLowerCase();
    if (!normalized) {
        return 'class';
    }

    for (const candidate of buildToneCandidates(normalized)) {
        const synonymTone = TONE_SYNONYMS[candidate];
        if (synonymTone) {
            return synonymTone;
        }

        if (isEntityTone(candidate)) {
            return candidate;
        }
    }

    return 'class';
}

export function formatEntityKindLabel(input?: string | null): string {
    const tone = resolveEntityTone(input);
    return getToneConfig(tone).label;
}
