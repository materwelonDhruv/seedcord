import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Constants, Executable } from '../lib';
import { PingCommand } from './Components';
import {
  ButtonHandler,
  MessageHandler,
  ModalSubmitHandler,
  SlashCommandHandler,
  StringMenuHandler
} from './Handlers';

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
    await this.client.login(Constants.BOT_TOKEN);
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

  private setupMessageHandler(): void {
    this.client.on(Events.MessageCreate, (message) => {
      new MessageHandler(message).execute().catch((error) => {
        console.error('Failed to handle message:', error);
      });
    });
  }

  private setupInteractionHandler(): void {
    this.client.on(Events.InteractionCreate, (interaction) => {
      switch (true) {
        case interaction.isChatInputCommand():
          this.handleInteraction(
            new SlashCommandHandler(interaction),
            'Failed to handle slash command interaction:'
          );
          break;
        case interaction.isButton():
          this.handleInteraction(
            new ButtonHandler(interaction),
            'Failed to handle button interaction:'
          );
          break;
        case interaction.isStringSelectMenu():
          this.handleInteraction(
            new StringMenuHandler(interaction),
            'Failed to handle menu interaction:'
          );
          break;
        case interaction.isModalSubmit():
          this.handleInteraction(
            new ModalSubmitHandler(interaction),
            'Failed to handle modal submit interaction:'
          );
          break;
        default:
          break;
      }
    });
  }

  private handleInteraction(
    handler: InstanceType<typeof Executable>,
    errorMessage: string
  ) {
    handler.execute().catch((error) => {
      console.error(errorMessage, error);
    });
  }
}
