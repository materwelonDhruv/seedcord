import type { HookKeys } from '../types/Hooks';
import type { ConstructorFunction } from '@seedcord/types';

export const HookMetadataKey = Symbol('hook:metadata');

/**
 * Registers a hook handler class with a specific hook event.
 *
 * Associates the decorated class with a hook event type for automatic
 * registration and execution when the hook is emitted.
 *
 * @param hook - The hook event name to register for
 * @decorator
 * @example
 * ```typescript
 * \@RegisterHook('userJoin')
 * class WelcomeHandler extends HookHandler<'userJoin'> {
 *   async execute() {
 *     // Handle user join event
 *   }
 * }
 * ```
 */
export function RegisterHook<THook extends HookKeys>(hook: THook) {
  return function (constructor: ConstructorFunction): void {
    Reflect.defineMetadata(HookMetadataKey, hook, constructor);
  };
}
