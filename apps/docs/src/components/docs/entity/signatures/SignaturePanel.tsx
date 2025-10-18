import type { DeprecationStatus } from '@/lib/docs/types';

import { cn } from '../../../../lib/utils';
import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';
import DecoratedEntity from '../DecoratedEntity';

import type { MemberSignatureDetail } from '../types';
import type { ReactElement } from 'react';

export const SIGNATURE_CONTAINER_CLASS =
    'code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2.5 py-2 text-[var(--text)] md:px-3 md:py-2.5';

export function SignaturePanel({
    signature,
    isActive,
    parentDeprecationStatus
}: {
    signature: MemberSignatureDetail;
    isActive: boolean;
    parentDeprecationStatus?: DeprecationStatus | undefined;
}): ReactElement {
    const section = (
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

    function deprecationMessageKey(ds?: DeprecationStatus): string | null {
        if (!ds?.isDeprecated) return null;
        if (!ds.deprecationMessage) return '__NONE__';
        return ds.deprecationMessage.map((p) => p.plain).join('\n');
    }

    const parentKey = deprecationMessageKey(parentDeprecationStatus);
    const sigKey = deprecationMessageKey(signature.deprecationStatus);

    // Only decorate when:
    // - the signature is active (visible),
    // - the signature is deprecated,
    // - the parent is NOT deprecated,
    // - and the parent's deprecation message is not equal to the signature's.
    const shouldDecorate =
        Boolean(isActive) &&
        Boolean(signature.deprecationStatus?.isDeprecated) &&
        !Boolean(parentDeprecationStatus?.isDeprecated) &&
        parentKey !== sigKey;

    if (shouldDecorate) {
        return (
            <DecoratedEntity
                deprecationStatus={signature.deprecationStatus ?? { isDeprecated: true, deprecationMessage: undefined }}
            >
                {section}
            </DecoratedEntity>
        );
    }

    return section;
}
