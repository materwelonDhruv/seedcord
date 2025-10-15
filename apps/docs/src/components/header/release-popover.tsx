'use client';

import * as Popover from '@radix-ui/react-popover';
import { Info } from 'lucide-react';

import Button from '@ui/button';
import { Icon } from '@ui/icon';

import type { ReactElement } from 'react';

export function ReleasePopover(): ReactElement {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button variant="ghost" size="icon" aria-label="View release notes" className="text-[var(--text)]">
                    <Icon icon={Info} size={18} />
                </Button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={10}
                    className="w-64 rounded-xl border border-border bg-[var(--bg)] p-4 text-sm text-[var(--text)] shadow-soft"
                >
                    <p className="font-semibold">Docs prototype roadmap</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-subtle">
                        <li>Part 2: hydrate command palette with TypeDoc search index.</li>
                        <li>Part 3: embed Shiki-highlighted snippets across entities.</li>
                        <li>Part 4: generate navigation from build artifacts.</li>
                    </ul>
                    <p className="mt-3 text-[0.7rem] text-subtle">All items are placeholders for now—stay tuned!</p>
                    <Popover.Arrow className="fill-[var(--bg)]" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
