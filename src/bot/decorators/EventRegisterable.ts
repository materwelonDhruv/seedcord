import type { ClientEvents } from 'discord.js';

import type { ConstructorFunction } from '../../core/library/types/Miscellaneous';

export const EventMetadataKey = Symbol('event:metadata');

export function RegisterEvent<T extends keyof ClientEvents>(eventName: T) {
  return function (constructor: ConstructorFunction): void {
    Reflect.defineMetadata(EventMetadataKey, eventName, constructor);
  };
}
