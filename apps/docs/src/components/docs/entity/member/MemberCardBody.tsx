'use client';

import { cn } from '@lib/utils';

import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';
import { useActiveSignature } from '../utils/useActiveSignature';

import type { EntityMemberSummary, MemberSignatureDetail } from '../types';
import type { ReactElement } from 'react';

const SIGNATURE_CONTAINER_CLASS =
    'code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-[var(--text)] md:px-3 md:py-2.5';
const OVERLOAD_LABEL_PREFIX = 'Overload';
const FALLBACK_TEXT =
    'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';

export type SignatureSelection = [string, (id: string) => void];

function SignatureSelector({
    member,
    activeSignatureId,
    onChange
}: {
    member: EntityMemberSummary;
    activeSignatureId: string;
    onChange: (id: string) => void;
}): ReactElement | null {
    if (member.signatures.length <= 1) {
        return null;
    }

    return (
        <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">Overloads</legend>
            <div className="flex flex-wrap gap-2">
                {member.signatures.map((signature, index) => {
                    const checked = signature.id === activeSignatureId;
                    const label = `${OVERLOAD_LABEL_PREFIX} ${index + 1}`;

                    return (
                        <label
                            key={signature.id}
                            className={cn(
                                'cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition',
                                checked
                                    ? 'border-[color-mix(in_srgb,var(--accent-b)_48%,var(--border))] bg-[color-mix(in_srgb,var(--accent-b)_12%,var(--surface)_88%)] text-[var(--text)]'
                                    : 'border-border/70 text-subtle hover:border-[color-mix(in_srgb,var(--accent-b)_32%,var(--border))]'
                            )}
                        >
                            <input
                                type="radio"
                                name={`${member.id}-signature`}
                                value={signature.id}
                                checked={checked}
                                onChange={() => {
                                    onChange(signature.id);
                                }}
                                className="sr-only"
                            />
                            <span>{label}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

function SignaturePanel({
    signature,
    isActive
}: {
    signature: MemberSignatureDetail;
    isActive: boolean;
}): ReactElement {
    return (
        <section
            id={signature.anchor}
            className={cn('space-y-3', isActive ? 'block' : 'hidden')}
            aria-hidden={!isActive}
        >
            <div className={SIGNATURE_CONTAINER_CLASS}>
                {signature.code.html ? (
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: signature.code.html }} />
                ) : (
                    <pre className="code-scroll-content whitespace-pre text-sm text-[var(--text)]">
                        <code>{signature.code.text}</code>
                    </pre>
                )}
            </div>
            {signature.documentation.length ? <CommentParagraphs paragraphs={signature.documentation} /> : null}
            {signature.examples.length ? <CommentExamples examples={signature.examples} /> : null}
        </section>
    );
}

export function MemberCardBody({ member }: { member: EntityMemberSummary }): ReactElement {
    const [activeSignatureId, setActiveSignatureId] = useActiveSignature(member);
    const hasSharedDocumentation = member.sharedDocumentation.length > 0;
    const hasSharedExamples = member.sharedExamples.length > 0;
    const signaturesHaveContent = member.signatures.some(
        (signature) => signature.documentation.length > 0 || signature.examples.length > 0
    );
    const showFallback = !hasSharedDocumentation && !hasSharedExamples && !signaturesHaveContent;

    return (
        <div className="mt-4 min-w-0 space-y-4 text-sm text-subtle">
            <SignatureSelector member={member} activeSignatureId={activeSignatureId} onChange={setActiveSignatureId} />
            {hasSharedDocumentation ? <CommentParagraphs paragraphs={member.sharedDocumentation} /> : null}
            {hasSharedExamples ? <CommentExamples examples={member.sharedExamples} /> : null}
            {member.signatures.map((signature, index) => (
                <SignaturePanel
                    key={signature.id}
                    signature={signature}
                    isActive={signature.id === activeSignatureId || (!activeSignatureId && index === 0)}
                />
            ))}
            {showFallback ? <p>{FALLBACK_TEXT}</p> : null}
            {member.inheritedFrom ? (
                <p className="flex flex-wrap items-baseline gap-2 text-subtle">
                    <span className="font-semibold text-[var(--text)]">Inherited from:</span>
                    <span>{member.inheritedFrom}</span>
                </p>
            ) : null}
        </div>
    );
}
