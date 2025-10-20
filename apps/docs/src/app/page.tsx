import Image from 'next/image';
import Link from 'next/link';

import type { ReactElement } from 'react';

const GUIDE_URL = 'https://github.com/materwelonDhruv/seedcord-guide';

export default function Home(): ReactElement {
    return (
        <main id="main-content" className="bg-(--bg-dim)">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-6 lg:py-24">
                <section className="flex flex-wrap items-start justify-start gap-12 text-left lg:justify-between">
                    <div className="flex min-w-0 max-w-xl flex-1 flex-col items-start gap-6">
                        <h1 className="text-4xl font-black tracking-tight text-(--text) sm:text-5xl lg:text-6xl">
                            The only Discord bot framework you&apos;ll ever need.
                        </h1>
                        <p className="text-lg leading-8 text-subtle">
                            Seedcord is an opinionated Discord bot framework built on top of Discord.js. You handle the
                            logic, it handles the rest.
                        </p>
                        <div className="flex flex-row flex-wrap items-center gap-3">
                            <Link
                                href="/docs"
                                className="inline-flex items-center justify-center rounded-2xl bg-(--accent-a) px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-(--accent-a-hover) focus-visible:outline-2 focus-visible:outline-(--accent-a) focus-visible:outline-offset-2"
                            >
                                View documentation
                            </Link>
                            <Link
                                href={GUIDE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-2xl bg-(--accent-b) px-6 py-3 text-sm font-semibold text-black shadow-soft transition hover:bg-(--accent-b-hover) focus-visible:outline-2 focus-visible:outline-(--accent-b) focus-visible:outline-offset-2"
                            >
                                Read the guide
                            </Link>
                        </div>
                    </div>
                    <div className="relative hidden items-center justify-center lg:flex lg:flex-1 lg:max-w-md">
                        <div className="relative flex aspect-square w-32 items-center justify-center overflow-hidden rounded-3xl border border-(--border)/80 bg-(--surface-muted) p-4 shadow-(--shadow-soft-token) sm:w-40 md:w-52 lg:w-64">
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
