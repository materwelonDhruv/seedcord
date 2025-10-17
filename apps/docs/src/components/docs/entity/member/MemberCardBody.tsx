'use client';

import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';
import { SignaturePanel } from '../signatures/SignaturePanel';
import SignatureSelector from '../signatures/SignatureSelector';
import { useActiveSignature } from '../utils/useActiveSignature';

import type { EntityMemberSummary } from '../types';
import type { ReactElement } from 'react';

const FALLBACK_TEXT =
    'Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts.';

export type SignatureSelection = [string, (id: string) => void];

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
            <SignatureSelector
                signatures={member.signatures}
                activeSignatureId={activeSignatureId}
                onChange={setActiveSignatureId}
            />
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
