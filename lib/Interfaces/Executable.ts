import {
  Message,
  ChatInputCommandInteraction,
  ButtonInteraction
} from 'discord.js';

export interface IEventHandler {
  execute(): Promise<void>;
}

type ValidEventTypes =
  | Message
  | ChatInputCommandInteraction
  | ButtonInteraction;

export abstract class Event<T extends ValidEventTypes>
  implements IEventHandler
{
  protected event: T;

  constructor(event: T) {
    this.event = event;
  }

  abstract execute(): Promise<void>;
}
