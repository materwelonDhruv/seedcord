import { ArrowUpRight } from 'lucide-react';

import type {
    CodeRepresentation,
    CommentExample,
    CommentParagraph,
    DeprecationStatus,
    FunctionSignatureModel
} from '@/lib/docs/types';
import { formatVersionLabel } from '@/lib/docs/version';
import type { EntityTone } from '@/lib/entityMetadata';
import { getToneConfig } from '@/lib/entityMetadata';

import { cn } from '@lib/utils';
import Button from '@ui/Button';
import { Icon } from '@ui/Icon';

import { CommentExamples } from './comments/CommentExamples';
import DecoratedEntity from './DecoratedEntity';
import FunctionSignaturesInline from './functions/FunctionSignaturesInline';
import { SignatureBlock } from './signatures/SignatureBlock';
import { buildSummaryNodes } from './utils/buildSummaryNodes';
import { useActiveSignatureList } from './utils/useActiveSignatureList';

import type { ActiveSignatureListProps } from './utils/useActiveSignatureList';
import type { ReactElement, ReactNode } from 'react';

function getHeaderExamples(
    active: FunctionSignatureModel | undefined,
    summaryExamples: readonly CommentExample[] | undefined
): readonly CommentExample[] {
    if (active?.examples.length) return active.examples;
    return summaryExamples ?? [];
}

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
    deprecationStatus?: DeprecationStatus;
    tags?: readonly string[];
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

const TagPills = ({ tags }: { tags: readonly string[] }): ReactElement | null => {
    if (!tags.length) return null;

    return (
        <>
            {tags.includes('internal') ? (
                <Pill className="border-border/80 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-subtle">
                    Internal
                </Pill>
            ) : null}

            {tags.includes('decorator') ? (
                <Pill className="border-border/80 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-subtle">
                    Decorator
                </Pill>
            ) : null}
        </>
    );
};

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
    deprecationStatus = { isDeprecated: false },
    tags = [],
    summaryExamples = [],
    functionSignatures
}: EntityHeaderProps): ReactElement {
    const toneConfig = getToneConfig(tone);
    const toneStyles = toneConfig.styles;
    const ToneIcon = toneConfig.icon;
    const fn = functionSignatures ?? [];
    const ids = fn.map((s) => ({ id: s.id, anchor: (s as unknown as ActiveSignatureListProps).anchor }));
    const [activeId] = useActiveSignatureList(ids as ActiveSignatureListProps[]);
    const active = fn.find((s) => s.id === activeId) ?? fn[0];

    const headerSummary = active?.summary.length ? active.summary : summary;
    const headerExamples = getHeaderExamples(active, summaryExamples);
    const summaryNodes = buildSummaryNodes(
        headerSummary,
        'Review the generated signature below while we finish migrating full TypeDoc content into the reference UI.'
    );

    const headerContent = (
        <>
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
                            {formatVersionLabel(version)}
                        </Pill>
                    ) : null}
                    <TagPills tags={tags} />
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

            {headerExamples.length ? (
                <div className="mt-3">
                    <CommentExamples examples={headerExamples} />
                </div>
            ) : null}
        </>
    );

    return (
        <header className="min-w-0">
            <DecoratedEntity deprecationStatus={deprecationStatus}>
                <div className="space-y-4 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-soft sm:p-5">
                    {headerContent}
                </div>
            </DecoratedEntity>
        </header>
    );
}
