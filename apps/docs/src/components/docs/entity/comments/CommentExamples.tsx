import { ChevronDown } from 'lucide-react';

import type { CommentExample } from '@/lib/docs/types';

import { cn } from '@lib/utils';
import { Icon } from '@ui/Icon';

import type { ReactElement } from 'react';

interface CommentExamplesProps {
    examples: readonly CommentExample[];
    className?: string;
    open?: boolean;
}

const codeContainerClass =
    'code-scroll-area rounded-xl border border-(--border) bg-(--surface-muted) px-3 py-2 text-xs text-[var(--text)] sm:text-sm mb-2';

export function CommentExamples({ examples, className, open = false }: CommentExamplesProps): ReactElement | null {
    if (!examples.length) return null;

    return (
        <details className={cn('space-y-3 group', className)} open={open}>
            <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-(--text)">
                <span className="flex items-center">
                    <Icon
                        icon={ChevronDown}
                        size={18}
                        className="text-subtle transition-transform duration-200 group-open:rotate-180"
                        aria-hidden
                    />
                </span>
                <span>Examples</span>
            </summary>

            <div className="pt-2">
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
        </details>
    );
}
