import { ChatInputCommandInteraction } from 'discord.js';
import { IEventHandler } from '../Interfaces';
import { Pong } from '../Services';

export class SlashCommandHandler implements IEventHandler {
  private interaction: ChatInputCommandInteraction;

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
  }

  private getHandler(): IEventHandler | null {
    switch (this.interaction.commandName) {
      case 'ping':
        return new Pong(this.interaction);
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
