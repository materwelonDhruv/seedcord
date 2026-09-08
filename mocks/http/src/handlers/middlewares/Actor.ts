import { InteractionMiddleware, RegisterInteractionMiddleware } from '@seedcord/http';

declare module '@seedcord/http' {
    interface DispatchState {
        actor: string;
    }
}

@RegisterInteractionMiddleware({ priority: 1 })
export class Actor extends InteractionMiddleware {
    public async execute(): Promise<void> {
        const user = this.event.member?.user ?? this.event.user;
        this.dispatch?.set('actor', user?.username ?? 'someone');

        await Promise.resolve();
    }
}
