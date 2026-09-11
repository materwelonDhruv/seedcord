import { PublishDefault } from '@seedcord/core/internal';

import type { Core } from '#interfaces/Core';
import type { EventDispatchResult, SubscriptionData } from '@seedcord/core';
import type { ClientEvents } from 'discord.js';

export function reportEventDispatching<Name extends keyof ClientEvents>(
    core: Core,
    dispatchId: string,
    name: Name,
    args: ClientEvents[Name]
): void {
    // justified: the generic key erases the per-event tuple and args matches name here
    core.bus[PublishDefault]('eventDispatching', { dispatchId, name, args } as SubscriptionData<'eventDispatching'>);
}

// the interaction side of this is core's reportDispatch
export function reportEventDispatched(
    core: Core,
    dispatchId: string,
    name: keyof ClientEvents,
    result: EventDispatchResult,
    startedAt: number
): void {
    core.bus[PublishDefault]('eventDispatched', {
        dispatchId,
        name,
        outcome: result.outcome,
        handlers: result.handlers.map(({ handler, outcome }) => ({ handler, outcome })),
        durationMs: performance.now() - startedAt
    });
}
