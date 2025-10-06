'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import Button from '@components/ui/button';
import { ScrollToTopButton } from '@components/ui/scroll-to-top-button';
import { cn } from '@lib/utils';

import Sidebar from './sidebar';

import type { ReactNode } from 'react';

interface ContainerProps {
    sidebar: ReactNode;
    children: ReactNode;
    className?: string;
}

function MobilePanelDialog({
    open,
    onOpenChange,
    title,
    children
}: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    title: string;
    children: ReactNode;
}): ReactNode {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--bg)_72%,#0f172acc_28%)] backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
                <Dialog.Content className="fixed inset-x-0 bottom-0 z-[60] origin-bottom rounded-t-3xl border border-border bg-[color-mix(in_srgb,var(--bg)_96%,#0f172a_4%)] p-4 shadow-soft data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom sm:inset-y-auto sm:bottom-6 sm:left-1/2 sm:max-h-[85vh] sm:w-[min(480px,92vw)] sm:-translate-x-1/2 sm:rounded-3xl">
                    <div className="mb-3 flex items-center justify-between">
                        <Dialog.Title className="text-sm font-semibold uppercase tracking-wide text-subtle">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Close panel"
                                className="rounded-full text-subtle"
                            >
                                <X className="h-4 w-4" aria-hidden />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto pe-1 pb-1">{children}</div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function Container({ sidebar, children, className }: ContainerProps): ReactNode {
    const [navigationOpen, setNavigationOpen] = useState(false);

    return (
        <div
            className={cn(
                'mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-16 pt-6 md:px-6 lg:gap-8 lg:pb-20 lg:pt-10',
                className
            )}
        >
            <div className="flex flex-col gap-3 lg:hidden">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 min-w-[150px] justify-center gap-2 bg-surface text-sm text-[var(--text)]"
                        onClick={() => setNavigationOpen(true)}
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-4 w-4" aria-hidden />
                        Browse navigation
                    </Button>
                </div>
            </div>

            <MobilePanelDialog open={navigationOpen} onOpenChange={setNavigationOpen} title="Navigation">
                <Sidebar variant="mobile" className="border-transparent bg-transparent p-0 shadow-none" />
            </MobilePanelDialog>

            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="hidden lg:block">
                    <div className="sticky top-28 max-h-[calc(100vh-8rem)]">{sidebar}</div>
                </aside>
                <div className="min-w-0">{children}</div>
            </div>

            <ScrollToTopButton className="fixed bottom-10 right-6" />
        </div>
    );
}

export default Container;
