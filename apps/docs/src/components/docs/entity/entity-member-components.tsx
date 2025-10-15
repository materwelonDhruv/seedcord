'use client';

import { Check, ChevronDown, Code, Hash, Sigma, SquareDot, Workflow } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import { formatMemberAccessLabel } from '@lib/member-access';
import { cn } from '@lib/utils';
import { Icon } from '@ui/icon';

import type { EntityMemberSummary } from './member-types';
import type { LucideIcon } from 'lucide-react';

export type MemberPrefix = 'property' | 'method' | 'typeParameter';

const COPY_FEEDBACK_DURATION_MS = 1600;

const MEMBER_ACCENTS: Record<MemberPrefix, string> = {
    property: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    method: 'text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]',
    typeParameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]'
};

const MEMBER_HEADER_ICONS: Record<MemberPrefix, LucideIcon> = {
    property: SquareDot,
    method: Workflow,
    typeParameter: Sigma
};

const MEMBER_TITLES: Record<MemberPrefix, string> = {
    property: 'Properties',
    method: 'Methods',
    typeParameter: 'Type parameters'
};

function buildTagList(member: EntityMemberSummary): string[] {
    const collected = new Set(member.tags ?? []);

    if (member.accessorType) {
        collected.add(member.accessorType);
        collected.add('accessor');
    }

    return Array.from(collected);
}

function CopyAnchorButton({
    anchorId,
    label,
    className
}: {
    anchorId: string;
    label: string;
    className?: string;
}): ReactElement {
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (copyTimerRef.current !== null) {
                window.clearTimeout(copyTimerRef.current);
            }
        };
    }, []);

    const handleCopyLink = useCallback(() => {
        try {
            const url = new URL(window.location.href);
            url.hash = anchorId;

            if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
                void navigator.clipboard
                    .writeText(url.toString())
                    .then(() => {
                        setCopied(true);
                        if (copyTimerRef.current !== null) {
                            window.clearTimeout(copyTimerRef.current);
                        }
                        copyTimerRef.current = window.setTimeout(() => {
                            setCopied(false);
                            copyTimerRef.current = null;
                        }, COPY_FEEDBACK_DURATION_MS);
                    })
                    .catch(() => {});
            }
        } catch {
            /* swallow clipboard errors */
        }
    }, [anchorId]);

    return (
        <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-subtle transition duration-150 hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_55%,var(--text))]',
                copied ? 'text-[color-mix(in_srgb,var(--accent-b)_68%,var(--text))]' : undefined,
                className
            )}
            aria-label={copied ? `Copied link to ${label}` : `Copy link to ${label}`}
        >
            <Icon icon={copied ? Check : Hash} size={16} />
            <span className="sr-only" aria-live="polite">
                {copied ? 'Link copied to clipboard' : ''}
            </span>
        </button>
    );
}

interface MemberCardHeaderProps {
    member: EntityMemberSummary;
    anchorId: string;
    tags: string[];
}

function MemberCardHeader({ member, anchorId, tags }: MemberCardHeaderProps): ReactElement {
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
                    <p className="text-sm leading-relaxed text-subtle">{member.description}</p>
                ) : null}
            </div>
        </div>
    );
}

interface MemberCardBodyProps {
    member: EntityMemberSummary;
    fallbackDoc: string;
}

function MemberCardBody({ member, fallbackDoc }: MemberCardBodyProps): ReactElement {
    const signatureContainerClass =
        'code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-[var(--text)] md:px-3 md:py-2.5';

    return (
        <div className="mt-4 min-w-0 space-y-3 text-sm text-subtle">
            {member.signatureHtml ? (
                <div className={signatureContainerClass}>
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: member.signatureHtml }} />
                </div>
            ) : member.signature ? (
                <div className={signatureContainerClass}>
                    <pre className="code-scroll-content whitespace-pre text-sm text-[var(--text)]">
                        <code>{member.signature}</code>
                    </pre>
                </div>
            ) : null}
            <div className="space-y-2 leading-relaxed">
                <p>{fallbackDoc}</p>
                {member.inheritedFrom ? (
                    <p className="flex flex-wrap items-baseline gap-2 text-subtle">
                        <span className="font-semibold text-[var(--text)]">Inherited from:</span>
                        <span>{member.inheritedFrom}</span>
                    </p>
                ) : null}
            </div>
        </div>
    );
}

interface MemberCardProps {
    member: EntityMemberSummary;
    prefix: MemberPrefix;
    isLast: boolean;
}

function MemberCard({ member, prefix, isLast }: MemberCardProps): ReactElement {
    const tags = buildTagList(member);
    const anchorId = `${prefix}-${member.id}`;
    const fallbackDoc =
        member.documentation ??
        'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';
    const hasTags = tags.length > 0;

    return (
        <article
            id={anchorId}
            className={cn(
                'w-full min-w-0 max-w-full lg:scroll-mt-32',
                hasTags ? 'pt-4' : 'pt-3',
                isLast ? 'pb-4' : 'pb-6'
            )}
        >
            <MemberCardHeader member={member} anchorId={anchorId} tags={tags} />
            <MemberCardBody member={member} fallbackDoc={fallbackDoc} />
        </article>
    );
}

export function MemberDetailGroup({
    items,
    prefix
}: {
    items: readonly EntityMemberSummary[];
    prefix: MemberPrefix;
}): ReactElement | null {
    if (!items.length) {
        return null;
    }

    const title = MEMBER_TITLES[prefix];
    const panelId = `${prefix}-member-panel`;
    const [expanded, setExpanded] = useState(true);

    return (
        <section className="min-w-0 space-y-4" data-member-group={prefix}>
            <header>
                <button
                    type="button"
                    onClick={() => {
                        setExpanded((previous) => !previous);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-border/60 hover:bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_48%,var(--text))]"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                >
                    <span className="flex items-center gap-2 text-lg font-semibold text-[var(--text)]">
                        <Icon icon={MEMBER_HEADER_ICONS[prefix]} size={18} aria-hidden />
                        {title}
                    </span>
                    <Icon
                        icon={ChevronDown}
                        size={18}
                        className={cn(
                            'text-subtle transition-transform duration-200',
                            expanded ? 'rotate-0' : '-rotate-90'
                        )}
                        aria-hidden
                    />
                </button>
            </header>
            <div
                id={panelId}
                className={cn(
                    'divide-y divide-border/70 border-t border-border/70',
                    expanded ? 'flex min-w-0 flex-col' : 'hidden'
                )}
            >
                {items.map((item, index) => (
                    <MemberCard key={item.id} member={item} prefix={prefix} isLast={index === items.length - 1} />
                ))}
            </div>
        </section>
    );
}

interface MemberListProps {
    items: readonly EntityMemberSummary[];
    prefix: MemberPrefix;
    onNavigate: (anchorId: string) => void;
}

export function MemberList({ items, prefix, onNavigate }: MemberListProps): ReactElement | null {
    if (!items.length) {
        return null;
    }

    const title = MEMBER_TITLES[prefix];
    const accentClass = MEMBER_ACCENTS[prefix];

    return (
        <section className="min-w-0 space-y-2.5" aria-labelledby={`${prefix}-list-heading`}>
            <h2 id={`${prefix}-list-heading`} className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">
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
                                'group flex w-full min-w-0 items-center justify-between rounded-lg border border-border/70 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3.5 py-2 text-sm text-[var(--text)] transition',
                                'hover:border-[color-mix(in_srgb,var(--accent-b)_34%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent-b)_12%,var(--surface)_88%)]'
                            )}
                        >
                            <span className={cn('truncate font-medium', accentClass)}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export { MEMBER_ACCENTS, MEMBER_TITLES };
