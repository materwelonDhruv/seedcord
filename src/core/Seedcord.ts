import chalk from 'chalk';

import { Bot } from '../bot/Bot';
import { HookController } from './hooks/HookController';
import { Pluggable } from './library/interfaces/Plugin';
import { HealthCheck } from './services/HealthCheck';
import { CoordinatedShutdown } from './services/Lifecycle/CoordinatedShutdown';
import { CoordinatedStartup, StartupPhase } from './services/Lifecycle/CoordinatedStartup';

import type { Config } from './library/interfaces/Config';
import type { Core } from './library/interfaces/Core';

export class Seedcord extends Pluggable implements Core {
  private static isInstantiated = false;
  public override readonly shutdown: CoordinatedShutdown = CoordinatedShutdown.instance;
  public override readonly startup: CoordinatedStartup = CoordinatedStartup.instance;

  public readonly hooks: HookController;
  public readonly bot: Bot;
  private readonly healthCheck: HealthCheck;

  constructor(public readonly config: Config) {
    super();

    if (Seedcord.isInstantiated) {
      throw new Error('CoreBot can only be instantiated once. Use the existing instance instead.');
    }
    Seedcord.isInstantiated = true;

    this.hooks = new HookController(this as unknown as Core);
    this.bot = new Bot(this as unknown as Core);
    this.healthCheck = new HealthCheck(this as unknown as Core);

    this.registerStartupTasks();
  }

  private registerStartupTasks(): void {
    this.startup.addTask(StartupPhase.Configuration, 'Hook Initialization', async () => {
      this.hooks.logger.info(chalk.bold('Initializing'));
      await this.hooks.init();
      this.hooks.logger.info(chalk.bold('Initialized'));
    });

    this.startup.addTask(StartupPhase.Instantiation, 'Bot Initialization', async () => {
      this.bot.logger.info(chalk.bold('Initializing'));
      await this.bot.init();
      this.bot.logger.info(chalk.bold('Initialized'));
    });

    this.startup.addTask(StartupPhase.Ready, 'Health Check', async () => {
      this.healthCheck.logger.info(chalk.bold('Initializing'));
      await this.healthCheck.init();
      this.healthCheck.logger.info(chalk.bold('Initialized'));
    });
  }

  public async start(): Promise<this> {
    await super.init();
    return this;
  }
}

// Type assertion to tell TypeScript that plugins will exist at runtime
export interface Seedcord extends Core {}
