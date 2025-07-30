import { HookHandler } from '../HookHandler';

import type { HookKeys } from '../../types/Hooks';
import type { WebhookClient } from 'discord.js';

export abstract class WebhookLog<KeyofHooks extends HookKeys> extends HookHandler<KeyofHooks> {
  abstract webhook: WebhookClient;
}
