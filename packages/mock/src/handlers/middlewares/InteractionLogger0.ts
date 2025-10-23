import { Middleware, MiddlewareType, InteractionMiddleware, type Repliables, Logger } from 'seedcord';

/**
 * Logs incoming interactions before handlers execute.
 */
@Middleware(MiddlewareType.Interaction, 0)
export class InteractionLogger0 extends InteractionMiddleware<Repliables> {
    public async execute(): Promise<void> {
        Logger.Info(
            'Interaction Middleware',
            `interaction received → Priority 0 by ${this.event.user.username} (${this.event.user.id})`
        );

        await Promise.resolve();
    }
}
