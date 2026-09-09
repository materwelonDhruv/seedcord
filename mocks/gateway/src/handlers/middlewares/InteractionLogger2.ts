import { InteractionMiddleware, RegisterInteractionMiddleware } from '@seedcord/gateway';

@RegisterInteractionMiddleware({ priority: 2 })
export class InteractionLogger2 extends InteractionMiddleware {
    public async execute(): Promise<void> {
        this.logger.info(`interaction received → Priority 2 by ${this.event.user.username} (${this.event.user.id})`);

        await Promise.resolve();
    }
}
