import { HookHandler } from '../HookHandler';

import type { Seedcord } from '../../../Seedcord';
import type { AllHooks, HookKeys } from '../../types/Hooks';
import type { WebhookClient } from 'discord.js';

export abstract class WebhookLog<KeyofHooks extends HookKeys, Seed extends Seedcord = Seedcord> extends HookHandler<
  KeyofHooks,
  Seedcord
> {
  abstract webhook: WebhookClient;

  constructor(data: AllHooks[KeyofHooks], core: Seed) {
    super(data, core);
  }
}
