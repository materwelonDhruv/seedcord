import type { Config } from './Config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Plugin } from './Plugin';
import type { Bot } from '../bot/Bot';
import type { HookController } from '../hooks/HookController';
import type { CoordinatedShutdown } from '../services/Lifecycle/CoordinatedShutdown';
import type { CoordinatedStartup } from '../services/Lifecycle/CoordinatedStartup';

/** Base interface defining core Seedcord functionality */
interface BaseCore {
  readonly bot: Bot;
  readonly hooks: HookController;
  readonly shutdown: CoordinatedShutdown;
  readonly startup: CoordinatedStartup;

  readonly config: Config;

  start(): Promise<this>;
}

/**
 * Main interface for Seedcord core functionality
 *
 * This interface can be augmented via declaration merging to add
 * type-safe plugin definitions when using `this.core#` in handlers.
 *
 * Only add classes that extend {@link Plugin} to this
 *
 * @example
 * ```typescript
 * declare module 'seedcord' {
 *   interface Core {
 *     db: Mongo;
 *   }
 * }
 * ```
 * */
export interface Core extends BaseCore {}
