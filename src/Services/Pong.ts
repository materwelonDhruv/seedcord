import { ChatInputCommandInteraction } from 'discord.js';
import { ErrorUtils, Executable } from '../../lib';

export class Pong extends Executable<ChatInputCommandInteraction> {
  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
  }

  public async execute(): Promise<void> {
    try {
      await this.event.reply('Pong!');
    } catch (error: unknown) {
      console.error(error);
      await this.event.reply({
        embeds: [ErrorUtils.getErrorEmbed(error).getComponent]
      });
    }
  }
}
