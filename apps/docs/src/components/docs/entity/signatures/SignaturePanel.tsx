import { cn } from '../../../../lib/utils';
import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';

import type { MemberSignatureDetail } from '../types';
import type { ReactElement } from 'react';

export const SIGNATURE_CONTAINER_CLASS =
    'code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-[var(--text)] md:px-3 md:py-2.5';

export function SignaturePanel({
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
