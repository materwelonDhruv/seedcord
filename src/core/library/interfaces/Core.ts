import type { Config } from './Config';
import type { Bot } from '../../../bot/Bot';
import type { Mongo } from '../../database/Database';
import type { HookController } from '../../hooks/HookController';
import type { CoordinatedShutdown } from '../../services/CoordinatedShutdown';

interface BaseCore {
  readonly db: Mongo;
  readonly bot: Bot;
  readonly hooks: HookController;
  readonly shutdown: CoordinatedShutdown;

  readonly config: Config;

  start(): Promise<void>;
}

export interface Core extends BaseCore {}
