import Image from 'next/image';
import Link from 'next/link';

import type { ReactElement } from 'react';

const GUIDE_URL = 'https://github.com/materwelonDhruv/seedcord-guide';

export default function Home(): ReactElement {
    return (
        <main id="main-content" className="bg-[color-mix(in_srgb,var(--bg)_94%,#050507_6%)]">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-6 lg:py-24">
                <section className="flex flex-wrap items-center justify-center gap-12 text-center sm:text-left lg:justify-between">
                    <div className="flex min-w-0 max-w-xl flex-1 flex-col items-center gap-6 sm:items-start">
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
                    <div className="relative hidden items-center justify-center lg:flex lg:flex-1 lg:max-w-md">
                        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                            <div
                                className="h-[220px] w-[220px] max-w-[60vw] rounded-[32px] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--text)_12%,var(--surface)_88%)_0%,transparent_70%)] opacity-55 blur-3xl transition-opacity dark:opacity-70"
                                aria-hidden
                            />
                        </div>
                        <div className="relative flex aspect-square w-32 items-center justify-center overflow-hidden rounded-3xl border border-border/80 bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-[0_28px_60px_-36px_color-mix(in_srgb,var(--text)_28%,transparent)] sm:w-40 md:w-52 lg:w-64">
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
            </div>
        </main>
    );
}
