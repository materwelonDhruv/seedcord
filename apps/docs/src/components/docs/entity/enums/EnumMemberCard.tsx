import { Code } from 'lucide-react';

import { CopyAnchorButton } from '@ui/CopyAnchorButton';
import { Icon } from '@ui/Icon';

import { CommentParagraphs } from '../comments/CommentParagraphs';

import type { EnumMemberModel } from '@lib/docs/types';
import type { ReactElement } from 'react';

export function EnumMemberCard({ member }: { member: EnumMemberModel }): ReactElement {
    const anchorId = `enum-member-${member.id}`;
    const hasSummary = member.summary.length > 0;
    const showValueAfterSignature = member.value !== undefined && !member.signature.text.includes(String(member.value));

    return (
        <article
            id={anchorId}
            className="group/name relative min-w-0 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft sm:p-5"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="group/name relative flex min-w-0 items-center">
                        <div className="min-w-0">
                            {member.signature.html ? (
                                <div className="text-sm text-subtle flex items-center gap-2">
                                    <div
                                        className="shiki-inline-wrapper truncate"
                                        dangerouslySetInnerHTML={{ __html: member.signature.html }}
                                    />
                                    {showValueAfterSignature ? (
                                        <code className="font-mono truncate">= {member.value}</code>
                                    ) : null}
                                </div>
                            ) : member.value ? (
                                <div className="truncate text-sm text-subtle">
                                    <code className="font-mono truncate">
                                        {member.label} = {member.value}
                                    </code>
                                </div>
                            ) : (
                                <div className="truncate text-sm text-subtle">
                                    <code className="font-mono truncate">{member.label}</code>
                                </div>
                            )}
                        </div>

                        <div className="ml-auto flex h-8 w-[4.5rem] shrink-0 items-center justify-end gap-2 pl-2">
                            <CopyAnchorButton
                                anchorId={anchorId}
                                label={member.label}
                                className="h-8 w-8 opacity-0 transition-opacity duration-150 group-hover/name:opacity-100"
                            />
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
                </div>
            </div>

            {hasSummary ? <CommentParagraphs paragraphs={member.summary} className="mt-2 space-y-0" /> : null}
        </article>
    );
}
