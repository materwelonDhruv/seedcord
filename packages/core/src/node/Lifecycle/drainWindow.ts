import { settleWithin } from './withTimeout';

import type { Logger } from '@seedcord/logger';

// gateway already used 5s. discord's 3s first-ack deadline is the floor.
export const DRAIN_WINDOW_MS = 5000;

// leaves room for the inner drain to settle before the task timeout fires
const DRAIN_HEADROOM_MS = 1000;
export const DRAIN_TASK_TIMEOUT_MS = DRAIN_WINDOW_MS + DRAIN_HEADROOM_MS;

/** @internal */
export async function drainInFlight(
    inFlight: ReadonlySet<Promise<unknown>>,
    timeoutMs: number,
    logger: Logger,
    label: string
): Promise<void> {
    await settleWithin(Promise.allSettled(inFlight), timeoutMs);
    // process exit is what stops these, so the count is the last chance to see them
    if (inFlight.size > 0) logger.warn(`${label}: ${String(inFlight.size)} still running when the drain window closed`);
}
