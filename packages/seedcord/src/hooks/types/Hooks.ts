import type { Nullable } from '@seedcord/types';
import type { UUID } from 'crypto';
import type { Guild, User } from 'discord.js';

/**
 * Default hook events that are always available in the framework.
 */
export interface DefaultHooks {
  /** Triggered when an unhandled exception occurs */
  unknownException: { uuid: UUID; error: Error; guild: Nullable<Guild>; user: Nullable<User> };
}

/**
 * Custom hook events defined by the application.
 *
 * This interface can be augmented via declaration merging to add
 * type-safe custom hook definitions for application-specific events.
 *
 * @example
 * ```typescript
 * declare module 'seedcord' {
 *   interface Hooks {
 *     'userJoin': { user: User; guild: Guild };
 *     'levelUp': { user: User; level: number; guild: Guild };
 *   }
 * }
 * ```
 */
export interface Hooks {}

/**
 * Combined hooks interface containing both default and custom hooks.
 */
export interface AllHooks extends DefaultHooks, Hooks {}

/**
 * Helper type to extract all available hook event names.
 */
export type HookKeys = keyof AllHooks;

/**
 * Helper type to get parameters for a specific hook event.
 *
 * @template KeyOfHooks - The hook event name
 */
export type HookParams<KeyOfHooks extends HookKeys> = AllHooks[KeyOfHooks];
