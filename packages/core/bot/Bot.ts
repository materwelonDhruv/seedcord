import chalk from 'chalk';
import { Client } from 'discord.js';

import { CommandRegistry } from './controllers/CommandRegistry';
import { EventController } from './controllers/EventController';
import { InteractionController } from './controllers/InteractionController';
import { EmojiInjector } from './injectors/EmojiInjector';
import { Globals } from '../core/library/globals/Globals';
import { Plugin } from '../core/library/interfaces/Plugin';
import { ShutdownPhase } from '../core/services/Lifecycle/CoordinatedShutdown';
import { Logger } from '../core/services/Logger';

import type { Core } from '../core/library/interfaces/Core';

export class Bot extends Plugin {
  public readonly logger = new Logger('Bot');
  private isInitialized = false;

  private readonly _client: Client;
  private readonly interactions: InteractionController;
  private readonly events: EventController;
  private readonly commands: CommandRegistry;
  private readonly emojiInjector: EmojiInjector;

  constructor(protected core: Core) {
    super(core);

    this._client = new Client(core.config.clientOptions);

    this.interactions = new InteractionController(core);
    this.events = new EventController(core);

    this.commands = new CommandRegistry(this.core);
    this.emojiInjector = new EmojiInjector(this._client);

    this.core.shutdown.addTask(ShutdownPhase.DiscordCleanup, 'stop-bot', async () => await this.stop());
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    await this.login();

    await this.interactions.init();
    await this.events.init();

    await this.commands.init();
    await this.commands.setCommands();

    await this.emojiInjector.init();
  }

  public async stop(): Promise<void> {
    this._client.removeAllListeners();

    await this.logout();
  }

  private async login(): Promise<Bot> {
    await this._client.login(Globals.botToken);
    this.logger.info(`Logged in as ${chalk.bold.magenta(this._client.user?.username)}!`);
    return this;
  }

  private async logout(): Promise<void> {
    await this._client.destroy();
    this.logger.info(chalk.bold.red('Logged out of Discord!'));
  }

  public get client(): Client {
    return this._client;
  }
}
