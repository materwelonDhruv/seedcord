'use client';

import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';
import { SignaturePanel } from '../signatures/SignaturePanel';
import SignatureSelector from '../signatures/SignatureSelector';
import { useActiveSignature } from '../utils/useActiveSignature';

import type { EntityMemberSummary } from '../types';
import type { DeprecationStatus } from '@lib/docs/types';
import type { ReactElement } from 'react';

const FALLBACK_TEXT =
    'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';

export type SignatureSelection = [string, (id: string) => void];

export function MemberCardBody({
    member,
    parentDeprecationStatus
}: {
    member: EntityMemberSummary;
    parentDeprecationStatus?: DeprecationStatus | undefined;
}): ReactElement {
    const [activeSignatureId, setActiveSignatureId] = useActiveSignature(member);
    const hasSharedDocumentation = member.sharedDocumentation.length > 0;
    const hasSharedExamples = member.sharedExamples.length > 0;
    const signaturesHaveContent = member.signatures.some(
        (signature) => signature.documentation.length > 0 || signature.examples.length > 0
    );
    const showFallback = !hasSharedDocumentation && !hasSharedExamples && !signaturesHaveContent;

    return (
        <div className="mt-4 min-w-0 space-y-4 text-sm text-subtle">
            <SignatureSelector
                signatures={member.signatures}
                activeSignatureId={activeSignatureId}
                onChange={setActiveSignatureId}
            />
            {hasSharedDocumentation ? <CommentParagraphs paragraphs={member.sharedDocumentation} /> : null}
            {member.signatures.map((signature, index) => (
                <SignaturePanel
                    key={signature.id}
                    signature={signature}
                    isActive={signature.id === activeSignatureId || (!activeSignatureId && index === 0)}
                    parentDeprecationStatus={parentDeprecationStatus ?? member.deprecationStatus}
                />
            ))}
            {hasSharedExamples ? <CommentExamples examples={member.sharedExamples} /> : null}
            {showFallback ? <p>{FALLBACK_TEXT}</p> : null}
            {member.inheritedFrom ? (
                <p className="flex flex-wrap items-baseline gap-2 text-subtle">
                    <span className="font-semibold text-[var(--text)]">Inherited from:</span>
                    {typeof member.inheritedFrom === 'string' ? (
                        <span>{member.inheritedFrom}</span>
                    ) : member.inheritedFrom.href ? (
                        <a href={member.inheritedFrom.href} className="link underline">
                            {member.inheritedFrom.name}
                        </a>
                    ) : (
                        <span>{member.inheritedFrom.name}</span>
                    )}
                </p>
            ) : null}
        </div>
    );
}
