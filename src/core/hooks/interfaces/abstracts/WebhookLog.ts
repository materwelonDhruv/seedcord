import type { WebhookClient } from 'discord.js';

import type { HookKeys } from '../../types/Hooks';
import { HookHandler } from '../HookHandler';

export abstract class WebhookLog<T extends HookKeys> extends HookHandler<T> {
  abstract webhook: WebhookClient;
}
