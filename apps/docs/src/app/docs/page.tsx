import InstallCommandTabs from '@/components/docs/InstallCommandTabs';

import { highlightToHtml } from '@lib/shiki';

import type { ReactElement } from 'react';

export const dynamic = 'force-static';

const INSTALL_COMMANDS = [
    {
        id: 'pnpm',
        label: 'pnpm',
        code: 'pnpm add seedcord'
    },
    {
        id: 'npm',
        label: 'npm',
        code: 'npm install seedcord'
    },
    {
        id: 'yarn',
        label: 'yarn',
        code: 'yarn add seedcord'
    }
] as const;

export default async function DocsIndexPage(): Promise<ReactElement> {
    const highlightedCommands = await Promise.all(
        INSTALL_COMMANDS.map(async (command) => ({
            ...command,
            html: await highlightToHtml(command.code, 'bash')
        }))
    );

    return (
        <section className="space-y-12">
            <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-subtle">Getting started</p>
                <h1 className="text-3xl font-semibold text-[var(--text)] sm:text-4xl">Install the package</h1>
            </header>

            <article className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <InstallCommandTabs commands={highlightedCommands} />
            </article>
        </section>
    );
}
