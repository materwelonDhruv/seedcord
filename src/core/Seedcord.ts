import chalk from 'chalk';

import { Bot } from '../bot/Bot';
import { Mongo } from './database/Database';
import { HookController } from './hooks/HookController';
import { Pluggable } from './library/interfaces/Plugin';
import { CoordinatedShutdown } from './services/CoordinatedShutdown';
import { HealthCheck } from './services/HealthCheck';
import { Logger } from './services/Logger';

import type { Config } from './library/interfaces/Config';
import type { Core } from './library/interfaces/Core';

export class Seedcord extends Pluggable implements Core {
  private static isInstantiated = false;
  private readonly logger = new Logger('CoreBot');

  public readonly shutdown: CoordinatedShutdown = CoordinatedShutdown.instance;

  public readonly db: Mongo;
  public readonly hooks: HookController;
  public readonly bot: Bot;
  private readonly healthCheck: HealthCheck;

  constructor(public readonly config: Config) {
    super();

    if (Seedcord.isInstantiated) {
      throw new Error('CoreBot can only be instantiated once. Use the existing instance instead.');
    }
    Seedcord.isInstantiated = true;

    this.db = new Mongo(this as unknown as Core);
    this.hooks = new HookController(this as unknown as Core);
    this.bot = new Bot(this as unknown as Core);
    this.healthCheck = new HealthCheck(this as unknown as Core);
  }

  public async start(): Promise<void> {
    this.logger.info(chalk.bold('Starting Database'));
    await this.db.init();
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

    // Initialize plugins after all core services are started
    await super.init();
  }
}

// Type assertion to tell TypeScript that plugins will exist at runtime
export interface Seedcord extends Core {}
