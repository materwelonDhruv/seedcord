import { ChatInputCommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import { GeneralFunctions } from '../Helpers';

export class Pong extends Event<ChatInputCommandInteraction> {
  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
  }

  public async execute(): Promise<void> {
    try {
      await this.event.reply('Pong!');
    } catch (error: unknown) {
      const errorEmbed = GeneralFunctions.getErrorEmbed(error);

      console.error(error);
      await this.event.reply({ embeds: [errorEmbed.getComponent] });
    }
  }
}
