import chalk from 'chalk';

import { Bot } from '../bot/Bot';
import { Database } from './database/Database';
import { HookController } from './hooks/HookController';
import { CoordinatedShutdown } from './services/CoordinatedShutdown';
import { HealthCheck } from './services/HealthCheck';
import { Logger } from './services/Logger';

import type { Core } from './library/interfaces/Core';

export class CoreBot implements Core {
  private static _instance: CoreBot;
  private readonly logger = new Logger('CoreBot');
  public readonly shutdown = CoordinatedShutdown.instance;

  public readonly db: Database = new Database(this);
  public readonly hooks: HookController = new HookController(this);
  public readonly bot: Bot = new Bot(this);
  private readonly healthCheck: HealthCheck = new HealthCheck(this);

  private constructor() {}

  public static get instance(): CoreBot {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (this._instance ??= new CoreBot());
  }

  public async start(): Promise<void> {
    this.logger.info(chalk.bold('Starting Database'));
    await this.db.start();
    this.logger.info(chalk.bold('Database started'));

    this.logger.info(chalk.bold('Initializing Hooks'));
    await this.hooks.init();
    this.logger.info(chalk.bold('Hooks initialized'));

    this.logger.info(chalk.bold('Starting Bot'));
    await this.bot.start();
    this.logger.info(chalk.bold('Bot started'));

    this.logger.info(chalk.bold('Starting Health Check'));
    await this.healthCheck.start();
    this.logger.info(chalk.bold('Health Check started'));
  }
}
