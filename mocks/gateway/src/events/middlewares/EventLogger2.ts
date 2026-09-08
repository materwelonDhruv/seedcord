import { EventMiddleware, RegisterEventMiddleware } from '@seedcord/gateway';

/**
 * a catchall middleware. omitting `{ events }` leaves `this.event` as `never`. `this.eventName` carries
 * the fired event.
 */
@RegisterEventMiddleware({ priority: 2 })
export class MiddlewareLogger2 extends EventMiddleware {
    public async execute(): Promise<void> {
        this.logger.info(`event → Priority 2 (${this.eventName})`);
        await Promise.resolve();
    }
}
