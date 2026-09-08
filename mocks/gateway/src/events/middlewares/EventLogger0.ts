import { EventMiddleware, RegisterEventMiddleware } from '@seedcord/gateway';
import { Events } from 'discord.js';

/**
 * a single-event middleware. `this.event` is the typed messageCreate payload.
 */
@RegisterEventMiddleware({ events: [Events.MessageCreate] })
export class MiddlewareLogger0 extends EventMiddleware<Events.MessageCreate> {
    public async execute(): Promise<void> {
        const [message] = this.event;
        this.logger.info(`message received → Priority 0 by ${message.author.username} (${message.author.id})`);
        await message.react('🧠');
    }
}
