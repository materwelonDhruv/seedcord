import { EventMiddleware, RegisterEventMiddleware } from '@seedcord/gateway';
import { Events } from 'discord.js';

/**
 * a multi-event middleware runs the same for every event it lists. `this.eventName` carries the fired
 * event, since `this.event` is `never` here.
 */
@RegisterEventMiddleware({
    events: [Events.MessageCreate, Events.MessageDelete, Events.MessageUpdate],
    priority: 1
})
export class MiddlewareLogger1 extends EventMiddleware<
    Events.MessageCreate | Events.MessageDelete | Events.MessageUpdate
> {
    public async execute(): Promise<void> {
        this.logger.info(`message event → Priority 1 (${this.eventName})`);
        await Promise.resolve();
    }
}
