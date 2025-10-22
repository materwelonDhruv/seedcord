'use client';

import Link from 'next/link';

import { cn } from '@lib/utils';

import { MEMBER_TITLES, MEMBER_ACCENTS } from '../constants';

import type { EntityMemberSummary, MemberPrefix } from '../types';
import type { ReactElement } from 'react';

interface MemberListProps {
    items: readonly EntityMemberSummary[];
    prefix: MemberPrefix;
    onNavigate: (anchorId: string) => void;
}

function MemberList({ items, prefix, onNavigate }: MemberListProps): ReactElement | null {
    if (!items.length) {
        return null;
    }

    const title = MEMBER_TITLES[prefix];
    const accentClass = MEMBER_ACCENTS[prefix];

    return (
        <section className="min-w-0 space-y-2.5" aria-labelledby={`${prefix}-list-heading`}>
            <h2 id={`${prefix}-list-heading`} className="text-xs font-semibold uppercase tracking-widest text-subtle">
                {title}
            </h2>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id} className="min-w-0">
                        <Link
                            href={`#${prefix}-${item.id}`}
                            onClick={() => {
                                onNavigate(`${prefix}-${item.id}`);
                            }}
                            className={cn(
                                'group flex w-full min-w-0 items-center justify-between rounded-lg border border-(--border)/70 bg-surface-muted px-3.5 py-2 text-sm text-(--text) transition',
                                'hover:border-[color-mix(in_oklab,var(--accent-b)_34%,var(--border))] hover:bg-[color-mix(in_oklab,var(--accent-b)_12%,var(--surface)_88%)]'
                            )}
                        >
                            <span className={cn('truncate font-medium', accentClass)}>
                                {prefix === 'method' ? `${item.label}()` : item.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default MemberList;
