import { InteractionMiddleware, RegisterInteractionMiddleware } from '@seedcord/gateway';

@RegisterInteractionMiddleware()
export class InteractionLogger0 extends InteractionMiddleware {
    public async execute(): Promise<void> {
        this.logger.info(`interaction received → Priority 0 by ${this.event.user.username} (${this.event.user.id})`);

        await Promise.resolve();
    }
}
