'use client';

import { Command } from 'cmdk';

import { Icon } from '@components/ui/icon';
import { cn } from '@lib/utils';

import { SEARCH_KIND_ACCENTS, SEARCH_KIND_ICONS } from './constants';

import type { CommandAction } from './types';
import type { ReactElement } from 'react';

interface CommandListItemProps {
    action: CommandAction;
    onSelect: (action: CommandAction) => void;
}

export function CommandListItem({ action, onSelect }: CommandListItemProps): ReactElement {
    const ItemIcon = SEARCH_KIND_ICONS[action.kind];
    const accentClass = SEARCH_KIND_ACCENTS[action.kind];

    return (
        <Command.Item
            value={`${action.label} ${action.path} ${action.id} ${action.description ?? ''}`}
            onSelect={() => onSelect(action)}
            data-command-id={action.id}
            title={action.path}
            className={cn(
                'group/item flex cursor-pointer items-start gap-3 rounded-xl border border-transparent bg-transparent px-3 py-3 text-sm text-[var(--text)] outline-none transition',
                'hover:border-[color-mix(in_srgb,var(--accent-b)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-b)_10%,transparent)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent-b)_28%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--bg)_96%,transparent)]',
                'data-[selected=true]:border-[color-mix(in_srgb,var(--accent-b)_38%,transparent)] data-[selected=true]:bg-[color-mix(in_srgb,var(--accent-b)_16%,transparent)] data-[selected=true]:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-b)_22%,transparent)]'
            )}
            aria-label={action.label}
        >
            <span
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] text-[var(--text)] transition',
                    'group-hover/item:border-[color-mix(in_srgb,var(--accent-b)_35%,var(--border))] group-hover/item:bg-[color-mix(in_srgb,var(--accent-b)_14%,var(--surface)_86%)]',
                    'group-data-[selected=true]/item:border-[color-mix(in_srgb,var(--accent-b)_40%,var(--border))] group-data-[selected=true]/item:bg-[color-mix(in_srgb,var(--accent-b)_18%,var(--surface)_82%)]',
                    accentClass
                )}
            >
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
