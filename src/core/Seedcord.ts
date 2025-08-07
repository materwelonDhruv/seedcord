import chalk from 'chalk';

import { Bot } from '../bot/Bot';
import { Mongo } from './database/Database';
import { HookController } from './hooks/HookController';
import { CoordinatedShutdown } from './services/CoordinatedShutdown';
import { HealthCheck } from './services/HealthCheck';
import { Logger } from './services/Logger';

import type { Config } from './library/interfaces/Config';
import type { Core } from './library/interfaces/Core';
import type { PluginArgs, PluginCtor } from './library/interfaces/Plugin';

export class Seedcord implements Core {
  private static isInstantiated = false;
  private isInitialized = false;
  private readonly logger = new Logger('CoreBot');

  private readonly pluginOrder = new Map<string, InstanceType<PluginCtor>>();

  public readonly shutdown: CoordinatedShutdown = CoordinatedShutdown.instance;

  public readonly db: Mongo;
  public readonly hooks: HookController;
  public readonly bot: Bot;
  private readonly healthCheck: HealthCheck;

  constructor(public readonly config: Config) {
    if (Seedcord.isInstantiated) {
      throw new Error('CoreBot can only be instantiated once. Use the existing instance instead.');
    }
    Seedcord.isInstantiated = true;

    this.db = new Mongo(this);
    this.hooks = new HookController(this);
    this.bot = new Bot(this);
    this.healthCheck = new HealthCheck(this);
  }

  public async start(): Promise<void> {
    this.logger.info(chalk.bold('Starting Database'));
    await this.db.start();
    this.logger.info(chalk.bold('Database started'));

    this.logger.info(chalk.bold('Initializing Hooks'));
    await this.hooks.init();
    this.logger.info(chalk.bold('Hooks initialized'));

    this.logger.info(chalk.bold('Starting Bot'));
    await this.bot.init();
    this.logger.info(chalk.bold('Bot started'));

    this.logger.info(chalk.bold('Starting Health Check'));
    await this.healthCheck.start();
    this.logger.info(chalk.bold('Health Check started'));

    this.isInitialized = true;
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

    const instance = new Plugin(this, ...args);

    const entry = {
      [key]: instance
    } as Record<Key, InstanceType<Ctor>>;

    this.pluginOrder.set(key, instance);

    return Object.assign(this, entry) as unknown as this & Record<Key, InstanceType<Ctor>>;
  }
}
