import 'reflect-metadata';

import { resolve } from 'node:path';

import { GatewayIntentBits, Partials } from 'discord.js';

import { Plugin } from './src/core/library/interfaces/Plugin';
import { Seedcord } from './src/core/Seedcord';
import { Logger } from './src/core/services/Logger';

import type { Core } from './src/core/library/interfaces/Core';

class Test extends Plugin {
  public readonly logger = new Logger('TestPlugin');
  constructor(
    core: Core,
    private readonly str: string,
    private readonly num: number
  ) {
    super(core);
  }

  async init(): Promise<void> {
    // Initialization logic for the test plugin
  }

  public logIt(): void {
    // eslint-disable-next-line no-console
    console.log(`Test Plugin: ${this.str}, Number: ${this.num}`);
  }
}

async function main(): Promise<void> {
  await new Seedcord({
    clientOptions: {
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks
      ],
      partials: [Partials.GuildMember, Partials.User]
    },
    hooks: {
      path: resolve(import.meta.dirname, './src/core/hooks/handlers')
    },
    interactions: {
      path: resolve(import.meta.dirname, './src/bot/handlers')
    },
    services: {
      path: resolve(import.meta.dirname, './src/core/database/services')
    },
    commands: {
      path: resolve(import.meta.dirname, './src/bot/components/commands')
    },
    events: {
      path: resolve(import.meta.dirname, './src/bot/events')
    }
  })
    // eslint-disable-next-line no-magic-numbers
    .attach('test', Test, 'Hello World', 42)
    .start();
}

declare module './src/core/library/interfaces/Core' {
  interface Core {
    test: Test;
  }
}

await main().catch(void 0);
