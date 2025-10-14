'use client';

import { useId, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MEMBER_ACCESS_LEVELS, formatMemberAccessLabel, type MemberAccessLevel } from '@lib/member-access';
import { cn } from '@lib/utils';
import { useUIStore, type UIStore } from '@store/ui';

function AccessOption({
    value,
    current,
    onChange,
    name
}: {
    value: MemberAccessLevel;
    current: MemberAccessLevel;
    onChange: (level: MemberAccessLevel) => void;
    name: string;
}): ReactElement {
    const id = `${name}-${value}`;
    const checked = current === value;

    return (
        <label
            htmlFor={id}
            className={cn(
                'relative flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition',
                checked
                    ? 'border-[color-mix(in_srgb,var(--accent-b)_42%,var(--border))] bg-[color-mix(in_srgb,var(--accent-b)_18%,var(--surface)_82%)] text-[color-mix(in_srgb,var(--text)_90%,var(--accent-b)_10%)]'
                    : 'border-border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-subtle hover:text-[var(--text)]'
            )}
        >
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                className="sr-only"
            />
            {formatMemberAccessLabel(value)}
        </label>
    );
}

export function MemberAccessControls({
    className,
    variant = 'desktop'
}: {
    className?: string;
    variant?: 'desktop' | 'mobile';
} = {}): ReactElement {
    const radioName = useId();
    const { memberAccessLevel, setMemberAccessLevel } = useUIStore(
        useShallow((state: UIStore) => ({
            memberAccessLevel: state.memberAccessLevel,
            setMemberAccessLevel: state.setMemberAccessLevel
        }))
    );

    const baseClasses =
        variant === 'desktop'
            ? 'hidden md:flex'
            : 'flex md:hidden border-border/60 bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]';

    return (
        <fieldset
            className={cn(
                'items-center gap-2 rounded-full border border-border/70 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-1.5 shadow-soft',
                baseClasses,
                className
            )}
        >
            <legend className="mr-2 text-xs font-semibold uppercase tracking-[0.3em] text-subtle">Access</legend>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Member access level">
                {MEMBER_ACCESS_LEVELS.map((level) => (
                    <AccessOption
                        key={level}
                        value={level}
                        current={memberAccessLevel}
                        onChange={setMemberAccessLevel}
                        name={radioName}
                    />
                ))}
            </div>
        </fieldset>
    );
}

export default MemberAccessControls;
