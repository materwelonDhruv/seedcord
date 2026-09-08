import { asError } from '#stops/asError';

import { outcomeFor } from './dispatchReport';

import type { DispatchResult } from './dispatchResult';
import type { Logger } from '@seedcord/logger';

interface Afterable {
    after?(result: DispatchResult): Promise<void>;
}

/** @internal */
export function resultFor(caught: unknown): DispatchResult {
    const outcome = outcomeFor(caught);
    return outcome === 'handled' ? { outcome } : { outcome, caught };
}

/**
 * Calls `after()` on each middleware that ran, newest first. A throw inside one is logged. Every
 * remaining middleware still gets its call.
 *
 * @internal
 */
export async function runAfter(ran: readonly Afterable[], result: DispatchResult, logger: Logger): Promise<void> {
    for (let index = ran.length - 1; index >= 0; index--) {
        const middleware = ran[index];
        try {
            await middleware?.after?.(result);
        } catch (caught) {
            logger.error(`${middleware?.constructor.name ?? 'A middleware'} threw from after()`, asError(caught));
        }
    }
}
