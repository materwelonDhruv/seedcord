'use client';

import { ClipboardCheck, ClipboardCopy } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { formatEntityKindLabel, ENTITY_TONE_STYLES, resolveEntityTone } from '@lib/entity-metadata';
import { log } from '@lib/logger';
import { cn } from '@lib/utils';
import Button from '@ui/button';
import { Icon } from '@ui/icon';

import type { EntityTone } from '@lib/entity-metadata';
import type { ReactElement } from 'react';

type ToneStyles = (typeof ENTITY_TONE_STYLES)[EntityTone];

const COPY_RESET_DELAY_MS = 2000;

interface SignatureSectionProps {
    kind: string;
    pkg: string;
    signature: string;
    signatureHtml: string | null;
    importLine: string;
    importHtml: string | null;
    symbolName: string;
}

function inferToneFromSymbol(symbolName?: string | null): EntityTone | null {
    if (!symbolName) {
        return null;
    }

    if (/^[A-Z0-9_]+$/.test(symbolName)) {
        return 'variable';
    }

    if (/(Enum|Status|Mode|Level|State)$/u.test(symbolName)) {
        return 'enum';
    }

    if (/(Options|Config|Params|Context|Metadata)$/u.test(symbolName)) {
        return 'interface';
    }

    if (/(Hook|Schema|Result|Payload|Type)$/u.test(symbolName)) {
        return 'type';
    }

    if (/^use[A-Z]/u.test(symbolName) || /^[a-z]/u.test(symbolName)) {
        return 'function';
    }

    return null;
}

export function useEntityTone(kind: string, symbolName?: string): { tone: EntityTone; badgeLabel: string } {
    const tone = useMemo(() => {
        const resolved = resolveEntityTone(kind);

        if (kind && resolved !== 'class') {
            return resolved;
        }

        return inferToneFromSymbol(symbolName) ?? resolved;
    }, [kind, symbolName]);

    const badgeLabel = useMemo(() => formatEntityKindLabel(tone), [tone]);

    return { tone, badgeLabel };
}

interface SignatureCopyButtonProps {
    ariaLabel: string;
    copied: boolean;
    defaultLabel: string;
    icon: ReactElement;
    onClick: () => void;
}

function SignatureCopyButton({
    ariaLabel,
    copied,
    defaultLabel,
    icon,
    onClick
}: SignatureCopyButtonProps): ReactElement {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => void onClick()}
            className="min-w-0 justify-between"
            aria-label={ariaLabel}
        >
            <span>{copied ? 'Copied!' : defaultLabel}</span>
            {icon}
        </Button>
    );
}

interface SignatureHeaderProps {
    hasCopiedSignature: boolean;
    onCopySignature: () => void;
}

function SignatureHeader({ hasCopiedSignature, onCopySignature }: SignatureHeaderProps): ReactElement {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[var(--text)]">Signature preview</h2>
            <SignatureCopyButton
                ariaLabel="Copy placeholder signature"
                copied={hasCopiedSignature}
                defaultLabel="Copy signature"
                icon={<Icon icon={hasCopiedSignature ? ClipboardCheck : ClipboardCopy} size={18} />}
                onClick={() => {
                    void onCopySignature();
                }}
            />
        </div>
    );
}

interface SignaturePreviewProps {
    signature: string;
    signatureHtml: string | null;
}

function SignaturePreview({ signature, signatureHtml }: SignaturePreviewProps): ReactElement {
    if (signatureHtml) {
        return (
            <div
                className="overflow-x-auto rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
            />
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]">
            <pre className="p-4 text-sm text-[var(--text)]">
                <code>{signature}</code>
            </pre>
        </div>
    );
}

interface ImportSectionProps {
    hasCopiedImport: boolean;
    importHtml: string | null;
    importLine: string;
    onCopyImport: () => void;
}

function ImportSection({ hasCopiedImport, importHtml, importLine, onCopyImport }: ImportSectionProps): ReactElement {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[var(--text)]">Import snippet</h3>
                    <p className="text-xs text-subtle">Use this placeholder until symbols pipe through real data.</p>
                </div>
                <SignatureCopyButton
                    ariaLabel="Copy placeholder import"
                    copied={hasCopiedImport}
                    defaultLabel="Copy import"
                    icon={<Icon icon={hasCopiedImport ? ClipboardCheck : ClipboardCopy} size={18} />}
                    onClick={() => {
                        void onCopyImport();
                    }}
                />
            </div>
            {importHtml ? (
                <div
                    className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-3 py-2 text-sm text-[var(--text)]"
                    dangerouslySetInnerHTML={{ __html: importHtml }}
                />
            ) : (
                <code className="block rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-3 py-2 text-sm text-[var(--text)]">
                    {importLine}
                </code>
            )}
        </div>
    );
}

interface SignatureMetaProps {
    badgeLabel: string;
    pkg: string;
    toneStyles: ToneStyles;
}

function SignatureMeta({ badgeLabel, pkg, toneStyles }: SignatureMetaProps): ReactElement {
    return (
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-subtle">
            <span className={cn('font-semibold', toneStyles.accent)}>{badgeLabel}</span>
            <span className={cn('font-semibold', toneStyles.accent)}>Package: {pkg}</span>
        </div>
    );
}

export function SignatureSection({
    kind,
    pkg,
    signature,
    signatureHtml,
    importLine,
    importHtml,
    symbolName
}: SignatureSectionProps): ReactElement {
    const { tone, badgeLabel } = useEntityTone(kind, symbolName);
    const toneStyles = ENTITY_TONE_STYLES[tone];
    const [hasCopiedSignature, setHasCopiedSignature] = useState(false);
    const [hasCopiedImport, setHasCopiedImport] = useState(false);

    const handleCopy = useCallback(async (value: string, type: 'signature' | 'import'): Promise<void> => {
        try {
            await navigator.clipboard.writeText(value);
            log('Copied placeholder text', { type, value });

            if (type === 'signature') {
                setHasCopiedSignature(true);
                setTimeout(() => setHasCopiedSignature(false), COPY_RESET_DELAY_MS);
            } else {
                setHasCopiedImport(true);
                setTimeout(() => setHasCopiedImport(false), COPY_RESET_DELAY_MS);
            }
        } catch (error) {
            log('Failed to copy placeholder text', error);
        }
    }, []);

    return (
        <section className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <SignatureHeader
                hasCopiedSignature={hasCopiedSignature}
                onCopySignature={() => {
                    void handleCopy(signature, 'signature');
                }}
            />
            <SignaturePreview signature={signature} signatureHtml={signatureHtml} />
            <ImportSection
                hasCopiedImport={hasCopiedImport}
                importHtml={importHtml}
                importLine={importLine}
                onCopyImport={() => {
                    void handleCopy(importLine, 'import');
                }}
            />
            <p className="text-xs text-subtle">
                Code examples are currently placeholder content. The highlighted snippets will switch to generated
                TypeDoc data once the extraction pipeline is connected.
            </p>
            <SignatureMeta badgeLabel={badgeLabel} pkg={pkg} toneStyles={toneStyles} />
        </section>
    );
}
