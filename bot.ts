import 'reflect-metadata';

import { resolve } from 'node:path';

import { GatewayIntentBits, Partials } from 'discord.js';

import { Mongo } from './src/core/database/Mongo';
import { Seedcord } from './src/core/Seedcord';
import { StartupPhase } from './src/core/services/CoordinatedStartup';

async function main(): Promise<void> {
  const seedcord = new Seedcord({
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
    commands: {
      path: resolve(import.meta.dirname, './src/bot/components/commands')
    },
    events: {
      path: resolve(import.meta.dirname, './src/bot/events')
    }
  }).attach('db', Mongo, StartupPhase.Configuration, resolve(import.meta.dirname, './src/core/database/services'));

  await seedcord.start();
}

declare module './src/core/library/interfaces/Core' {
  interface Core {
    db: Mongo;
  }
}

await main().catch(() => process.exit(1));
