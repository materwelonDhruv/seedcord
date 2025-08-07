import chalk from 'chalk';

import { Bot } from '../bot/Bot';
import { Database } from './database/Database';
import { HookController } from './hooks/HookController';
import { CoordinatedShutdown } from './services/CoordinatedShutdown';
import { HealthCheck } from './services/HealthCheck';
import { Logger } from './services/Logger';

import type { Core } from './library/interfaces/Core';
import type { CoreBotConfig } from './library/interfaces/CoreBotConfig';

export class CoreBot implements Core {
  private static _isInstantiated = false;
  private readonly logger = new Logger('CoreBot');
  public readonly shutdown: CoordinatedShutdown;
  public readonly config: CoreBotConfig;

  public readonly db: Database;
  public readonly hooks: HookController = new HookController(this);
  public readonly bot: Bot;
  private readonly healthCheck?: HealthCheck;

  constructor(config: CoreBotConfig) {
    if (CoreBot._isInstantiated) {
      throw new Error('CoreBot can only be instantiated once. Use the existing instance instead.');
    }
    CoreBot._isInstantiated = true;

    this.config = this.normalizeConfig(config);

    // Initialize shutdown service based on config
    this.shutdown = this.config.coordinatedShutdown ? CoordinatedShutdown.instance : CoordinatedShutdown.instance;

    this.db = new Database(this, this.config.mongoUri);
    this.bot = new Bot(this);

    // Only create health check if enabled
    if (this.config.healthCheck !== false) {
      this.healthCheck = new HealthCheck(this);
    }
  }

  public static get instance(): CoreBot {
    throw new Error('CoreBot no longer supports singleton access. Use new CoreBot(config) instead.');
  }

  private normalizeConfig(config: CoreBotConfig): CoreBotConfig {
    const DEFAULT_HEALTH_CHECK_PORT = 6956;
    const DEFAULT_HEALTH_CHECK_PATH = '/healthcheck';

    return {
      ...config,
      coordinatedShutdown: config.coordinatedShutdown ?? true,
      mongoUri: config.mongoUri ?? 'mongodb://localhost:27017/',
      dbName: config.dbName ?? 'seedcord',
      healthCheck:
        config.healthCheck === false
          ? false
          : {
              port: config.healthCheck?.port ?? DEFAULT_HEALTH_CHECK_PORT,
              path: config.healthCheck?.path ?? DEFAULT_HEALTH_CHECK_PATH
            }
    };
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

    if (this.healthCheck) {
      this.logger.info(chalk.bold('Starting Health Check'));
      await this.healthCheck.start();
      this.logger.info(chalk.bold('Health Check started'));
    }
  }
}
