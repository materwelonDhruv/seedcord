import { SeedcordErrorCode } from '@seedcord/errors';
import { SeedcordError } from '@seedcord/errors/internal';

/**
 * The per-dispatch bag. Any code can merge fields into it by declaration merging, the
 * same pattern as {@link SlashRegistry}. It stays empty until one does, so `keyof DispatchState` is
 * `never` and the bag is inert.
 */
export interface DispatchState {}

/**
 * A typed bag allocated once per interaction dispatch and handed to the handler. The middleware and i18n
 * work reads and writes it through {@link DispatchState}. Today the bag is empty, so it only carries the
 * dispatched `routeId`.
 */
export class DispatchContext {
    private readonly state: Partial<DispatchState> = {};

    constructor(public readonly routeId: string | null) {}

    set<Key extends keyof DispatchState>(key: Key, value: DispatchState[Key]): void {
        this.state[key] = value;
    }

    get<Key extends keyof DispatchState>(key: Key): DispatchState[Key] | undefined {
        return this.state[key];
    }

    /**
     * Read a key that must be present, with `undefined` stripped from the result.
     *
     * @throws A **SeedcordError** If nothing set the key on this dispatch.
     */
    require<Key extends keyof DispatchState>(key: Key): Exclude<DispatchState[Key], undefined> {
        const value = this.state[key];
        // a key holding null was still set
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- an empty DispatchState types every value as undefined
        if (value === undefined) throw new SeedcordError(SeedcordErrorCode.DispatchStateMissing, [String(key)]);
        return value;
    }
}
