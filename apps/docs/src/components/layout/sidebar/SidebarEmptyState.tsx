import { cn } from '@lib/utils';

import type { ReactElement } from 'react';

export function SidebarEmptyState({ className }: { className?: string }): ReactElement {
    return (
        <nav
            aria-label="Library navigation"
            className={cn(
                'flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft',
                className
            )}
        >
            <p className="text-sm text-subtle">No packages available.</p>
        </nav>
    );
}
