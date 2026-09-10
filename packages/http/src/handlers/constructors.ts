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
 * Any handler class, for a manifest to list. Typed construct parameters would exclude every handler
 * that narrows `event` to its own interaction type.
 */
export type HandlerConstructor = Constructor<AnyHandler, never[]>;

/** The two bases with their own signatures, for the one site that constructs a handler. */
export type ConstructableHandler = TypedConstructor<HandlerBases>;

/** @internal */
export type InteractionMiddlewareConstructor = TypedConstructor<typeof InteractionMiddleware>;
