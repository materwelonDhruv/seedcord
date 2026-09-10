import { PublishDefault } from '@seedcord/core/internal';

import type { Core } from '#interfaces/Core';
import type { EventDispatchResult } from '@seedcord/core';
import type { ClientEvents } from 'discord.js';

// the interaction side of this is core's reportDispatch
export function reportEventDispatch(
    core: Core,
    name: keyof ClientEvents,
    result: EventDispatchResult,
    startedAt: number
): void {
    core.bus[PublishDefault]('eventDispatched', {
        name,
        outcome: result.outcome,
        handlers: result.handlers.map(({ handler, outcome }) => ({ handler, outcome })),
        durationMs: performance.now() - startedAt
    });
}
