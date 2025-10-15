import { highlightToHtml } from '@lib/shiki';
import { cn } from '@lib/utils';

import CopyButton from './copy-button';

import type { ReactElement } from 'react';
import type { BundledLanguage } from 'shiki';

interface CodeBlockProps {
    code: string;
    lang?: BundledLanguage;
    className?: string;
    hideCopyButton?: boolean;
    label?: string;
}

export async function CodeBlock({
    code,
    lang = 'ts',
    className,
    hideCopyButton = false,
    label
}: CodeBlockProps): Promise<ReactElement> {
    const highlightedHtml = await highlightToHtml(code, lang);
    const codeContainerClass = 'code-scroll-area px-4 py-4 text-sm leading-relaxed text-[var(--text)]';

    return (
        <figure
            className={cn(
                'relative rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] shadow-soft',
                className
            )}
        >
            {label ? (
                <figcaption className="flex items-center justify-between border-b border-border/70 bg-[color-mix(in_srgb,var(--surface)_90%,#ffffff_10%)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-subtle">
                    <span>{label}</span>
                </figcaption>
            ) : null}
            <div className="relative">
                {!hideCopyButton ? (
                    <CopyButton
                        value={code}
                        ariaLabel="Copy code block"
                        className={cn('absolute right-3 top-3 z-10', label ? 'top-4' : undefined)}
                    />
                ) : null}
                {highlightedHtml ? (
                    <div className={cn(codeContainerClass)}>
                        <div className="code-scroll-content" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                    </div>
                ) : (
                    <div className={cn(codeContainerClass)}>
                        <pre className="code-scroll-content whitespace-pre leading-relaxed">
                            <code>{code}</code>
                        </pre>
                    </div>
                )}
            </div>
        </figure>
    );
}

export default CodeBlock;
