import 'reflect-metadata';

import { resolve } from 'node:path';

import { GatewayIntentBits, Partials } from 'discord.js';
import { Envapt } from 'envapt';
import { Seedcord, Globals, StartupPhase, Mongo } from 'seedcord';

Globals.envPaths = resolve(import.meta.dirname, '../../../.env');
// eslint-disable-next-line no-console
console.log(Globals.botToken);

export class Vars extends Globals {
  // Mongo Plugin
  @Envapt('MONGO_URI', { fallback: 'mongodb://localhost:27017/' })
  public static readonly mongoUri: string;

  @Envapt('DB_NAME', { fallback: 'seedcord' })
  public static readonly dbName: string;
}

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
      path: resolve(import.meta.dirname, './hooks')
    },
    interactions: {
      path: resolve(import.meta.dirname, './handlers')
    },
    commands: {
      path: resolve(import.meta.dirname, './components/commands')
    },
    events: {
      path: resolve(import.meta.dirname, './events')
    }
  }).attach('db', Mongo, StartupPhase.Configuration, {
    servicesDir: resolve(import.meta.dirname, './services'),
    uri: Vars.mongoUri,
    dbName: Vars.dbName
  });

  await seedcord.start();
}

declare module 'seedcord' {
  interface Core {
    db: Mongo;
  }
}

await main().catch(() => process.exit(1));
