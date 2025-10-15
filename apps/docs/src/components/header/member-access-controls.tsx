'use client';

import { useShallow } from 'zustand/react/shallow';

import { MEMBER_ACCESS_LEVELS, formatMemberAccessLabel } from '@lib/member-access';
import { cn } from '@lib/utils';
import { useUIStore, type UIStore } from '@store/ui';

import type { ReactElement } from 'react';

export function MemberAccessControls({
    className,
    orientation = 'vertical',
    showLegend = true
}: {
    className?: string;
    orientation?: 'vertical' | 'horizontal';
    showLegend?: boolean;
} = {}): ReactElement {
    const { memberAccessLevel, setMemberAccessLevel } = useUIStore(
        useShallow((state: UIStore) => ({
            memberAccessLevel: state.memberAccessLevel,
            setMemberAccessLevel: state.setMemberAccessLevel
        }))
    );

    const containerClasses =
        orientation === 'horizontal' ? 'flex items-center gap-3' : 'flex flex-col items-stretch gap-2';

    return (
        <div className={cn(containerClasses, className)}>
            {showLegend ? (
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Access</span>
            ) : null}
            <div
                role="radiogroup"
                aria-label={showLegend ? undefined : 'Member access level'}
                className="inline-flex overflow-hidden rounded-full border border-border/60 bg-[color-mix(in_srgb,var(--surface)_97%,transparent)]"
            >
                {MEMBER_ACCESS_LEVELS.map((level, index) => {
                    const isActive = memberAccessLevel === level;
                    return (
                        <button
                            key={level}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => setMemberAccessLevel(level)}
                            className={cn(
                                'relative px-3 py-1.5 text-xs font-medium transition-colors focus-visible:z-[1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color-mix(in_srgb,var(--accent-b)_35%,transparent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color-mix(in_srgb,var(--surface)_98%,transparent)]',
                                index > 0 && 'border-l border-border/50',
                                isActive
                                    ? 'bg-[color-mix(in_srgb,var(--accent-b)_14%,var(--surface)_86%)] text-[color-mix(in_srgb,var(--text)_92%,var(--accent-b)_8%)]'
                                    : 'text-subtle hover:text-[var(--text)]'
                            )}
                        >
                            {formatMemberAccessLabel(level)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MemberAccessControls;
