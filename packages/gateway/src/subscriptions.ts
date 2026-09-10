import type { DispatchOutcome, HandlerOutcome } from '@seedcord/core';
import type { ClientEvents, Interaction } from 'discord.js';

declare module '@seedcord/core/internal' {
    interface DefaultSubscriptions {
        /** Triggered when an event dispatch throws past the fault boundary. */
        unhandledEventError: {
            error: Error;
        };
        /** Triggered before an event's handlers run. An event that no handler registered never triggers it. */
        eventDispatching: {
            [Name in keyof ClientEvents]: { name: Name; args: ClientEvents[Name] };
        }[keyof ClientEvents];
        /**
         * Triggered once an event's handlers settle, pairing with `eventDispatching`. A fire that runs no
         * handler triggers neither.
         */
        eventDispatched: {
            name: keyof ClientEvents;
            /** How the middleware chain ended. A chain that refused the event leaves `handlers` empty. */
            outcome: DispatchOutcome;
            /** One entry per handler that ran, in the order they ran. */
            handlers: readonly HandlerOutcome[];
            /** Dispatch entry until every handler settles. A clock change never affects it. */
            durationMs: number;
        };
        /** Triggered for every interaction the bot receives, before routing. */
        anyInteraction: {
            interaction: Interaction;
        };
    }
}
