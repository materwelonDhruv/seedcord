import type { ClientOptions } from 'discord.js';

// interactions, events, commands, services, hooks

interface InteractionsConfig {
  /**
   * Path for interaction handlers, such as slash commands and buttons.
   */
  path: string;
}

interface EventsConfig {
  /**
   * Path for event handlers.
   */
  path: string;
}

interface CommandsConfig {
  /**
   * Path for command handlers.
   */
  path: string;
}

interface ServicesConfig {
  /**
   * Path for service handlers.
   */
  path: string;
}

interface HooksConfig {
  /**
   * Path for hook handlers.
   */
  path: string;
}

export interface Config {
  /**
   * Discord interaction handlers configuration
   */
  interactions: InteractionsConfig;

  /**
   * Discord event handlers configuration
   */
  events: EventsConfig;

  /**
   * Discord command registry configuration
   */
  commands: CommandsConfig;

  /**
   * Discord service handlers configuration
   */
  services: ServicesConfig;

  /**
   * Discord hook handlers configuration
   */
  hooks: HooksConfig;

  /**
   * Discord.js ClientOptions passed directly to the Client constructor
   */
  clientOptions: ClientOptions;
}
