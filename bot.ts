import 'reflect-metadata';

import { resolve } from 'node:path';

import { GatewayIntentBits, Partials } from 'discord.js';

import { CoreBot } from './src/core/CoreBot';

async function main(): Promise<void> {
  await new CoreBot({
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
  }).start();
}

await main().catch(void 0);
