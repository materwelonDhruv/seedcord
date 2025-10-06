'use client';

import { Command } from 'cmdk';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

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
    const pathname = usePathname();

    const isActive = useMemo(() => {
        if (action.isExternal) {
            return false;
        }

        try {
            const url = new URL(action.href, 'https://seedcord.local');
            return url.pathname === pathname;
        } catch {
            return false;
        }
    }, [action.href, action.isExternal, pathname]);

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
                'hover:border-[color-mix(in_srgb,var(--accent-a)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-a)_8%,transparent)]',
                'focus-visible:outline-none',
                'data-[selected=true]:border-[color-mix(in_srgb,var(--accent-a)_35%,transparent)] data-[selected=true]:bg-[color-mix(in_srgb,var(--accent-a)_10%,transparent)]',
                'data-[active=true]:border-[color-mix(in_srgb,var(--accent-a)_45%,transparent)] data-[active=true]:bg-[color-mix(in_srgb,var(--accent-a)_14%,transparent)] data-[active=true]:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-a)_22%,transparent)]'
            )}
            aria-label={action.label}
            data-active={isActive}
        >
            <span
                data-active={isActive}
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]',
                    accentClass,
                    'data-[active=true]:border-[color-mix(in_srgb,var(--accent-a)_42%,transparent)] data-[active=true]:bg-[color-mix(in_srgb,var(--accent-a)_18%,transparent)] data-[active=true]:text-[color-mix(in_srgb,var(--accent-a)_78%,var(--text))]'
                )}
            >
                <Icon icon={ItemIcon} size={18} aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={cn(
                            'truncate font-medium transition-colors',
                            isActive && 'text-[color-mix(in_srgb,var(--accent-a)_68%,var(--text))]'
                        )}
                    >
                        {action.label}
                    </span>
                </div>
                <span
                    className={cn(
                        'truncate font-mono text-xs text-subtle transition-colors',
                        isActive && 'text-[color-mix(in_srgb,var(--accent-a)_60%,var(--text))]'
                    )}
                >
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
