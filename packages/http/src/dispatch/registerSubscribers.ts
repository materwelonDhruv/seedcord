import { Subscriber } from '@seedcord/core';
import { RegisterSubscriber, registrationFor, SubscribeMetadataKey } from '@seedcord/core/internal';
import { SeedcordErrorCode } from '@seedcord/errors';
import { SeedcordTypeError } from '@seedcord/errors/internal';

import type { Manifest } from '#src/manifest/Manifest';
import type { Bus } from '@seedcord/core';
import type { StoredSubscriberCtor } from '@seedcord/core/internal';

function isSubscriberClass(value: unknown): value is StoredSubscriberCtor {
    if (typeof value !== 'function') return false;
    // registrationFor dereferences the @Subscribe entry without checking it
    return value.prototype instanceof Subscriber && Reflect.hasMetadata(SubscribeMetadataKey, value);
}

function nameOf(value: unknown): string {
    return typeof value === 'function' ? value.name : String(value);
}

export function registerSubscribers(bus: Bus, subscribers: Manifest['subscribers']): void {
    for (const ctor of subscribers) {
        if (!isSubscriberClass(ctor)) {
            throw new SeedcordTypeError(SeedcordErrorCode.ManifestEntryWrongClass, [
                'subscribers',
                nameOf(ctor),
                'Subscriber with @Subscribe'
            ]);
        }
        bus[RegisterSubscriber](registrationFor(ctor));
    }
}
