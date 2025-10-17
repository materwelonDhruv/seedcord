import type { CommentExample } from '@/lib/docs/types';

import { cn } from '@lib/utils';

import type { ReactElement } from 'react';

interface CommentExamplesProps {
    examples: readonly CommentExample[];
    className?: string;
}

const codeContainerClass =
    'code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm';

export function CommentExamples({ examples, className }: CommentExamplesProps): ReactElement | null {
    if (!examples.length) {
        return null;
    }

    return (
        <div className={cn('space-y-3', className)}>
            {examples.map((example, index) => {
                const representation = example.code;
                const key = example.caption ?? representation.html ?? `example-${index}`;

                return (
                    <figure key={key} className="space-y-1">
                        {example.caption ? (
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.08em] text-subtle">
                                {example.caption}
                            </figcaption>
                        ) : null}
                        <div className={codeContainerClass}>
                            {representation.html ? (
                                <div
                                    className="code-scroll-content"
                                    dangerouslySetInnerHTML={{ __html: representation.html }}
                                />
                            ) : (
                                <pre className="code-scroll-content whitespace-pre leading-relaxed">
                                    <code>{representation.text}</code>
                                </pre>
                            )}
                        </div>
                    </figure>
                );
            })}
        </div>
    );
}
