import { HookHandler } from '../HookHandler';

import type { Core } from '../../../interfaces/Core';
import type { AllHooks, HookKeys } from '../../types/Hooks';
import type { WebhookClient } from 'discord.js';

/**
 * Abstract webhook logging handler for hook events.
 *
 * Extends HookHandler to provide webhook-based logging capabilities.
 * Implementations must define the webhook client to send messages to.
 *
 * @template KeyofHooks - The specific hook event type this handler processes
 * @virtual
 */
export abstract class WebhookLog<KeyofHooks extends HookKeys> extends HookHandler<KeyofHooks> {
  /** The Discord webhook client for sending log messages */
  abstract webhook: WebhookClient;

  constructor(data: AllHooks[KeyofHooks], core: Core) {
    super(data, core);
  }
}
