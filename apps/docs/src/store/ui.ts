'use client';

import { create } from 'zustand';

import { log } from '@lib/logger';
import { formatMemberAccessLabel, type MemberAccessLevel } from '@lib/memberAccess';

interface UIState {
    isCommandPaletteOpen: boolean;
    selectedPackage: string;
    selectedVersion: string;
    memberAccessLevel: MemberAccessLevel;
}

interface UIActions {
    setCommandPaletteOpen: (open: boolean) => void;
    toggleCommandPalette: () => void;
    setSelectedPackage: (pkg: string) => void;
    setSelectedVersion: (version: string) => void;
    setMemberAccessLevel: (level: MemberAccessLevel) => void;
}

export type UIStore = UIState & UIActions;

const DEFAULT_PACKAGE = '@seedcord/core';
const DEFAULT_VERSION = 'v0.2.5';
const DEFAULT_ACCESS_LEVEL: MemberAccessLevel = 'protected';

export const useUIStore = create<UIStore>((set) => ({
    isCommandPaletteOpen: false,
    selectedPackage: DEFAULT_PACKAGE,
    selectedVersion: DEFAULT_VERSION,
    memberAccessLevel: DEFAULT_ACCESS_LEVEL,
    setCommandPaletteOpen: (open) => {
        log('Command palette visibility updated', { open });
        set({ isCommandPaletteOpen: open });
    },
    toggleCommandPalette: () =>
        set((state) => {
            const open = !state.isCommandPaletteOpen;
            log('Command palette toggled', { open });
            return { isCommandPaletteOpen: open };
        }),
    setSelectedPackage: (pkg) => {
        log('Package filter changed', { pkg });
        set({ selectedPackage: pkg });
    },
    setSelectedVersion: (version) => {
        log('Version filter changed', { version });
        set({ selectedVersion: version });
    },
    setMemberAccessLevel: (level) => {
        log('Member access filter changed', { level: formatMemberAccessLabel(level) });
        set({ memberAccessLevel: level });
    }
}));

export default useUIStore;
