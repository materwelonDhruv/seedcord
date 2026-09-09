import { InteractionMiddleware, RegisterInteractionMiddleware } from '@seedcord/http';

@RegisterInteractionMiddleware()
export class RequestLog extends InteractionMiddleware {
    public async execute(): Promise<void> {
        const user = this.event.member?.user ?? this.event.user;
        this.logger.info(`${this.dispatch.routeId} from ${user?.username ?? 'unknown'}`);

        await Promise.resolve();
    }
}
