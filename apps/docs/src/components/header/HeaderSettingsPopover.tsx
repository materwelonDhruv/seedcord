'use client';

import * as Popover from '@radix-ui/react-popover';
import { Settings } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

import type { ReactElement } from 'react';

export function HeaderSettingsPopover(): ReactElement {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open documentation settings"
                    className="text-[var(--text)] transition focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_42%,transparent)] focus-visible:outline-offset-2"
                >
                    <Icon icon={Settings} size={18} />
                </Button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={12}
                    align="end"
                    className="w-56 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--bg)_98%,#070917_2%)] p-4 text-sm text-[var(--text)] shadow-soft"
                >
                    <p className="font-semibold text-[var(--text)]">Documentation settings</p>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                        We&apos;re building richer customization options. Stay tuned!
                    </p>
                    <Popover.Arrow className="fill-[color-mix(in_srgb,var(--bg)_98%,#070917_2%)]" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default HeaderSettingsPopover;
