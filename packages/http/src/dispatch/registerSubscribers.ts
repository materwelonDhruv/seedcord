import { Subscriber } from '@seedcord/core';
import { RegisterSubscriber, registrationFor } from '@seedcord/core/internal';
import { SeedcordErrorCode } from '@seedcord/errors';
import { SeedcordTypeError } from '@seedcord/errors/internal';

import type { Manifest } from '#src/manifest/Manifest';
import type { Bus } from '@seedcord/core';

export function registerSubscribers(bus: Bus, subscribers: Manifest['subscribers']): void {
    for (const ctor of subscribers) {
        // a hand-authored manifest reaches here too. the emitter cannot be the only check.
        if (!(ctor.prototype instanceof Subscriber)) {
            throw new SeedcordTypeError(SeedcordErrorCode.ManifestEntryWrongClass, [
                'subscribers',
                ctor.name,
                'Subscriber'
            ]);
        }
        bus[RegisterSubscriber](registrationFor(ctor));
    }
}
