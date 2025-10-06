'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import { cn } from '../../lib/utils';

import type { ButtonHTMLAttributes } from 'react';

const BASE_STYLES =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium transition focus-visible:outline-2 focus-visible:outline-[var(--accent-a)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<string, string> = {
    primary:
        'bg-[var(--accent-a)] text-white shadow-soft hover:bg-[color-mix(in_srgb,var(--accent-a)_88%,black)] focus-visible:bg-[color-mix(in_srgb,var(--accent-a)_90%,black)]',
    secondary: 'bg-[var(--accent-b)] text-black shadow-soft hover:bg-[color-mix(in_srgb,var(--accent-b)_92%,black)]',
    outline:
        'border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[color-mix(in_srgb,var(--accent-a)_60%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent-a)_12%,transparent)]',
    ghost: 'bg-transparent text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-a)_12%,transparent)]'
};

const SIZES: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10 p-0'
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof VARIANTS;
    size?: keyof typeof SIZES;
    asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', type = 'button', asChild = false, ...props }, ref) => {
        const Component = asChild ? Slot : 'button';

        return (
            <Component
                ref={ref}
                type={asChild ? undefined : type}
                className={cn(BASE_STYLES, VARIANTS[variant], SIZES[size], className)}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;
