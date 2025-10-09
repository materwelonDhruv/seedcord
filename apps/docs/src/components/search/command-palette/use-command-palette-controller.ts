'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { log } from '@lib/logger';
import { useUIStore, type UIStore } from '@store/ui';

import { FOCUS_DELAY_MS } from './constants';

import type { CommandAction } from './types';

export interface CommandPaletteController {
    open: boolean;
    mounted: boolean;
    searchValue: string;
    inputRef: RefObject<HTMLInputElement | null>;
    handleOpenChange: (open: boolean) => void;
    handleValueChange: (value: string) => void;
    handleClose: () => void;
    handleSelect: (action: CommandAction) => void;
    handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export function useCommandPaletteController(): CommandPaletteController {
    const { open, setCommandPaletteOpen } = useUIStore(
        useShallow((state: UIStore) => ({
            open: state.isCommandPaletteOpen,
            setCommandPaletteOpen: state.setCommandPaletteOpen
        }))
    );
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) {
            return undefined;
        }

        if (open) {
            setSearchValue('');
            const timeout = window.setTimeout(() => {
                inputRef.current?.focus();
            }, FOCUS_DELAY_MS);
            log('Command palette opened', { fromPath: pathname });
            return () => window.clearTimeout(timeout);
        }

        log('Command palette closed');
        return undefined;
    }, [mounted, open, pathname]);

    const handleClose = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

    const handleSelect = useCallback(
        (action: CommandAction): void => {
            log('Command palette item selected', action);
            handleClose();

            if (action.isExternal) {
                window.open(action.href, '_blank', 'noopener');
                return;
            }

            router.push(action.href);
        },
        [handleClose, router]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        },
        [handleClose]
    );

    return {
        open,
        mounted,
        searchValue,
        inputRef,
        handleOpenChange: setCommandPaletteOpen,
        handleValueChange: setSearchValue,
        handleClose,
        handleSelect,
        handleKeyDown
    };
}
