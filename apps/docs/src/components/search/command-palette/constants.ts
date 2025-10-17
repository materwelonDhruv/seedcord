import {
    Binary,
    Braces,
    ExternalLink,
    FileText,
    FunctionSquare,
    Hammer,
    ListTree,
    PackageSearch,
    Puzzle,
    Sigma,
    SquareDot,
    SquareStack,
    Variable
} from 'lucide-react';

import type { SearchResultKind } from './types';
import type { LucideIcon } from 'lucide-react';

export const FOCUS_DELAY_MS = 10;
export const MIN_SEARCH_QUERY_LENGTH = 3;

export const SEARCH_KIND_ICONS: Record<SearchResultKind, LucideIcon> = {
    package: PackageSearch,
    page: FileText,
    resource: ExternalLink,
    class: SquareStack,
    interface: Puzzle,
    type: Braces,
    enum: ListTree,
    function: FunctionSquare,
    constructor: Hammer,
    method: FunctionSquare,
    property: SquareDot,
    variable: Variable,
    parameter: Binary,
    typeParameter: Sigma,
    enumMember: ListTree
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
    constructor: 'Constructor',
    method: 'Method',
    property: 'Property',
    variable: 'Variable',
    parameter: 'Parameter',
    typeParameter: 'Type Parameter',
    enumMember: 'Enum Member'
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
    constructor: 'text-[color-mix(in_srgb,var(--entity-function-color)_78%,var(--text))]',
    method: 'text-[color-mix(in_srgb,var(--entity-function-color)_78%,var(--text))]',
    property: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    variable: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    parameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_70%,var(--text))]',
    typeParameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]',
    enumMember: 'text-[color-mix(in_srgb,var(--entity-enum-color)_72%,var(--text))]'
};
