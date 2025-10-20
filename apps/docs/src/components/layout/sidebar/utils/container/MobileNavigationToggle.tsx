'use client';

import { Menu } from 'lucide-react';

import Button from '@ui/Button';

import type { ReactElement } from 'react';

export function MobileNavigationToggle({ onOpen }: { onOpen: () => void }): ReactElement {
    return (
        <div className="flex flex-col gap-3 px-3 pt-5 md:px-5 lg:hidden">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    className="flex-1 min-w-[150px] justify-center gap-2 bg-surface text-sm text-(--text)"
                    onClick={onOpen}
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-4 w-4" aria-hidden />
                    Browse navigation
                </Button>
            </div>
        </div>
    );
}
