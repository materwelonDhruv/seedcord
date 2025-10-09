'use client';

import Link from 'next/link';

import type { ReactElement } from 'react';

interface MemberSummary {
    id: string;
    label: string;
    description: string;
    signature?: string;
    documentation?: string;
    inheritedFrom?: string;
    tags?: readonly string[];
}

interface EntityMembersSectionProps {
    properties: readonly MemberSummary[];
    methods: readonly MemberSummary[];
}

function MemberList({
    items,
    title,
    prefix
}: {
    items: readonly MemberSummary[];
    title: string;
    prefix: 'property' | 'method';
}): ReactElement {
    return (
        <section className="space-y-3" aria-labelledby={`${prefix}-list-heading`}>
            <div className="flex items-center justify-between gap-3">
                <h2
                    id={`${prefix}-list-heading`}
                    className="text-sm font-semibold uppercase tracking-[0.35em] text-subtle"
                >
                    {title}
                </h2>
            </div>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={`#${prefix}-${item.id}`}
                            className="group flex items-center justify-start gap-3 rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-soft transition duration-0 hover:border-[color-mix(in_srgb,var(--accent-b)_38%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent-b)_18%,var(--surface)_82%)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_75%,var(--border))] focus-visible:outline-offset-2"
                        >
                            <span className="truncate transition group-hover:text-[color-mix(in_srgb,var(--text)_78%,var(--accent-b)_22%)]">
                                {item.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function MemberDetail({
    id,
    label,
    description,
    signature,
    documentation,
    inheritedFrom,
    tags,
    prefix
}: MemberSummary & { prefix: 'property' | 'method' }): ReactElement {
    const fallbackDoc =
        documentation ??
        'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';

    return (
        <article
            id={`${prefix}-${id}`}
            className="space-y-4 rounded-3xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-6 shadow-soft scroll-mt-28 lg:scroll-mt-32"
        >
            <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-[var(--text)]">{label}</h3>
                    {tags?.length ? (
                        <ul className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-subtle">
                            {tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-2 py-1 font-semibold"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
                <p className="text-sm text-subtle">{description}</p>
            </header>
            {signature ? (
                <pre className="overflow-x-auto rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-3 text-sm text-[var(--text)]">
                    <code>{signature}</code>
                </pre>
            ) : null}
            <div className="space-y-2 text-sm leading-relaxed text-subtle">
                <p>{fallbackDoc}</p>
                {inheritedFrom ? (
                    <p>
                        <span className="font-semibold text-[var(--text)]">Inherited from:</span> {inheritedFrom}
                    </p>
                ) : null}
            </div>
        </article>
    );
}

export default function EntityMembersSection({ properties, methods }: EntityMembersSectionProps): ReactElement {
    return (
        <section className="space-y-12">
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <MemberList items={properties} title="Properties" prefix="property" />
                </div>
                <div>
                    <MemberList items={methods} title="Methods" prefix="method" />
                </div>
            </div>
            <div className="space-y-12">
                <section className="space-y-6" aria-labelledby="property-details-heading">
                    <h2 id="property-details-heading" className="text-2xl font-semibold text-[var(--text)]">
                        Property details
                    </h2>
                    <div className="space-y-6">
                        {properties.map((item) => (
                            <MemberDetail key={item.id} {...item} prefix="property" />
                        ))}
                    </div>
                </section>
                <section className="space-y-6" aria-labelledby="method-details-heading">
                    <h2 id="method-details-heading" className="text-2xl font-semibold text-[var(--text)]">
                        Method details
                    </h2>
                    <div className="space-y-6">
                        {methods.map((item) => (
                            <MemberDetail key={item.id} {...item} prefix="method" />
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}
