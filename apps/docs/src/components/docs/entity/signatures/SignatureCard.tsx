import type { FunctionSignatureModel } from '@/lib/docs/types';

import Button from '@ui/Button';

import { CommentExamples } from '../comments/CommentExamples';
import { CommentParagraphs } from '../comments/CommentParagraphs';
import { renderParameterBadge } from '../utils/renderers/renderParameterBadge';

import type { ReactElement } from 'react';

export function SignatureCard({ signature }: { signature: FunctionSignatureModel }): ReactElement {
    return (
        <article className="space-y-3 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft sm:p-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                {signature.sourceUrl ? (
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl border border-border/80 text-subtle transition hover:text-[var(--text)]"
                        aria-label="Open source in a new tab"
                    ></Button>
                ) : null}
            </header>
            {signature.code.html ? (
                <div className="code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm">
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: signature.code.html }} />
                </div>
            ) : (
                <div className="code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm">
                    <pre className="code-scroll-content whitespace-pre-wrap">{signature.code.text}</pre>
                </div>
            )}
            <CommentParagraphs paragraphs={signature.summary} />
            {signature.parameters.length ? (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-[var(--text)]">Parameters</h4>
                    <ul className="space-y-2">
                        {signature.parameters.map((parameter) => (
                            <li
                                key={parameter.name}
                                className="rounded-lg border border-border/60 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-3 text-sm text-subtle"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    {renderParameterBadge(parameter)}
                                    {parameter.type ? (
                                        <code className="rounded bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-2 py-0.5 text-xs text-[var(--text)]">
                                            {parameter.type}
                                        </code>
                                    ) : null}
                                </div>
                                {parameter.defaultValue ? (
                                    <p className="mt-2 text-xs text-subtle">
                                        Default value: <span className="font-mono">{parameter.defaultValue}</span>
                                    </p>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {signature.examples.length ? <CommentExamples examples={signature.examples} /> : null}
        </article>
    );
}
