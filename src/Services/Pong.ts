import { ChatInputCommandInteraction } from 'discord.js';
import { Executable } from '../../lib';
import { Catchable } from '../Middleware';

export class Pong extends Executable<ChatInputCommandInteraction> {
  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
  }

  @Catchable()
  public async execute(): Promise<void> {
    await this.event.reply('Pong!');
  }
}
