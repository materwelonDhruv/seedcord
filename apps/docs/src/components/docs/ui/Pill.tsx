import { cn } from '../../../lib/utils';

import type { ReactNode, ReactElement } from 'react';

export const Pill = ({ className, children }: { className?: string; children: ReactNode }): ReactElement => (
    <span
        className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            className
        )}
    >
        {children}
    </span>
);
