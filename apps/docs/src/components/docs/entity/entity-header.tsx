import { Github } from 'lucide-react';

import { Icon } from '@components/ui/icon';
import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@lib/entity-metadata';
import { cn } from '@lib/utils';

import type { EntityTone } from '@lib/entity-metadata';
import type { ReactElement } from 'react';

interface EntityHeaderProps {
    badgeLabel: string;
    pkg: string;
    symbolName: string;
    tone: EntityTone;
    signature: string;
    signatureHtml: string | null;
    sourceUrl?: string | null;
}

function SignatureBlock({
    signature,
    signatureHtml
}: {
    signature: string;
    signatureHtml: string | null;
}): ReactElement {
    const containerClassName =
        'overflow-x-auto rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-3 text-sm text-[var(--text)] shadow-soft';

    if (signatureHtml) {
        return <div className={containerClassName} dangerouslySetInnerHTML={{ __html: signatureHtml }} />;
    }

    return (
        <div className={containerClassName}>
            <pre className="whitespace-pre-wrap text-sm text-[var(--text)]">
                <code>{signature}</code>
            </pre>
        </div>
    );
}

export function EntityHeader({
    badgeLabel,
    pkg,
    signature,
    signatureHtml,
    symbolName,
    tone,
    sourceUrl
}: EntityHeaderProps): ReactElement {
    const toneStyles = ENTITY_TONE_STYLES[tone];
    const ToneIcon = ENTITY_KIND_ICONS[tone];

    return (
        <header className="space-y-5 rounded-3xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-6 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                                toneStyles.badge
                            )}
                        >
                            <Icon icon={ToneIcon} size={16} />
                            {badgeLabel}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-subtle">
                            {pkg}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-[var(--text)] lg:text-4xl">{symbolName}</h1>
                        <p className="text-sm leading-relaxed text-subtle">
                            Rich TypeDoc summaries are on the roadmap. Until then, review the exported signature below
                            and use the command palette to deep-dive into related members and packages.
                        </p>
                    </div>
                </div>
                {sourceUrl ? (
                    <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-3 text-subtle transition hover:border-[color-mix(in_srgb,var(--text)_18%,var(--border))] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2"
                        aria-label="View source on GitHub"
                    >
                        <Icon icon={Github} size={20} />
                    </a>
                ) : null}
            </div>
            <SignatureBlock signature={signature} signatureHtml={signatureHtml} />
        </header>
    );
}

interface EntityFooterProps {
    tone: EntityTone;
}

export function EntityFooter({ tone }: EntityFooterProps): ReactElement {
    const toneStyles = ENTITY_TONE_STYLES[tone];

    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] px-6 py-4 text-sm text-subtle shadow-soft">
            <span>Looking for more? Use the command palette (⌘K / Ctrl+K) to jump to other symbols.</span>
            <a
                href="/docs"
                className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2',
                    toneStyles.badge
                )}
            >
                Back to packages<span aria-hidden>→</span>
            </a>
        </footer>
    );
}
