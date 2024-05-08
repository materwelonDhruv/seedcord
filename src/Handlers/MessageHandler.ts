import { Message } from 'discord.js';
// import { Config } from '../../Utilities';
import { IEventHandler } from '../Interfaces';

export class MessageHandler implements IEventHandler {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  public async execute(): Promise<void> {}
}
