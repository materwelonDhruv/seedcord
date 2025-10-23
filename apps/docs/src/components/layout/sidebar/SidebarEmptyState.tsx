import { cn } from '@lib/utils';

import type { ReactElement } from 'react';

function SidebarEmptyState({ className }: { className?: string }): ReactElement {
    return (
        <nav
            aria-label="Library navigation"
            className={cn('flex h-full flex-col card bg-surface p-4 shadow-soft', className)}
        >
            <p className="text-sm text-subtle">No packages available.</p>
        </nav>
    );
}

export default SidebarEmptyState;
