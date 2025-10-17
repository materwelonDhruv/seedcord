import { ArrowUpRight } from 'lucide-react';

import type { CommentParagraph, CodeRepresentation, CommentExample, FunctionSignatureModel } from '@/lib/docs/types';
import type { EntityTone } from '@/lib/entityMetadata';
import { getToneConfig } from '@/lib/entityMetadata';

import { cn } from '@lib/utils';
import Button from '@ui/Button';
import { Icon } from '@ui/Icon';

import { CommentExamples } from './comments/CommentExamples';
import FunctionSignaturesInline from './functions/FunctionSignaturesInline';
import { SignatureBlock } from './signatures/SignatureBlock';
import { buildSummaryNodes } from './utils/buildSummaryNodes';
import { useActiveSignatureList } from './utils/useActiveSignatureList';

import type { ReactElement, ReactNode } from 'react';

interface EntityHeaderProps {
    badgeLabel: string;
    pkg: string;
    symbolName: string;
    tone: EntityTone;
    signature: CodeRepresentation;
    functionSignatures?: readonly FunctionSignatureModel[];
    summary: readonly CommentParagraph[];
    summaryExamples?: readonly CommentExample[];
    sourceUrl?: string | null;
    version?: string;
    isDeprecated?: boolean;
}

const Pill = ({ className, children }: { className?: string; children: ReactNode }): ReactElement => (
    <span
        className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            className
        )}
    >
        {children}
    </span>
);

const SourceButton = ({ href }: { href: string }): ReactElement => (
    <Button
        asChild
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl border border-border/80 text-subtle transition hover:text-[var(--text)]"
        aria-label="Open source in a new tab"
    >
        <a href={href} target="_blank" rel="noreferrer noopener">
            <Icon icon={ArrowUpRight} size={18} />
        </a>
    </Button>
);

export function EntityHeader({
    badgeLabel,
    pkg,
    signature,
    summary,
    symbolName,
    tone,
    sourceUrl,
    version,
    isDeprecated = false,
    summaryExamples = [],
    functionSignatures
}: EntityHeaderProps): ReactElement {
    const toneConfig = getToneConfig(tone);
    const toneStyles = toneConfig.styles;
    const ToneIcon = toneConfig.icon;
    const fn = functionSignatures ?? [];
    const ids = fn.map((s) => ({ id: s.id, anchor: (s as unknown as { anchor?: string }).anchor }));
    const [activeId] = useActiveSignatureList(ids as { id: string; anchor?: string }[]);
    const active = fn.find((s) => s.id === activeId) ?? fn[0];

    // Prefer the active signature's summary (if present) for the header lead.
    const headerSummary = active?.summary.length ? active.summary : summary;
    const summaryNodes = buildSummaryNodes(
        headerSummary,
        'Review the generated signature below while we finish migrating full TypeDoc content into the reference UI.'
    );

    return (
        <header className="min-w-0 space-y-4 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-soft sm:p-5">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <Pill className={toneStyles.badge}>
                        <Icon icon={ToneIcon} size={16} />
                        {badgeLabel}
                    </Pill>
                    <Pill className="border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] text-subtle">
                        {pkg}
                    </Pill>
                    {version ? (
                        <Pill className="border-border/80 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-subtle">
                            v{version}
                        </Pill>
                    ) : null}
                    {isDeprecated ? (
                        <Pill className="border-[color-mix(in_srgb,var(--entity-variable-color)_48%,transparent)] bg-[color-mix(in_srgb,var(--entity-variable-color)_12%,transparent)] text-[color-mix(in_srgb,var(--entity-variable-color)_72%,var(--text))]">
                            Deprecated
                        </Pill>
                    ) : null}
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1 space-y-2.5">
                        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl lg:text-4xl">{symbolName}</h1>
                        <div className="space-y-2 text-sm leading-relaxed text-subtle">{summaryNodes}</div>
                    </div>
                    {sourceUrl ? <SourceButton href={sourceUrl} /> : null}
                </div>
            </div>

            <SignatureBlock signature={active ? active.code : signature} />

            {fn.length ? (
                <div className="mt-3">
                    <FunctionSignaturesInline signatures={fn} />
                </div>
            ) : null}

            {summaryExamples.length ? (
                <div className="mt-3">
                    <CommentExamples examples={summaryExamples} />
                </div>
            ) : null}
        </header>
    );
}
