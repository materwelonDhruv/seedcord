import type { Seedcord } from '../../Seedcord';
import type { AllHooks, HookKeys } from '../types/Hooks';

export abstract class HookHandler<KeyOfHooks extends HookKeys, Seed extends Seedcord = Seedcord> {
  constructor(
    protected readonly data: AllHooks[KeyOfHooks],
    protected readonly core: Seed
  ) {
    this.data = data;
    this.core = core;
  }

  abstract execute(): Promise<void>;
}
