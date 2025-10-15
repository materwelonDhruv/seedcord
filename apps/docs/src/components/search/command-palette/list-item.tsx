'use client';

import { Command } from 'cmdk';

import { ENTITY_TONE_STYLES, type EntityTone } from '@lib/entity-metadata';
import { cn } from '@lib/utils';
import { Icon } from '@ui/icon';

import { SEARCH_KIND_ICONS } from './constants';

import type { CommandAction, SearchResultKind } from './types';
import type { ReactElement } from 'react';

type EntityResultKind =
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

type NonEntityResultKind = Extract<SearchResultKind, 'package' | 'page' | 'resource'>;

const ENTITY_KIND_TO_TONE: Record<EntityResultKind, EntityTone> = {
    class: 'class',
    interface: 'interface',
    type: 'type',
    enum: 'enum',
    function: 'function',
    method: 'function',
    property: 'variable',
    variable: 'variable',
    parameter: 'type',
    typeParameter: 'type'
};

const NON_ENTITY_BADGES: Record<NonEntityResultKind, string> = {
    package: [
        'border-[color-mix(in_srgb,var(--accent-b)_38%,var(--border))]',
        'bg-[color-mix(in_srgb,var(--accent-b)_16%,var(--surface)_84%)]',
        'text-[color-mix(in_srgb,var(--text)_88%,var(--accent-b)_12%)]'
    ].join(' '),
    page: [
        'border-[color-mix(in_srgb,var(--accent-a)_34%,var(--border))]',
        'bg-[color-mix(in_srgb,var(--accent-a)_14%,var(--surface)_86%)]',
        'text-[color-mix(in_srgb,var(--text)_90%,var(--accent-a)_10%)]'
    ].join(' '),
    resource: [
        'border-[color-mix(in_srgb,#8b90a7_46%,var(--border))]',
        'bg-[color-mix(in_srgb,#8b90a7_18%,var(--surface)_82%)]',
        'text-[color-mix(in_srgb,var(--text)_88%,#8b90a7_12%)]'
    ].join(' ')
};

const BASE_ICON_CLASSES = [
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition duration-150',
    'group-hover/item:shadow-[0_0_0_1px_color-mix(in_srgb,currentColor_30%,transparent)]',
    'group-data-[selected=true]/item:shadow-[0_0_0_1px_color-mix(in_srgb,currentColor_42%,transparent)]'
].join(' ');

interface CommandListItemProps {
    action: CommandAction;
    onSelect: (action: CommandAction) => void;
}

export function CommandListItem({ action, onSelect }: CommandListItemProps): ReactElement {
    const ItemIcon = SEARCH_KIND_ICONS[action.kind];
    const isEntityResult = Object.prototype.hasOwnProperty.call(ENTITY_KIND_TO_TONE, action.kind);
    const tone = isEntityResult ? ENTITY_KIND_TO_TONE[action.kind as EntityResultKind] : undefined;
    const toneStyles = tone ? ENTITY_TONE_STYLES[tone] : undefined;
    const iconClasses = cn(
        BASE_ICON_CLASSES,
        toneStyles ? toneStyles.badge : NON_ENTITY_BADGES[action.kind as NonEntityResultKind]
    );

    return (
        <Command.Item
            value={`${action.label} ${action.path} ${action.id} ${action.description ?? ''}`}
            onSelect={() => onSelect(action)}
            data-command-id={action.id}
            title={action.path}
            className={cn(
                'group/item mt-1 flex cursor-pointer items-start gap-3 rounded-xl border border-transparent bg-transparent px-3 py-3 text-sm text-[var(--text)] outline-none transition first:mt-0',
                'hover:border-[color-mix(in_srgb,var(--accent-b)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-b)_10%,transparent)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent-b)_28%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--bg)_96%,transparent)]',
                'data-[selected=true]:border-[color-mix(in_srgb,var(--accent-b)_38%,transparent)] data-[selected=true]:bg-[color-mix(in_srgb,var(--accent-b)_16%,transparent)] data-[selected=true]:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-b)_22%,transparent)]'
            )}
            aria-label={action.label}
        >
            <span className={iconClasses}>
                <Icon icon={ItemIcon} size={18} aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium transition-colors group-hover/item:text-[color-mix(in_srgb,var(--text)_88%,var(--accent-b)_12%)] group-data-[selected=true]/item:text-[color-mix(in_srgb,var(--text)_85%,var(--accent-b)_15%)]">
                        {action.label}
                    </span>
                </div>
                <span className="truncate font-mono text-xs text-subtle transition-colors group-hover/item:text-[color-mix(in_srgb,var(--text)_70%,var(--accent-b)_30%)] group-data-[selected=true]/item:text-[color-mix(in_srgb,var(--text)_68%,var(--accent-b)_32%)]">
                    {action.path}
                </span>
                {action.description ? <span className="text-xs text-subtle">{action.description}</span> : null}
            </div>
            {action.isExternal ? (
                <Icon icon={SEARCH_KIND_ICONS.resource} size={16} className="mt-1 text-subtle" aria-hidden />
            ) : null}
        </Command.Item>
    );
}

export default CommandListItem;
