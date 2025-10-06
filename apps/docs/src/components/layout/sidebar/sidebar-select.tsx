'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@lib/utils';

import type { ReactElement } from 'react';

interface SidebarSelectOption {
    id: string;
    label: string;
}

interface SidebarSelectProps {
    id: string;
    label: string;
    value: string;
    options: readonly SidebarSelectOption[];
    onChange: (value: string) => void;
}

export function SidebarSelect({ id, label, value, options, onChange }: SidebarSelectProps): ReactElement {
    const labelId = `${id}-label`;
    const [open, setOpen] = useState(false);
    const selectedLabel = useMemo(
        () => options.find((option) => option.id === value)?.label ?? value,
        [options, value]
    );
    const handleValueChange = (nextValue: string): void => {
        onChange(nextValue);
        setOpen(false);
    };

    return (
        <div className="space-y-1">
            <label id={labelId} className="text-xs font-semibold uppercase tracking-wide text-subtle" htmlFor={id}>
                {label}
            </label>
            <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
                <DropdownMenu.Trigger asChild>
                    <button
                        id={id}
                        type="button"
                        aria-labelledby={labelId}
                        className={cn(
                            'flex w-full items-center justify-between rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-sm font-medium text-[var(--text)] shadow-soft transition',
                            'focus:border-[color-mix(in_srgb,var(--accent-a)_55%,var(--border))] focus:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent-a)_6%)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent-a)_40%,transparent)] focus:ring-offset-2 focus:ring-offset-[color-mix(in_srgb,var(--surface)_96%,transparent)]',
                            open
                                ? 'border-[color-mix(in_srgb,var(--accent-a)_50%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_90%,var(--accent-a)_8%)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-a)_28%,transparent)]'
                                : null
                        )}
                    >
                        <span className="truncate">{selectedLabel}</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-subtle transition-transform duration-200',
                                open ? 'rotate-180' : null
                            )}
                        />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="start"
                        sideOffset={8}
                        className="z-[70] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] overflow-hidden rounded-xl border border-border bg-[var(--surface)] p-1 shadow-soft"
                    >
                        <DropdownMenu.RadioGroup value={value} onValueChange={handleValueChange}>
                            {options.map((option) => (
                                <DropdownMenu.RadioItem
                                    key={option.id}
                                    value={option.id}
                                    className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none transition data-[highlighted]:bg-[color-mix(in_srgb,var(--accent-a)_12%,transparent)] data-[state=checked]:bg-[color-mix(in_srgb,var(--accent-b)_18%,var(--surface)_82%)] data-[state=checked]:font-semibold data-[state=checked]:text-[color-mix(in_srgb,var(--accent-b)_68%,var(--text))]"
                                >
                                    <DropdownMenu.ItemIndicator className="absolute right-3 flex items-center text-[color-mix(in_srgb,var(--accent-b)_80%,var(--text))]">
                                        <Check className="h-4 w-4" aria-hidden />
                                    </DropdownMenu.ItemIndicator>
                                    <span>{option.label}</span>
                                </DropdownMenu.RadioItem>
                            ))}
                        </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}

export default SidebarSelect;
