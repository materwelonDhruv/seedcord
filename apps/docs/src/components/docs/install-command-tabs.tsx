'use client';

import { useMemo, useState } from 'react';

import { cn } from '@lib/utils';

import CopyButton from '../ui/copy-button';

import type { ReactElement } from 'react';

interface CommandTab {
    id: string;
    label: string;
    html: string | null;
    code: string;
}

interface InstallCommandTabsProps {
    commands: readonly CommandTab[];
}

export function InstallCommandTabs({ commands }: InstallCommandTabsProps): ReactElement | null {
    const initialId = commands[0]?.id;
    const [activeId, setActiveId] = useState(initialId);

    const activeCommand = useMemo(
        () => commands.find((command) => command.id === activeId) ?? commands[0],
        [activeId, commands]
    );

    if (!activeCommand) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {commands.map((command) => (
                    <button
                        key={command.id}
                        type="button"
                        onClick={() => setActiveId(command.id)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition',
                            command.id === activeCommand.id
                                ? 'border-[color-mix(in_srgb,var(--accent-a)_55%,var(--border))] bg-[color-mix(in_srgb,var(--accent-a)_18%,transparent)] text-[var(--text)]'
                                : 'border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] text-subtle hover:border-[color-mix(in_srgb,var(--accent-a)_30%,var(--border))] hover:text-[var(--text)]'
                        )}
                    >
                        {command.label}
                    </button>
                ))}
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] shadow-soft">
                <CopyButton
                    value={activeCommand.code}
                    ariaLabel={`Copy ${activeCommand.label} install command`}
                    className="absolute right-3 top-3 z-10"
                />
                {activeCommand.html ? (
                    <div
                        className="shiki-container overflow-auto px-4 py-4 text-sm leading-relaxed text-[var(--text)]"
                        dangerouslySetInnerHTML={{ __html: activeCommand.html }}
                    />
                ) : (
                    <pre className="overflow-auto px-4 py-4 text-sm text-[var(--text)]">
                        <code>{activeCommand.code}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}

export default InstallCommandTabs;
