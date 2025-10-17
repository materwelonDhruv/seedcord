import { ArrowUpRight } from 'lucide-react';

import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@lib/entity-metadata';
import { cn } from '@lib/utils';
import Button from '@ui/button';
import { Icon } from '@ui/icon';

import type { CommentParagraph } from '@lib/docs/comment-format';
import type { CodeRepresentation } from '@lib/docs/formatting';
import type { EntityTone } from '@lib/entity-metadata';
import type { ReactElement } from 'react';

interface EntityHeaderProps {
    badgeLabel: string;
    pkg: string;
    symbolName: string;
    tone: EntityTone;
    signature: CodeRepresentation;
    summary: readonly CommentParagraph[];
    sourceUrl?: string | null;
    version?: string;
    isDeprecated?: boolean;
}

const renderParagraphNode = (paragraph: CommentParagraph, key: string): ReactElement =>
    paragraph.html ? (
        <p key={key} dangerouslySetInnerHTML={{ __html: paragraph.html }} />
    ) : (
        <p key={key}>{paragraph.plain}</p>
    );

const buildSummaryNodes = (paragraphs: readonly CommentParagraph[], fallback: string): ReactElement[] => {
    const entries = paragraphs.filter((paragraph) => paragraph.html || paragraph.plain);
    const [lead, ...rest] = entries;

    const content: ReactElement[] = [];

    if (lead) {
        content.push(renderParagraphNode(lead, lead.html || lead.plain || 'summary-lead'));
    } else {
        content.push(
            renderParagraphNode({ plain: fallback, html: fallback } satisfies CommentParagraph, 'summary-fallback')
        );
    }

    rest.forEach((paragraph, index) => {
        content.push(renderParagraphNode(paragraph, paragraph.html || paragraph.plain || `summary-${index}`));
    });

    return content;
};

function SignatureBlock({ signature }: { signature: CodeRepresentation }): ReactElement {
    const containerClassName =
        'code-scroll-area rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-sm text-[var(--text)] shadow-soft md:px-3 md:py-2.5';

    if (signature.html) {
        return (
            <div className={containerClassName}>
                <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: signature.html }} />
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            <pre className="code-scroll-content whitespace-pre-wrap text-sm text-[var(--text)]">
                <code>{signature.text}</code>
            </pre>
        </div>
    );
}

export function EntityHeader({
    badgeLabel,
    pkg,
    signature,
    summary,
    symbolName,
    tone,
    sourceUrl,
    version,
    isDeprecated = false
}: EntityHeaderProps): ReactElement {
    const toneStyles = ENTITY_TONE_STYLES[tone];
    const ToneIcon = ENTITY_KIND_ICONS[tone];
    const fallbackDescription =
        'Review the generated signature below while we finish migrating full TypeDoc content into the reference UI.';
    const summaryNodes = buildSummaryNodes(summary, fallbackDescription);

    return (
        <header className="min-w-0 space-y-4 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-soft sm:p-5">
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
                    {version ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-subtle">
                            v{version}
                        </span>
                    ) : null}
                    {isDeprecated ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--entity-variable-color)_48%,transparent)] bg-[color-mix(in_srgb,var(--entity-variable-color)_12%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--entity-variable-color)_72%,var(--text))]">
                            Deprecated
                        </span>
                    ) : null}
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1 space-y-2.5">
                        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl lg:text-4xl">{symbolName}</h1>
                        <div className="space-y-2 text-sm leading-relaxed text-subtle">{summaryNodes}</div>
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
            <SignatureBlock signature={signature} />
        </header>
    );
}
