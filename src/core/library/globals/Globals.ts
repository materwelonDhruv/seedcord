import 'reflect-metadata';

import { ColorResolvable } from 'discord.js';

import { Envapt, Envapter } from '@seedcord/envapt';

export class Globals extends Envapter {
  // Secrets
  @Envapt('BOT_TOKEN', { fallback: undefined })
  public static readonly botToken: string;

  // General
  @Envapt('MONGO_URI', { fallback: 'mongodb://localhost:27017/' })
  public static readonly mongoUri: string;

  @Envapt('DB_NAME', { fallback: 'seedcord' })
  public static readonly dbName: string;

  // Health Check
  @Envapt('HEALTH_CHECK_PORT', { fallback: 6956 })
  public static readonly healthCheckPort: number;

  @Envapt('HEALTH_CHECK_PATH', { fallback: '/healthcheck' })
  public static readonly healthCheckPath: string;

  // Coordinated Shutdown
  @Envapt('SHUTDOWN_IS_ENABLED', { fallback: false })
  public static readonly shutdownIsEnabled: boolean;

  // Incorrect converter usage
  @Envapt('INCORRECT_CONVERTER_USAGE', {
    fallback: [1, 2],
    converter: {
      delimiter: ',',
      type: 'asdasdf'
    }
  })
  public static readonly incorrectConverterUsage: string;

  // Variables
  public static readonly botColor: ColorResolvable = this.isProduction ? '#dcc8f0' : '#fe565a';
}
