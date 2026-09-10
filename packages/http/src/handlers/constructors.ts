import type { AutocompleteHandler } from '#handlers/interaction/AutocompleteHandler';
import type { InteractionHandler } from '#handlers/interaction/InteractionHandler';
import type { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import type { Core } from '#interfaces/Core';
import type { BaseHandler } from '@seedcord/core';
import type { TypedConstructor } from '@seedcord/types';
import type { Constructor } from 'type-fest';

type HandlerBases = typeof InteractionHandler | typeof AutocompleteHandler;

type AnyHandler = BaseHandler<unknown, Core>;

/**
 * A concrete handler narrows `event` to its own interaction type. Construct-signature parameters check
 * contravariantly. That puts every handler class outside the signature of its own base. Erasing the
 * parameters lets a manifest list the classes.
 */
export type HandlerConstructor = Constructor<AnyHandler, never[]>;

/** The two bases with their own signatures, for the one site that constructs a handler. */
export type ConstructableHandler = TypedConstructor<HandlerBases>;

/** @internal */
export type InteractionMiddlewareConstructor = TypedConstructor<typeof InteractionMiddleware>;
