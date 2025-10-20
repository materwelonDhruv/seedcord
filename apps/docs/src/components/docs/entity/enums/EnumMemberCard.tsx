import { Code } from 'lucide-react';

import { CopyAnchorButton } from '@ui/CopyAnchorButton';
import { Icon } from '@ui/Icon';

import { CommentParagraphs } from '../comments/CommentParagraphs';
import DeprecatedEntity from '../DeprecatedEntity';

import type { DeprecationStatus, EnumMemberModel } from '@lib/docs/types';
import type { ReactElement } from 'react';

function SignatureCell({
    label,
    signatureHtml,
    signatureText,
    value,
    showValueAfterSignature
}: {
    label: string;
    signatureHtml: string | null;
    signatureText: string;
    value: string | undefined;
    showValueAfterSignature: boolean;
}): ReactElement {
    const withHtml = (
        <div className="text-sm text-subtle flex items-center gap-2">
            <div className="shiki-inline-wrapper truncate" dangerouslySetInnerHTML={{ __html: signatureHtml ?? '' }} />
            {showValueAfterSignature ? <code className="font-mono truncate">= {value}</code> : null}
        </div>
    );

    const withValue = (
        <div className="truncate text-sm text-subtle">
            <code className="font-mono truncate">
                {label} = {value}
            </code>
        </div>
    );

    const plain = (
        <div className="truncate text-sm text-subtle">
            <code className="font-mono truncate">{label}</code>
        </div>
    );

    if (signatureHtml) return withHtml;
    if (value !== undefined && !signatureText.includes(String(value))) return withValue;
    return plain;
}

function ActionsCell({
    anchorId,
    label,
    sourceUrl
}: {
    anchorId: string;
    label: string;
    sourceUrl: string | undefined;
}): ReactElement {
    return (
        <div className="ml-auto flex h-8 w-[4.5rem] shrink-0 items-center justify-end gap-2 pl-2">
            <CopyAnchorButton
                anchorId={anchorId}
                label={label}
                className="h-8 w-8 opacity-0 transition-opacity duration-150 group-hover/name:opacity-100"
            />
            {sourceUrl ? (
                <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-8 w-8 items-center justify-center text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_48%,var(--text))]"
                    aria-label={`Open source for ${label} in a new tab`}
                >
                    <Icon icon={Code} size={16} />
                </a>
            ) : null}
        </div>
    );
}

export function EnumMemberCard({ member }: { member: EnumMemberModel }): ReactElement {
    const anchorId = `enum-member-${member.id}`;
    const hasSummary = member.summary.length > 0;

    const deprecationStatus: DeprecationStatus | undefined = member.deprecationStatus;

    return (
        <article id={anchorId} className="group/name relative min-w-0">
            <DeprecatedEntity deprecationStatus={deprecationStatus}>
                <div className="group/name relative min-w-0 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="group/name relative flex min-w-0 items-center">
                                <div className="min-w-0">
                                    <SignatureCell
                                        label={member.label}
                                        signatureHtml={member.signature.html}
                                        signatureText={member.signature.text}
                                        value={member.value}
                                        showValueAfterSignature={
                                            member.value !== undefined &&
                                            !member.signature.text.includes(String(member.value))
                                        }
                                    />
                                </div>
                                <ActionsCell anchorId={anchorId} label={member.label} sourceUrl={member.sourceUrl} />
                            </div>
                        </div>
                    </div>
                    {hasSummary ? <CommentParagraphs paragraphs={member.summary} className="mt-2 space-y-0" /> : null}
                </div>
            </DeprecatedEntity>
        </article>
    );
}
