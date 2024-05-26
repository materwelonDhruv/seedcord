import {
  Message,
  ChatInputCommandInteraction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalSubmitInteraction
} from 'discord.js';

export type ValidEventTypes =
  | Message
  | ChatInputCommandInteraction
  | ButtonInteraction
  | StringSelectMenuInteraction
  | ModalSubmitInteraction;

export type ExecutableInteraction = Executable<
  Exclude<ValidEventTypes, Message>
>;
/**
 * All interactions with the bot including Handlers and what those handlers do or pass to other services should extend this class.
 * @template T - A type that extends one of the ValidEventTypes. Can add more types to the ValidEventTypes union type if needed.
 */
export abstract class Executable<T extends ValidEventTypes> {
  protected event: T;

  constructor(event: T) {
    this.event = event;
  }

  abstract execute(): Promise<void>;
}
