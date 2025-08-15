import type { Core } from '../../interfaces/Core';
import type { AllHooks, HookKeys } from '../types/Hooks';

/**
 * Abstract base class for handling application hooks.
 *
 * Provides type-safe access to hook data and the core framework instance.
 * Extend this class to create custom hook handlers.
 *
 * @template KeyOfHooks - The specific hook event type this handler processes
 * @virtual
 */
export abstract class HookHandler<KeyOfHooks extends HookKeys> {
  /**
   * Creates a new hook handler instance.
   *
   * @param data - The hook event data
   * @param core - The core framework instance
   */
  constructor(
    protected readonly data: AllHooks[KeyOfHooks],
    protected readonly core: Core
  ) {
    this.data = data;
    this.core = core;
  }

  /**
   * Executes the hook handler logic.
   * @virtual Must be implemented by subclasses.
   */
  abstract execute(): Promise<void>;
}
