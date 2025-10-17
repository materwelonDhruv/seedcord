import { Code } from 'lucide-react';

import { cn } from '@lib/utils';
import { Icon } from '@ui/icon';

import { CommentExamples } from './comment-examples';
import { CommentParagraphs } from './comment-paragraphs';

import type { FunctionSignatureModel } from '@lib/docs/entities';
import type { ReactElement } from 'react';

interface FunctionSignaturesSectionProps {
    signatures: readonly FunctionSignatureModel[];
}

function renderParameterBadge(parameter: FunctionSignatureModel['parameters'][number]): ReactElement {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-2 py-0.5 text-xs text-subtle">
            <span className="font-semibold text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]">
                {parameter.name}
            </span>
            {parameter.optional ? <span className="uppercase">optional</span> : null}
        </span>
    );
}

function SignatureCard({ signature }: { signature: FunctionSignatureModel }): ReactElement {
    return (
        <article className="space-y-3 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft sm:p-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[var(--text)]">{signature.code.text}</h3>
                {signature.sourceUrl ? (
                    <a
                        href={signature.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-subtle transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_48%,var(--text))]"
                        aria-label="Open signature source in a new tab"
                    >
                        <Icon icon={Code} size={16} />
                    </a>
                ) : null}
            </header>
            {signature.code.html ? (
                <div className="code-scroll-area rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs text-[var(--text)] sm:text-sm">
                    <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: signature.code.html }} />
                </div>
            ) : null}
            <CommentParagraphs paragraphs={signature.summary} />
            {signature.examples.length ? <CommentExamples examples={signature.examples} /> : null}
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
        </article>
    );
}

export function FunctionSignaturesSection({ signatures }: FunctionSignaturesSectionProps): ReactElement | null {
    if (!signatures.length) {
        return null;
    }

    return (
        <section className="space-y-4">
            <header className="space-y-1">
                <h2 className="text-xl font-semibold text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]">
                    {signatures.length === 1 ? 'Function Signature' : 'Function Signatures'}
                </h2>
            </header>
            <div className={cn('grid gap-4', signatures.length > 1 ? 'lg:grid-cols-2' : undefined)}>
                {signatures.map((signature) => (
                    <SignatureCard key={signature.id} signature={signature} />
                ))}
            </div>
        </section>
    );
}
