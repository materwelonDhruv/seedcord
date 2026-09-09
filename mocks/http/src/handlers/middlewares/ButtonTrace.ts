import { InteractionKind, InteractionMiddleware, prefixOf, RegisterInteractionMiddleware } from '@seedcord/http';

@RegisterInteractionMiddleware({ kinds: [InteractionKind.Button], priority: 2 })
export class ButtonTrace extends InteractionMiddleware<InteractionKind.Button> {
    public async execute(): Promise<void> {
        this.logger.info(`clicked ${prefixOf(this.event.data.custom_id)}`);

        await Promise.resolve();
    }
}
