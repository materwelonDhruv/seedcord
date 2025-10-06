import Image from 'next/image';
import Link from 'next/link';

import type { ReactElement } from 'react';

const FEATURE_CARDS = [
    {
        title: 'TypeDoc powered reference',
        description:
            'Browse the generated API surface with filters for packages, symbol kinds, and versioned artifacts.'
    },
    {
        title: 'Powerful search ergonomics',
        description: 'Jump anywhere with the command palette, keyboard shortcuts, and contextual navigation.'
    },
    {
        title: 'Developer-first theming',
        description: 'Dark mode, responsive layout primitives, and accessible defaults ship out of the box.'
    }
] as const;

const GUIDE_URL = 'https://github.com/materwelonDhruv/seedcord-guide';

export default function Home(): ReactElement {
    return (
        <main id="main-content" className="bg-[color-mix(in_srgb,var(--bg)_94%,#050507_6%)]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 md:px-6 lg:py-24">
                <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-subtle">
                            Seedcord
                        </p>
                        <h1 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
                            A modern developer portal for the Seedcord ecosystem.
                        </h1>
                        <p className="text-lg leading-8 text-subtle">
                            Seedcord is an opinionated Discord bot framework built on top of Discord.js. You handle the
                            logic, we orchestrate the rest.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/docs"
                                className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent-a)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[color-mix(in_srgb,var(--accent-a)_88%,black)] focus-visible:outline-2 focus-visible:outline-[var(--accent-a)] focus-visible:outline-offset-2"
                            >
                                View documentation
                            </Link>
                            <Link
                                href={GUIDE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent-b)] px-6 py-3 text-sm font-semibold text-black shadow-soft transition hover:bg-[color-mix(in_srgb,var(--accent-b)_92%,#000_8%)] focus-visible:outline-2 focus-visible:outline-[var(--accent-b)] focus-visible:outline-offset-2"
                            >
                                Read the guide
                            </Link>
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                            <div
                                className="h-[320px] w-[320px] max-w-[70vw] rounded-[36px] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--text)_15%,var(--surface)_85%)_0%,transparent_70%)] opacity-55 blur-3xl transition-opacity dark:opacity-70"
                                aria-hidden
                            />
                        </div>
                        <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-3xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-8 shadow-[0_32px_70px_-38px_color-mix(in_srgb,var(--text)_30%,transparent)] dark:shadow-[0_42px_90px_-45px_color-mix(in_srgb,var(--text)_24%,transparent)]">
                            <Image
                                src="/logo.svg"
                                alt="Seedcord logo"
                                width={240}
                                height={240}
                                priority
                                className="h-auto w-full"
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />
                        </div>
                    </div>
                </section>
                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURE_CARDS.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface/80 p-6 shadow-soft"
                        >
                            <h2 className="text-2xl font-semibold text-[var(--text)]">{feature.title}</h2>
                            <p className="text-sm leading-relaxed text-subtle">{feature.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
