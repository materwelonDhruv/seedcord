import type { ClientOptions } from 'discord.js';

export interface HealthCheckConfig {
  port: number;
  path: string;
}

export interface PathConfig {
  commands: string;
  events: string;
  handlers: string;
  services: string;
}

export interface CoreBotConfig {
  /**
   * Discord bot token
   */
  token: string;

  /**
   * Path configuration for various components
   */
  paths: PathConfig;

  /**
   * Discord.js ClientOptions passed directly to the Client constructor
   */
  clientOptions?: ClientOptions;

  /**
   * Health check configuration. Set to false to disable health check.
   */
  healthCheck?: HealthCheckConfig | false;

  /**
   * Enable or disable coordinated shutdown
   * @default true
   */
  coordinatedShutdown?: boolean;

  /**
   * MongoDB connection URI
   * @default 'mongodb://localhost:27017/'
   */
  mongoUri?: string;

  /**
   * Database name
   * @default 'seedcord'
   */
  dbName?: string;
}
