import type { ClientEvents } from 'discord.js';
import type { Constructor } from 'type-fest';

export const EventMetadataKey = Symbol('event:metadata');

/**
 * Registers an event handler class with a specific Discord.js event.
 *
 * Associates the decorated class with a Discord client event for automatic
 * registration and execution when the event is emitted.
 *
 * @typeParam KeyofEvents - The key of the Discord.js ClientEvents to register for
 * @param eventName - The Discord.js event name to listen for
 * @decorator
 * @example
 * ```typescript
 * \@RegisterEvent(Events.MessageCreate)
 * class MessageHandler extends EventHandler<Events.MessageCreate> {
 *   async execute() {
 *     // Handle message creation
 *   }
 * }
 * ```
 */
export function RegisterEvent<KeyofEvents extends keyof ClientEvents>(eventName: KeyofEvents) {
    return function (constructor: Constructor<unknown>): void {
        Reflect.defineMetadata(EventMetadataKey, eventName, constructor);
    };
}
