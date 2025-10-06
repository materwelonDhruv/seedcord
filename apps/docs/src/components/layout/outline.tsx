import { cn } from '../../lib/utils';

import type { ReactElement } from 'react';

const OUTLINE = [
    {
        title: 'On this page',
        anchors: ['Summary', 'Usage', 'Examples', 'Next steps']
    }
] as const;

type OutlineVariant = 'desktop' | 'mobile';

interface OutlineProps {
    variant?: OutlineVariant;
}

export function Outline({ variant = 'desktop' }: OutlineProps = {}): ReactElement {
    return (
        <section
            aria-label="On page navigation"
            className={cn(
                'space-y-4 rounded-2xl border border-border bg-surface p-4 text-sm shadow-soft',
                variant === 'desktop' ? 'sticky top-28' : 'relative'
            )}
        >
            {OUTLINE.map((group) => (
                <div key={group.title} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{group.title}</p>
                    <ul className="space-y-1">
                        {group.anchors.map((anchor) => (
                            <li key={anchor}>
                                <a
                                    href={`#${anchor.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[var(--text)] transition hover:text-[color-mix(in_srgb,var(--accent-a)_60%,var(--text))] focus-visible:outline-2 focus-visible:outline-[var(--accent-a)] focus-visible:outline-offset-2"
                                >
                                    {anchor}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-subtle">TODO: populate with generated headings.</p>
                </div>
            ))}
        </section>
    );
}

export default Outline;
