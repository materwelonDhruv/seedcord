import { Message } from 'discord.js';
import { Executable } from '../../lib';

export class MessageHandler extends Executable<Message> {
  constructor(message: Message) {
    super(message);
  }

  public async execute(): Promise<void> {}
}
