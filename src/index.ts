import { Client, GatewayIntentBits } from 'discord.js';
import { Constants } from '../lib';
import { PingCommand } from './Components';
import { ButtonHandler, MessageHandler, SlashCommandHandler } from './Handlers';

export default class Discord {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ]
    });
  }

  public async login(): Promise<Discord> {
    await this.client.login(Constants.botToken);
    console.log(`Logged in as ${this.client.user?.tag}!`);
    return this;
  }

  public async buildSlashCommands(): Promise<void> {
    const commands = [new PingCommand().getComponent];

    for (const command of commands) {
      await this.client.application?.commands.create(command);
      console.log(`Created command ${command.name}`);
    }
  }

  public async removeSlashCommands(): Promise<void> {
    const commands = await this.client.application?.commands.fetch();
    if (commands) {
      for (const command of Array.from(commands.values())) {
        await command.delete();
        console.log(`Deleted command ${command.name}`);
      }
    }
  }

  public setupHandlers(): void {
    this.setupInteractionHandler();
    this.setupMessageHandler();
  }

  private setupInteractionHandler(): void {
    this.client.on('interactionCreate', (interaction) => {
      if (interaction.isChatInputCommand()) {
        new SlashCommandHandler(interaction).execute().catch((error) => {
          console.error('Failed to execute slash command:', error);
        });
      }

      if (interaction.isButton()) {
        new ButtonHandler(interaction).execute().catch((error) => {
          console.error('Failed to execute button handler:', error);
        });
      }
    });
  }

  private setupMessageHandler(): void {
    this.client.on('messageCreate', (message) => {
      new MessageHandler(message).execute().catch((error) => {
        console.error('Failed to handle message:', error);
      });
    });
  }
}
