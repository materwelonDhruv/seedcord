import type { ClientOptions } from 'discord.js';

// interactions, events, commands, services, hooks

interface InteractionsConfig {
  /**
   * Path for interaction hooks, such as slash commands and buttons.
   */
  path: string;
}

interface EventsConfig {
  /**
   * Path for event hooks.
   */
  path: string;
}

interface CommandsConfig {
  /**
   * Path for command hooks.
   */
  path: string;
}

interface HooksConfig {
  /**
   * Path for hook hooks.
   */
  path: string;
}

export interface Config {
  /**
   * Discord interaction hooks configuration
   */
  interactions: InteractionsConfig;

  /**
   * Discord event hooks configuration
   */
  events: EventsConfig;

  /**
   * Discord command registry configuration
   */
  commands: CommandsConfig;

  /**
   * Discord hook hooks configuration
   */
  hooks: HooksConfig;

  /**
   * Discord.js ClientOptions passed directly to the Client constructor
   */
  clientOptions: ClientOptions;
}
