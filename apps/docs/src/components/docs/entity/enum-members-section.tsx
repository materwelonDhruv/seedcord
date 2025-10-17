import { Code } from 'lucide-react';

import { cn } from '@lib/utils';
import { Icon } from '@ui/icon';

import type { EnumMemberModel } from '@lib/docs/entities';
import type { ReactElement } from 'react';

interface EnumMembersSectionProps {
    members: readonly EnumMemberModel[];
}

function EnumMemberCard({ member }: { member: EnumMemberModel }): ReactElement {
    const anchorId = `enum-member-${member.id}`;
    const hasSummary = member.summary.length > 0;

    return (
        <article
            id={anchorId}
            className="space-y-3 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft sm:p-5"
        >
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[var(--text)]">{member.label}</h3>
                    {member.value ? (
                        <code className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-1 text-xs text-subtle">
                            <span className="font-semibold text-[color-mix(in_srgb,var(--entity-enum-color)_68%,var(--text))]">
                                Value:
                            </span>
                            <span>{member.value}</span>
                        </code>
                    ) : null}
                </div>
                {member.sourceUrl ? (
                    <a
                        href={member.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_48%,var(--text))]"
                        aria-label={`Open source for ${member.label} in a new tab`}
                    >
                        <Icon icon={Code} size={16} />
                    </a>
                ) : null}
            </header>
            {member.signature.html ? (
                <div className="code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm">
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: member.signature.html }} />
                </div>
            ) : member.signature.text ? (
                <div className="code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm">
                    <pre className="code-scroll-content whitespace-pre leading-relaxed">
                        <code>{member.signature.text}</code>
                    </pre>
                </div>
            ) : null}
            {hasSummary ? (
                <div className="space-y-2 text-sm leading-relaxed text-subtle">
                    {member.summary.map((paragraph) => (
                        <p key={paragraph} className="min-w-0">
                            {paragraph}
                        </p>
                    ))}
                </div>
            ) : null}
        </article>
    );
}

export function EnumMembersSection({ members }: EnumMembersSectionProps): ReactElement | null {
    if (!members.length) {
        return null;
    }

    return (
        <section className="space-y-4">
            <header className="space-y-1">
                <h2 className="text-xl font-semibold text-[color-mix(in_srgb,var(--entity-enum-color)_72%,var(--text))]">
                    Enumeration members
                </h2>
                <p className="text-sm text-subtle">
                    Each constant is generated from the TypeDoc manifest. Values mirror the runtime implementation.
                </p>
            </header>
            <div className={cn('grid gap-4', members.length > 1 ? 'lg:grid-cols-2' : undefined)}>
                {members.map((member) => (
                    <EnumMemberCard key={member.id} member={member} />
                ))}
            </div>
        </section>
    );
}
