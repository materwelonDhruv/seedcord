import { ChatInputCommandInteraction } from 'discord.js';
import { Executable } from '../../lib';
import { Pong } from '../Services';

export class SlashCommandHandler extends Executable<ChatInputCommandInteraction> {
  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
  }

  private getHandler(): Executable<ChatInputCommandInteraction> | null {
    switch (this.event.commandName) {
      case 'ping':
        return new Pong(this.event);
      default:
        return null;
    }
  }

  public async execute(): Promise<void> {
    const handler = this.getHandler();

    if (handler) {
      await handler.execute();
    }
  }
}
