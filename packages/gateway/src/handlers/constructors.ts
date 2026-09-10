import type { BaseHandler } from '#handlers/BaseHandler';
import type { EventHandler } from '#handlers/event/EventHandler';
import type { EventMiddleware } from '#handlers/event/EventMiddleware';
import type { AutocompleteHandler } from '#handlers/interaction/AutocompleteHandler';
import type { InteractionHandler } from '#handlers/interaction/InteractionHandler';
import type { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import type { ValidInteractionTypes, ValidNonInteractionKeys } from '#handlers/interactionTypes';
import type { TypedConstructor } from '@seedcord/types';
import type { ClientEvents } from 'discord.js';
import type { Constructor } from 'type-fest';

/**
 * A concrete handler narrows `event` to the one interaction or client event it serves.
 * Construct-signature parameters check contravariantly. That puts every handler class outside the
 * signature of its own base. Erasing the parameters lets one of these hold any handler class. The
 * instance type keeps the two families apart, since their events share no member.
 *
 * @internal
 */
export type HandlerConstructor = Constructor<BaseHandler<ValidInteractionTypes>, never[]>;

/** @internal The two interaction bases with their own signatures, for the site that constructs one. */
export type ConstructableHandler = TypedConstructor<typeof InteractionHandler | typeof AutocompleteHandler>;

/** @internal */
export type EventHandlerConstructor = Constructor<BaseHandler<ClientEvents[ValidNonInteractionKeys]>, never[]>;

/** @internal The event base with its own signature, for the site that constructs one. */
export type ConstructableEventHandler = TypedConstructor<typeof EventHandler>;

/** @internal */
export type InteractionMiddlewareConstructor = TypedConstructor<typeof InteractionMiddleware>;

/** @internal */
export type EventMiddlewareConstructor = TypedConstructor<typeof EventMiddleware>;
