'use client';

import { create } from 'zustand';

import { log } from '@lib/logger';
import { formatMemberAccessLabel, type MemberAccessLevel } from '@lib/memberAccess';

import { DEFAULT_MANIFEST_PACKAGE, DEFAULT_VERSION } from '../lib/docs/packages';

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

const DEFAULT_ACCESS_LEVEL: MemberAccessLevel = 'protected';

interface Snapshot {
    selectedPackage?: string | undefined;
    selectedVersion?: string | undefined;
    memberAccessLevel?: MemberAccessLevel | undefined;
}

const readSnapshotFromWindow = (): Snapshot => {
    if (typeof window === 'undefined') return {};

    try {
        const snapshotRaw = (window as unknown as { __DOCS_UI__?: Snapshot }).__DOCS_UI__;
        if (!snapshotRaw) return {};
        return {
            selectedPackage: snapshotRaw.selectedPackage,
            selectedVersion: snapshotRaw.selectedVersion,
            memberAccessLevel: snapshotRaw.memberAccessLevel
        };
    } catch {
        return {};
    }
};

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365;

const COOKIE_MAX_AGE_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_YEAR;

const writeCookie = (name: string, value: string): void => {
    try {
        // set path=/ so cookies are sent to server routes and any subpaths
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
    } catch {
        // ignore
    }
};

export const useUIStore = create<UIStore>((set) => {
    const snapshot = readSnapshotFromWindow();

    return {
        isCommandPaletteOpen: false,
        selectedPackage: snapshot.selectedPackage ?? DEFAULT_MANIFEST_PACKAGE,
        selectedVersion: snapshot.selectedVersion ?? DEFAULT_VERSION,
        memberAccessLevel: snapshot.memberAccessLevel ?? DEFAULT_ACCESS_LEVEL,

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
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('docs.selectedPackage', pkg);
                writeCookie('docs.selectedPackage', pkg);
            }
            set({ selectedPackage: pkg });
        },

        setSelectedVersion: (version) => {
            log('Version filter changed', { version });
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('docs.selectedVersion', version);
                writeCookie('docs.selectedVersion', version);
            }
            set({ selectedVersion: version });
        },

        setMemberAccessLevel: (level) => {
            log('Member access filter changed', { level: formatMemberAccessLabel(level) });
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('docs.memberAccessLevel', level);
                writeCookie('docs.memberAccessLevel', level);
            }
            set({ memberAccessLevel: level });
        }
    };
});

export default useUIStore;
