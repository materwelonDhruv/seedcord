import { cn } from '@lib/utils';

import type { CodeRepresentation } from '@lib/docs/types';
import type { ReactElement } from 'react';

interface CodePanelProps {
    representation: CodeRepresentation;
    title?: string;
    description?: string;
    className?: string;
}

const CODE_CONTAINER_CLASS = 'code-scroll-area panel px-3 py-2 text-sm text-(--text) sm:px-4 sm:py-3';

function CodePanel({ representation, title, description, className }: CodePanelProps): ReactElement {
    return (
        <section className={cn('card bg-surface-98 p-4 shadow-soft sm:p-5 space-y-3', className)}>
            {title ? (
                <header className="space-y-1">
                    <h2 className="text-lg font-semibold text-(--text)">{title}</h2>
                    {description ? <p className="text-xs text-subtle">{description}</p> : null}
                </header>
            ) : description ? (
                <p className="text-xs text-subtle">{description}</p>
            ) : null}
            {representation.html ? (
                <div className={CODE_CONTAINER_CLASS}>
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: representation.html }} />
                </div>
            ) : (
                <div className={CODE_CONTAINER_CLASS}>
                    <pre className="code-scroll-content whitespace-pre leading-relaxed">
                        <code>{representation.text}</code>
                    </pre>
                </div>
            )}
        </section>
    );
}

export default CodePanel;
