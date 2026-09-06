import { SeedcordErrorCode } from '@seedcord/errors';
import { describe, it, expect } from 'vitest';

import { DispatchContext } from '#src/dispatch/DispatchContext';

interface LooseBag {
    set(key: string, value: unknown): void;
    get(key: string): unknown;
    require(key: string): unknown;
}

// this cast stands in for the plugin declaration merge that fills DispatchState
function bagOf(ctx: DispatchContext): LooseBag {
    return ctx;
}

describe('DispatchContext', () => {
    it('round-trips a value through set and get', () => {
        const bag = bagOf(new DispatchContext(null));
        bag.set('locale', 'en');
        expect(bag.get('locale')).toBe('en');
    });

    it('returns a set value through require', () => {
        const bag = bagOf(new DispatchContext(null));
        bag.set('locale', 'en');
        expect(bag.require('locale')).toBe('en');
    });

    it('throws DispatchStateMissing when nothing set the key', () => {
        const bag = bagOf(new DispatchContext(null));
        expect(() => bag.require('locale')).toThrow(
            expect.objectContaining({ code: SeedcordErrorCode.DispatchStateMissing })
        );
    });

    it('names the missing key in the message', () => {
        const bag = bagOf(new DispatchContext(null));
        expect(() => bag.require('locale')).toThrow(/locale/);
    });

    it('returns a key set to null', () => {
        const bag = bagOf(new DispatchContext(null));
        bag.set('locale', null);
        expect(bag.require('locale')).toBeNull();
    });

    it('treats a key set to undefined as missing', () => {
        const bag = bagOf(new DispatchContext(null));
        bag.set('locale', undefined);
        expect(() => bag.require('locale')).toThrow(
            expect.objectContaining({ code: SeedcordErrorCode.DispatchStateMissing })
        );
    });
});
