import Link from 'next/link';

import InstallCommandTabs from '@components/docs/install-command-tabs';
import { loadDocsCatalog } from '@lib/docs/catalog';
import { highlightToHtml } from '@lib/shiki';
import { CodeBlock } from '@ui/code-block';

import type { ReactElement } from 'react';

export const dynamic = 'force-static';

const INSTALL_COMMANDS = [
    {
        id: 'pnpm',
        label: 'pnpm',
        code: 'pnpm add @seedcord/core @seedcord/plugins @seedcord/services'
    },
    {
        id: 'npm',
        label: 'npm',
        code: 'npm install @seedcord/core @seedcord/plugins @seedcord/services'
    },
    {
        id: 'yarn',
        label: 'yarn',
        code: 'yarn add @seedcord/core @seedcord/plugins @seedcord/services'
    }
] as const;

const BOOTSTRAP_SNIPPET = `import { Client } from '@seedcord/core';
import { createPlugin } from '@seedcord/plugins';
import { ServiceContainer } from '@seedcord/services';

const seedcord = new Client({ token: process.env.DISCORD_TOKEN! });

seedcord.use(
    createPlugin('logger', (ctx) => {
        ctx.on('ready', () => ctx.log.info('Seedcord is connected.'));
    })
);

const container = new ServiceContainer();
container.register(seedcord);

await container.start();`;

export default async function DocsIndexPage(): Promise<ReactElement> {
    const highlightedCommands = await Promise.all(
        INSTALL_COMMANDS.map(async (command) => ({
            ...command,
            html: await highlightToHtml(command.code, 'bash')
        }))
    );
    const catalog = await loadDocsCatalog();
    const primaryPackage = catalog[0] ?? null;
    const primaryVersion = primaryPackage?.versions[0] ?? null;
    const primaryRoute = primaryVersion?.basePath ?? '/docs';

    return (
        <section className="space-y-12">
            <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-subtle">Getting started</p>
                <h1 className="text-3xl font-semibold text-[var(--text)] sm:text-4xl">
                    Install Seedcord in a few commands.
                </h1>
                <p className="max-w-2xl text-sm text-subtle">
                    Pick a package manager, bootstrap the runtime, and explore the generated reference without leaving
                    the keyboard. Real guides will hydrate from TypeDoc soon—this page is a curated preview.
                </p>
            </header>

            <article className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[var(--text)]">Install the packages</h2>
                    <p className="text-sm text-subtle">
                        Choose your preferred package manager. Every preset installs the core runtime along with
                        optional plugin helpers and background services.
                    </p>
                </div>
                <InstallCommandTabs commands={highlightedCommands} />
                <p className="text-xs text-subtle">
                    Looking for a specific framework starter? Open the command palette (<span aria-hidden>⌘K</span> /{' '}
                    <span aria-hidden>Ctrl+K</span>) to explore upcoming presets.
                </p>
            </article>

            <article className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[var(--text)]">Bootstrap the client</h2>
                    <p className="text-sm text-subtle">
                        Wire up a minimal client, register a plugin, and start the service container. The scaffolding
                        below mirrors what the generated guides will ship with soon.
                    </p>
                </div>
                <CodeBlock code={BOOTSTRAP_SNIPPET} lang="ts" label="seedcord.ts" />
                <div className="flex flex-col gap-2 text-xs text-subtle md:flex-row md:items-center md:justify-between">
                    <p>Replace the placeholders with your Discord token and workspace modules when you go live.</p>
                    <Link
                        href={primaryRoute}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-a)] focus-visible:outline-2 focus-visible:outline-[var(--accent-a)] focus-visible:outline-offset-2"
                    >
                        Explore the Client API<span aria-hidden>→</span>
                    </Link>
                </div>
            </article>
        </section>
    );
}
