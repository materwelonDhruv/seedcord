import type { AutocompleteHandler } from '#handlers/interaction/AutocompleteHandler';
import type { InteractionHandler } from '#handlers/interaction/InteractionHandler';
import type { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import type { TypedConstructor } from '@seedcord/types';

export type HandlerConstructor = TypedConstructor<typeof InteractionHandler | typeof AutocompleteHandler>;

/** @internal */
export type InteractionMiddlewareConstructor = TypedConstructor<typeof InteractionMiddleware>;
