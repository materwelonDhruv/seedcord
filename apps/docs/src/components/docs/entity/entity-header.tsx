import { ArrowUpRight } from 'lucide-react';

import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@lib/entity-metadata';
import { cn } from '@lib/utils';
import Button from '@ui/button';
import { Icon } from '@ui/icon';

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
        'overflow-x-auto rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-sm text-[var(--text)] shadow-soft md:px-3 md:py-2.5';

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
        <header className="space-y-4 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-soft sm:p-5">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
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
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1 space-y-2.5">
                        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl lg:text-4xl">{symbolName}</h1>
                        <p className="text-sm leading-relaxed text-subtle">
                            Rich TypeDoc summaries are on the roadmap. Until then, review the exported signature below
                            and use the command palette to deep-dive into related members and packages.
                        </p>
                    </div>
                    {sourceUrl ? (
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-xl border border-border/80 text-subtle transition hover:text-[var(--text)]"
                            aria-label="Open source in a new tab"
                        >
                            <a href={sourceUrl} target="_blank" rel="noreferrer noopener">
                                <Icon icon={ArrowUpRight} size={18} />
                            </a>
                        </Button>
                    ) : null}
                </div>
            </div>
            <SignatureBlock signature={signature} signatureHtml={signatureHtml} />
        </header>
    );
}
