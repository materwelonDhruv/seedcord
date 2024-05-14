import { Message } from 'discord.js';
import { IEventHandler } from '../../lib';

export class MessageHandler implements IEventHandler {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  public async execute(): Promise<void> {}
}
