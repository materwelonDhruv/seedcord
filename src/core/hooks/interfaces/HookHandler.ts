import type { AllHooks, HookKeys } from '../types/Hooks';

export abstract class HookHandler<KeyOfHooks extends HookKeys> {
  protected data: AllHooks[KeyOfHooks];

  constructor(data: AllHooks[KeyOfHooks]) {
    this.data = data;
  }

  abstract execute(): Promise<void>;
}
