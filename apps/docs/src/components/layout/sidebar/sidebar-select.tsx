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
                        aria-expanded={open}
                        className={cn(
                            'flex w-full items-center justify-between rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--bg)_96%,var(--surface)_4%)] px-3 py-2 text-sm font-medium text-[var(--text)] shadow-soft transition',
                            'focus:border-[color-mix(in_srgb,var(--accent-b)_55%,var(--border))] focus:bg-[color-mix(in_srgb,var(--bg)_94%,var(--accent-b)_10%)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-b)_32%,transparent)] focus:ring-offset-2 focus:ring-offset-[color-mix(in_srgb,var(--bg)_96%,transparent)]',
                            open
                                ? 'border-[color-mix(in_srgb,var(--accent-b)_62%,var(--border))] bg-[color-mix(in_srgb,var(--bg)_90%,var(--accent-b)_18%)] shadow-[0_10px_35px_-20px_color-mix(in_srgb,var(--accent-b)_45%,transparent)]'
                                : null
                        )}
                    >
                        <span className="truncate">{selectedLabel}</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-subtle transition-transform duration-200',
                                open ? 'rotate-180 text-[color-mix(in_srgb,var(--text)_85%,var(--accent-b)_15%)]' : null
                            )}
                            aria-hidden
                        />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="start"
                        sideOffset={8}
                        className="z-[70] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] overflow-hidden rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--bg)_96%,#070917_4%)] p-1 shadow-[0_18px_36px_-16px_color-mix(in_srgb,var(--text)_32%,transparent)]"
                    >
                        <DropdownMenu.RadioGroup value={value} onValueChange={handleValueChange}>
                            {options.map((option) => (
                                <DropdownMenu.RadioItem
                                    key={option.id}
                                    value={option.id}
                                    className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none transition data-[highlighted]:bg-[color-mix(in_srgb,var(--accent-b)_12%,var(--bg)_88%)] data-[highlighted]:text-[color-mix(in_srgb,var(--text)_88%,var(--accent-b)_12%)] data-[state=checked]:bg-[color-mix(in_srgb,var(--accent-b)_24%,var(--bg)_76%)] data-[state=checked]:border data-[state=checked]:border-[color-mix(in_srgb,var(--accent-b)_34%,var(--border))] data-[state=checked]:font-semibold data-[state=checked]:text-[color-mix(in_srgb,var(--text)_85%,var(--accent-b)_15%)]"
                                >
                                    <DropdownMenu.ItemIndicator className="absolute right-3 flex items-center text-[color-mix(in_srgb,var(--accent-b)_78%,var(--text))]">
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
