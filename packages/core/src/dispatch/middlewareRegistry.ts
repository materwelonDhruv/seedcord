import { SeedcordErrorCode } from '@seedcord/errors';
import { SeedcordError } from '@seedcord/errors/internal';

import { interactionMiddlewareMetaOf } from '#decorators/middleware';
import { InteractionKind } from '#src/metadataKeys';

import type { InteractionMiddlewareMetadata } from '#decorators/middleware';
import type { MiddlewareKind } from '#src/metadataKeys';

/** The ten kinds a middleware can run on, derived so a kind added to the enum joins on its own. */
const MIDDLEWARE_KINDS: readonly MiddlewareKind[] = Object.values(InteractionKind).filter(
    (kind): kind is MiddlewareKind => kind !== InteractionKind.Autocomplete
);

type AnyMiddlewareCtor = new (...args: never[]) => unknown;

interface Entry<Ctor> {
    readonly ctor: Ctor;
    readonly priority: number;
    readonly kinds?: ReadonlySet<MiddlewareKind>;
}

function emptyChains<Ctor>(): Record<MiddlewareKind, Ctor[]> {
    const chains = {} as Record<MiddlewareKind, Ctor[]>;
    for (const kind of MIDDLEWARE_KINDS) chains[kind] = [];
    return chains;
}

/**
 * Holds the interaction middleware a transport loaded and keeps one chain per kind. Both transports
 * register through this. Priority and the kinds filter behave the same on each.
 *
 * @typeParam Ctor - The transport's middleware constructor type.
 *
 * @internal
 */
export class MiddlewareRegistry<Ctor extends AnyMiddlewareCtor> {
    private readonly entries: Entry<Ctor>[] = [];
    private chains = emptyChains<Ctor>();

    /**
     * Adds a decorated middleware class and returns its metadata. Returns `undefined` for an undecorated
     * class or one already registered.
     *
     * @throws A **SeedcordError** If another class with the same name is registered.
     */
    public register(ctor: Ctor): InteractionMiddlewareMetadata | undefined {
        const metadata = interactionMiddlewareMetaOf(ctor);
        if (!metadata) return undefined;

        // a double import or an hmr re-scan hands us the same class again
        if (this.entries.some((entry) => entry.ctor === ctor)) return undefined;
        if (this.entries.some((entry) => entry.ctor.name === ctor.name)) {
            throw new SeedcordError(SeedcordErrorCode.InteractionDuplicateMiddleware, [ctor.name]);
        }

        this.entries.push({
            ctor,
            priority: metadata.priority,
            ...(metadata.kinds && { kinds: new Set(metadata.kinds) })
        });
        this.rebuild();
        return metadata;
    }

    public unregister(ctor: Ctor): void {
        const index = this.entries.findIndex((entry) => entry.ctor === ctor);
        if (index === -1) return;
        this.entries.splice(index, 1);
        this.rebuild();
    }

    public chainFor(kind: MiddlewareKind): readonly Ctor[] {
        return this.chains[kind];
    }

    private rebuild(): void {
        // a stable sort keeps ties in registration order
        this.entries.sort((a, b) => a.priority - b.priority);

        const chains = emptyChains<Ctor>();
        for (const entry of this.entries) {
            for (const kind of MIDDLEWARE_KINDS) {
                if (!entry.kinds || entry.kinds.has(kind)) chains[kind].push(entry.ctor);
            }
        }
        this.chains = chains;
    }
}
