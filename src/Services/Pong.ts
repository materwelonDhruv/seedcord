import { ChatInputCommandInteraction } from 'discord.js';
import { Event } from '../../lib';
import { GeneralUtils } from '../Utilities';

export class Pong extends Event<ChatInputCommandInteraction> {
  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
  }

  public async execute(): Promise<void> {
    try {
      await this.event.reply('Pong!');
    } catch (error: unknown) {
      const errorEmbed = GeneralUtils.getErrorEmbed(error);

      console.error(error);
      await this.event.reply({ embeds: [errorEmbed.getComponent] });
    }
  }
}
