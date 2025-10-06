import type { LucideIcon } from 'lucide-react';

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
    | 'parameter';

export interface CommandAction {
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
