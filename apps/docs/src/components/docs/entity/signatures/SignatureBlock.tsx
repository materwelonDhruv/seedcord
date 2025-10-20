import type { CodeRepresentation } from '@lib/docs/types';
import type { ReactElement } from 'react';

export function SignatureBlock({ signature }: { signature: CodeRepresentation }): ReactElement {
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
            <pre className="code-scroll-content whitespace-pre-wrap text-sm text-(--text)">
                <code>{signature.text}</code>
            </pre>
        </div>
    );
}
