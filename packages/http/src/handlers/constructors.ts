import type { AutocompleteHandler } from '#handlers/interaction/AutocompleteHandler';
import type { InteractionHandler } from '#handlers/interaction/InteractionHandler';
import type { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import type { TypedConstructor } from '@seedcord/types';

export type HandlerConstructor = TypedConstructor<typeof InteractionHandler | typeof AutocompleteHandler>;

// gateway names the payload here. discord sends one component payload covering buttons and every select,
// which no single kind's middleware accepts.
/** @internal */
export type InteractionMiddlewareConstructor = new (...args: never[]) => InteractionMiddleware;
