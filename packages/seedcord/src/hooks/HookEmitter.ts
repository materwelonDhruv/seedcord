import { EventEmitter } from 'events';

import type { AllHooks, HookKeys } from './types/Hooks';

/**
 * Type-safe event emitter for application hooks.
 *
 * Provides a strongly-typed wrapper around Node.js EventEmitter
 * for Seedcord's hook system.
 *
 * @template AllHooks - Hook definitions mapping event names to data types
 */
export class HookEmitter {
  private readonly emitter = new EventEmitter();

  /**
   * Registers a listener for the specified hook event.
   *
   * @template KeyOfHooks - The hook event name type
   * @param event - The hook event name to listen for
   * @param listener - Function to call when the event is emitted
   * @returns This HookEmitter instance for chaining
   */
  public on<KeyOfHooks extends HookKeys>(event: KeyOfHooks, listener: (data: AllHooks[KeyOfHooks]) => void): this {
    this.emitter.on(event, listener);
    return this;
  }

  /**
   * Registers a one-time listener for the specified hook event.
   *
   * @template KeyOfHooks - The hook event name type
   * @param event - The hook event name to listen for once
   * @param listener - Function to call when the event is emitted
   * @returns This HookEmitter instance for chaining
   */
  public once<KeyOfHooks extends HookKeys>(event: KeyOfHooks, listener: (data: AllHooks[KeyOfHooks]) => void): this {
    this.emitter.once(event, listener);
    return this;
  }

  /**
   * Emits a hook event with the provided data.
   *
   * @template KeyOfHooks - The hook event name type
   * @param event - The hook event name to emit
   * @param data - The data to pass to registered listeners
   * @returns True if the event had listeners, false otherwise
   */
  public emit<KeyOfHooks extends HookKeys>(event: KeyOfHooks, data: AllHooks[KeyOfHooks]): boolean {
    return this.emitter.emit(event, data);
  }
}
