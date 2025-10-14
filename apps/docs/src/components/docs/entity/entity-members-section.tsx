'use client';

import { ChevronDown, Code, Hash, Sigma, SquareDot, Workflow } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Icon } from '@components/ui/icon';
import { formatMemberAccessLabel, MEMBER_ACCESS_RANK, type MemberAccessLevel } from '@lib/member-access';
import { cn } from '@lib/utils';
import { useUIStore, type UIStore } from '@store/ui';

import type { EntityMemberSummary } from './member-types';
import type { LucideIcon } from 'lucide-react';

type MemberPrefix = 'property' | 'method' | 'typeParameter';

interface EntityMembersSectionProps {
    properties: readonly EntityMemberSummary[];
    methods: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
}

const MEMBER_ICONS: Record<MemberPrefix, LucideIcon> = {
    property: SquareDot,
    method: Workflow,
    typeParameter: Sigma
};

const MEMBER_ACCENTS: Record<MemberPrefix, string> = {
    property: 'text-[color-mix(in_srgb,var(--entity-variable-color)_78%,var(--text))]',
    method: 'text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]',
    typeParameter: 'text-[color-mix(in_srgb,var(--entity-type-color)_75%,var(--text))]'
};

const MEMBER_TITLES: Record<MemberPrefix, string> = {
    property: 'Properties',
    method: 'Methods',
    typeParameter: 'Type parameters'
};

function shouldIncludeMember(member: EntityMemberSummary, threshold: MemberAccessLevel): boolean {
    const access = member.access ?? 'public';
    return MEMBER_ACCESS_RANK[access] <= MEMBER_ACCESS_RANK[threshold];
}

function buildTagList(member: EntityMemberSummary): string[] {
    const collected = new Set(member.tags ?? []);

    if (member.accessorType) {
        collected.add(member.accessorType);
        collected.add('accessor');
    }

    return Array.from(collected);
}

interface MemberDetailSummaryProps {
    member: EntityMemberSummary;
    itemIcon: LucideIcon;
    accentClass: string;
    tags: string[];
    anchorId: string;
}

function MemberDetailSummary({
    member,
    itemIcon,
    accentClass,
    tags,
    anchorId
}: MemberDetailSummaryProps): ReactElement {
    const handleCopyLink = useCallback(() => {
        try {
            const url = new URL(window.location.href);
            url.hash = anchorId;

            if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
                void navigator.clipboard.writeText(url.toString()).catch(() => {});
            }
        } catch {
            /* swallow clipboard errors */
        }
    }, [anchorId]);

    return (
        <summary className="group/summary flex cursor-pointer items-center justify-between gap-4 rounded-t-3xl px-6 py-4 text-left text-[var(--text)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] focus-visible:outline-none">
            <div className="flex flex-1 items-center gap-4">
                <span
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]',
                        accentClass
                    )}
                >
                    <Icon icon={itemIcon} size={20} />
                </span>
                <div className="min-w-0 space-y-1">
                    <h3 className="truncate text-lg font-semibold lg:text-xl">{member.label}</h3>
                    {tags.length ? (
                        <ul className="flex flex-wrap items-center gap-1 text-[0.625rem] uppercase tracking-[0.3em] text-subtle">
                            {tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-2 py-0.5 font-semibold"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center rounded-full border border-transparent p-1.5 text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2"
                    aria-label={`Copy link to ${member.label}`}
                >
                    <Icon icon={Hash} size={16} />
                </button>
                {member.sourceUrl ? (
                    <a
                        href={member.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-transparent p-1.5 text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2"
                        aria-label={`Jump to source for ${member.label}`}
                    >
                        <Icon icon={Code} size={16} />
                    </a>
                ) : null}
                {member.access ? (
                    <span className="rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-subtle">
                        {formatMemberAccessLabel(member.access)}
                    </span>
                ) : null}
                <Icon
                    icon={ChevronDown}
                    size={18}
                    className="text-subtle transition-transform duration-200 group-open/summary:rotate-180"
                />
            </div>
        </summary>
    );
}

interface MemberDetailBodyProps {
    member: EntityMemberSummary;
    fallbackDoc: string;
}

function MemberDetailBody({ member, fallbackDoc }: MemberDetailBodyProps): ReactElement {
    return (
        <div className="space-y-4 border-t border-border px-6 py-6 text-sm text-subtle">
            <p>{member.description}</p>
            {member.signatureHtml ? (
                <div
                    className="shiki-container overflow-x-auto rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4 text-sm text-[var(--text)]"
                    dangerouslySetInnerHTML={{ __html: member.signatureHtml }}
                />
            ) : member.signature ? (
                <pre className="overflow-x-auto rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-3 text-sm text-[var(--text)]">
                    <code>{member.signature}</code>
                </pre>
            ) : null}
            <div className="space-y-2 leading-relaxed">
                <p>{fallbackDoc}</p>
                {member.inheritedFrom ? (
                    <p className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-[var(--text)]">Inherited from:</span>
                        <span>{member.inheritedFrom}</span>
                    </p>
                ) : null}
            </div>
        </div>
    );
}

function MemberDetail(member: EntityMemberSummary & { prefix: MemberPrefix }): ReactElement {
    const { prefix, ...summary } = member;
    const itemIcon = MEMBER_ICONS[prefix];
    const accentClass = MEMBER_ACCENTS[prefix];
    const tags = buildTagList(summary);
    const fallbackDoc =
        summary.documentation ??
        'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';
    const anchorId = `${prefix}-${summary.id}`;

    return (
        <details
            id={anchorId}
            open
            className="group rounded-3xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-0 shadow-soft scroll-mt-28 lg:scroll-mt-32"
        >
            <MemberDetailSummary
                member={summary}
                itemIcon={itemIcon}
                accentClass={accentClass}
                tags={tags}
                anchorId={anchorId}
            />
            <MemberDetailBody member={summary} fallbackDoc={fallbackDoc} />
        </details>
    );
}

function MemberDetailGroup({
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

    return (
        <details open className="group/list space-y-4">
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-left text-[var(--text)]">
                <span className="text-xl font-semibold">{title} details</span>
                <Icon
                    icon={ChevronDown}
                    size={18}
                    className="text-subtle transition-transform group-open/list:rotate-180"
                />
            </summary>
            <div className="space-y-6">
                {items.map((item) => (
                    <MemberDetail key={item.id} {...item} prefix={prefix} />
                ))}
            </div>
        </details>
    );
}

function MemberList({
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
    const accentClass = MEMBER_ACCENTS[prefix];

    return (
        <section className="space-y-3" aria-labelledby={`${prefix}-list-heading`}>
            <h2 id={`${prefix}-list-heading`} className="text-sm font-semibold uppercase tracking-[0.35em] text-subtle">
                {title}
            </h2>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={`#${prefix}-${item.id}`}
                            className={cn(
                                'group flex items-center justify-between rounded-xl border border-border/70 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-2 text-sm text-[var(--text)] transition',
                                'hover:border-[color-mix(in_srgb,var(--accent-b)_36%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent-b)_14%,var(--surface)_86%)]'
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

export default function EntityMembersSection({
    properties,
    methods,
    typeParameters = []
}: EntityMembersSectionProps): ReactElement {
    const memberAccessLevel = useUIStore(useShallow((state: UIStore) => state.memberAccessLevel));

    const filteredProperties = useMemo(
        () => properties.filter((member) => shouldIncludeMember(member, memberAccessLevel)),
        [properties, memberAccessLevel]
    );
    const filteredMethods = useMemo(
        () => methods.filter((member) => shouldIncludeMember(member, memberAccessLevel)),
        [methods, memberAccessLevel]
    );

    const quickPanelColumns = [
        filteredProperties.length ? <MemberList key="properties" items={filteredProperties} prefix="property" /> : null,
        filteredMethods.length ? <MemberList key="methods" items={filteredMethods} prefix="method" /> : null
    ].filter(Boolean) as ReactElement[];

    const quickPanelGridColumns = quickPanelColumns.length === 2 ? 'lg:grid-cols-2' : undefined;

    return (
        <section className="space-y-12">
            {quickPanelColumns.length ? (
                <details
                    open
                    className="group rounded-3xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-6 shadow-soft"
                >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-left text-[var(--text)]">
                        <span className="text-lg font-semibold">Member overview</span>
                        <Icon
                            icon={ChevronDown}
                            size={18}
                            className="text-subtle transition-transform group-open:rotate-180"
                        />
                    </summary>
                    <div className="mt-4 space-y-5">
                        <p className="text-xs text-subtle">
                            Showing members with{' '}
                            <span className="font-semibold text-[var(--text)]">
                                {formatMemberAccessLabel(memberAccessLevel)}
                            </span>{' '}
                            visibility and higher.
                        </p>
                        <div className={cn('grid gap-4', quickPanelGridColumns)}>{quickPanelColumns}</div>
                    </div>
                </details>
            ) : null}

            <div className="space-y-12">
                <MemberDetailGroup items={typeParameters} prefix="typeParameter" />
                <MemberDetailGroup items={filteredProperties} prefix="property" />
                <MemberDetailGroup items={filteredMethods} prefix="method" />
            </div>
        </section>
    );
}
