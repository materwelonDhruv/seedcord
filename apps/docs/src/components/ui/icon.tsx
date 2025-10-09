'use client';

import { cn } from '@lib/utils';

import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

interface IconProps {
    icon: LucideIcon;
    size?: number;
    title?: string;
    className?: string;
}

export function Icon({ icon: iconComponent, size = 18, title, className }: IconProps): ReactElement {
    const IconComponent = iconComponent;

    if (title) {
        return (
            <span role="img" aria-label={title} className={cn('inline-flex items-center justify-center', className)}>
                <IconComponent aria-hidden focusable="false" className="text-current" size={size} />
            </span>
        );
    }

    return (
        <IconComponent
            aria-hidden
            focusable="false"
            className={cn('flex-shrink-0 text-current', className)}
            size={size}
        />
    );
}

export default Icon;
