import type { Core } from './Core';
import type { Tail } from '../types/Miscellaneous';

export interface Initializeable {
  init(): Promise<void>;
}

export abstract class Plugin implements Initializeable {
  constructor(protected pluggable: Core) {}
  abstract init(): Promise<void>;
}

/** A plugin constructor can accept any tail of args after Core */
export type PluginCtor<TPlugin extends Plugin = Plugin> = new (core: Core, ...args: any[]) => TPlugin;

/** Convenience: the argument list a given constructor expects */
export type PluginArgs<Ctor extends PluginCtor> = Tail<ConstructorParameters<Ctor>>;

export class Pluggable {
  protected isInitialized = false;
  protected readonly pluginOrder = new Map<string, InstanceType<PluginCtor>>();

  protected async init(): Promise<this> {
    if (this.isInitialized) return this;

    for (const [_key, Plugin] of this.pluginOrder) await Plugin.init();
    this.isInitialized = true;

    return this;
  }

  public attach<Key extends string, Ctor extends PluginCtor>(
    this: this,
    key: Key,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Plugin: Ctor,
    ...args: PluginArgs<Ctor>
  ): this & Record<Key, InstanceType<Ctor>> {
    if (this.isInitialized) throw new Error('Cannot attach a plugin after initialization.');
    if ((this as Record<string, unknown>)[key]) throw new Error(`Plugin with key "${key}" already exists.`);

    const instance = new Plugin(this as unknown as Core, ...args);

    const entry = {
      [key]: instance
    } as Record<Key, InstanceType<Ctor>>;

    this.pluginOrder.set(key, instance);

    return Object.assign(this, entry) as unknown as this & Record<Key, InstanceType<Ctor>>;
  }
}
