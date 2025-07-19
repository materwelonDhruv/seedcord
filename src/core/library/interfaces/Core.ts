import type { Bot } from '../../../bot/Bot';
import type { Database } from '../../database/Database';
import type { HookController } from '../../hooks/HookController';

export type BotMode = 'bot';
export type CoreMode = BotMode;

interface CoreBase {
  readonly db: Database;
  readonly hooks: HookController;

  start(): Promise<void>;
}

interface BotCore {
  readonly bot: Bot;
}

// XOR Core
export type Core = CoreBase & BotCore;
