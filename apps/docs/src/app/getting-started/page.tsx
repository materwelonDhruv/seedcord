import type { ReactElement } from 'react';

export const dynamic = 'force-static';

export default function GettingStartedPage(): ReactElement {
    return (
        <article className="space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold text-[var(--text)]">Getting started</h1>
                <p className="text-sm text-subtle">
                    Placeholder content for the onboarding guide. TODO: replace with real quickstart sourced from
                    markdown/TypeDoc.
                </p>
            </header>
            <section className="space-y-4 text-sm leading-6 text-[var(--text)]">
                <p>
                    Welcome to the Seedcord docs prototype. This page will eventually walk through installation,
                    bootstrapping the CLI, and running your first bot. For now, explore the interactive controls
                    throughout the layout to get a feel for the experience.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-subtle">
                    <li>Use the theme toggle to preview light and dark styles.</li>
                    <li>Press ⌘K / Ctrl+K for the command palette, then enter to log a selection.</li>
                    <li>Switch packages and versions via the header dropdowns to update shared state.</li>
                </ul>
                <p className="text-xs text-subtle">TODO: wire this outline to the generated documentation index.</p>
            </section>
        </article>
    );
}
