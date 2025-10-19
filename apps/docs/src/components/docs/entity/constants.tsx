import { Hammer, Sigma, SquareDot, Workflow } from 'lucide-react';

import type { MemberPrefix } from './types';
import type { LucideIcon } from 'lucide-react';

export const MEMBER_ACCENTS: Record<MemberPrefix, string> = {
    property: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    method: 'text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]',
    constructor: 'text-[color-mix(in_srgb,var(--entity-function-color)_78%,var(--text))]',
    typeParameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]'
};

export const MEMBER_HEADER_ICONS: Record<MemberPrefix, LucideIcon> = {
    property: SquareDot,
    method: Workflow,
    constructor: Hammer,
    typeParameter: Sigma
};

export const MEMBER_TITLES: Record<MemberPrefix, string> = {
    property: 'Properties',
    method: 'Methods',
    constructor: 'Constructors',
    typeParameter: 'Type parameters'
};
