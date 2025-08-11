import chalk from 'chalk';
import { ApplicationCommandType, ContextMenuCommandBuilder, type SlashCommandBuilder } from 'discord.js';

import { traverseDirectory } from '../../core/library/Helpers';
import { Logger } from '../../core/services/Logger';
import { CommandMetadataKey } from '../decorators/CommandRegisterable';
import { BuilderComponent } from '../interfaces/Components';

import type { Core } from '../../core/library/interfaces/Core';
import type { Initializeable } from '../../core/library/interfaces/Plugin';
import type { CommandMeta } from '../decorators/CommandRegisterable';

type CommandCtor = new () => BuilderComponent<'command'>;

export class CommandRegistry implements Initializeable {
  private readonly logger = new Logger('Commands');
  private isInitialised = false;

  public readonly globalCommands: SlashCommandBuilder[] = [];
  public readonly guildCommands = new Map<string, SlashCommandBuilder[]>();

  public constructor(private readonly core: Core) {}

  public async init(): Promise<void> {
    if (this.isInitialised) return;
    this.isInitialised = true;

    this.logger.info(chalk.bold(this.core.config.commands.path));

    await this.loadCommands(this.core.config.commands.path);

    this.logger.info(
      `${chalk.bold.green('Loaded')}: ${chalk.magenta.bold(
        this.globalCommands.length
      )} global, ${chalk.magenta.bold(this.guildCommands.size)} guild groups`
    );
  }

  private async loadCommands(dir: string): Promise<void> {
    await traverseDirectory(dir, (_full, rel, mod) => {
      for (const exported of Object.values(mod)) if (this.isCommandClass(exported)) this.registerCommand(exported, rel);
    });
  }

  private isCommandClass(obj: unknown): obj is CommandCtor {
    if (typeof obj !== 'function') return false;
    return obj.prototype instanceof BuilderComponent && Reflect.hasMetadata(CommandMetadataKey, obj);
  }

  private registerCommand(ctor: CommandCtor, rel: string): void {
    const meta = Reflect.getMetadata(CommandMetadataKey, ctor) as CommandMeta | undefined;

    if (!meta) return;

    const instance = new ctor();
    const comp = instance.component;

    if (meta.scope === 'global') {
      this.globalCommands.push(comp);
    } else {
      for (const g of meta.guilds) {
        const arr = this.guildCommands.get(g) ?? [];
        arr.push(comp);
        this.guildCommands.set(g, arr);
      }
    }

    this.logger.info(`${chalk.italic('Registered')} ${chalk.bold.yellow(ctor.name)} from ${chalk.gray(rel)}`);
  }

  public async setCommands(): Promise<void> {
    if (this.globalCommands.length > 0) {
      await this.core.bot.client.application?.commands.set(this.globalCommands);
      const tag = this.globalCommands.length === 1 ? 'command' : 'commands';
      this.logger.info(
        `${chalk.bold.green('Configured')} ${chalk.magenta.bold(this.globalCommands.length)} global ${tag}`
      );
      this.logger.info(` - ${this.globalCommands.map((command) => chalk.bold.cyan(command.name)).join(', ')}`);
    }

    for (const [guildId, commands] of this.guildCommands.entries()) {
      const guild = this.core.bot.client.guilds.cache.get(guildId);
      if (!guild) {
        this.logger.warn(`Guild with ID ${guildId} not found, skipping command registration.`);
        continue;
      }

      await guild.commands.set(commands);
      const tag = commands.length === 1 ? 'command' : 'commands';
      this.logger.info(
        `${chalk.bold.green('Configured')} ${chalk.magenta.bold(commands.length)} ${tag} for guild ${chalk.bold.yellow(guild.name)}`
      );
      this.logger.info(` - ${commands.map((command) => chalk.bold.cyan(command.name)).join(', ')}`);
    }
  }
}
