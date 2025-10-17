import { Code } from 'lucide-react';

import { Icon } from '@/components/ui/Icon';
import { formatMemberAccessLabel } from '@/lib/memberAccess';

import { CopyAnchorButton } from '@ui/CopyAnchorButton';

import { CommentParagraphs } from '../comments/CommentParagraphs';

import type { EntityMemberSummary } from '../types';
import type { ReactElement } from 'react';

export interface MemberCardHeaderProps {
    member: EntityMemberSummary;
    anchorId: string;
    tags: string[];
}

export function MemberCardHeader({ member, anchorId, tags }: MemberCardHeaderProps): ReactElement {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
                {tags.length ? (
                    <ul className="flex flex-wrap items-center gap-1 text-[0.55rem] uppercase tracking-[0.1em] text-subtle">
                        {tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-0.5 font-semibold"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                ) : null}
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                    <div className="group/name relative flex min-w-0 flex-1 items-center">
                        <CopyAnchorButton
                            anchorId={anchorId}
                            label={member.label}
                            className={
                                'absolute -left-8 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center opacity-0 transition-opacity ' +
                                'group-hover/name:opacity-100 group-focus-within/name:opacity-100 group-active/name:opacity-100 text-subtle hover:text-[var(--text)]'
                            }
                        />
                        <h3 className="truncate text-base font-semibold text-[var(--text)] sm:text-lg">
                            {member.label}
                        </h3>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {member.access ? (
                            <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-subtle">
                                {formatMemberAccessLabel(member.access)}
                            </span>
                        ) : null}
                        {member.sourceUrl ? (
                            <a
                                href={member.sourceUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex h-8 w-8 items-center justify-center text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_48%,var(--text))]"
                                aria-label={`Open source for ${member.label} in a new tab`}
                            >
                                <Icon icon={Code} size={16} />
                            </a>
                        ) : null}
                    </div>
                </div>
                {member.description ? (
                    <CommentParagraphs paragraphs={[member.description]} className="space-y-0" />
                ) : null}
            </div>
        </div>
    );
}
