import { ColorResolvable } from 'discord.js';
import dotenv from 'dotenv';

export class Constants {
  public static readonly environment = process.env.NODE_ENV || 'development';

  private constructor() {}

  static {
    Constants.initialize();
  }

  private static initialize() {
    dotenv.config({ path: `.env.${Constants.environment}` });
  }

  // PRIVATE CONSTANTS | VARIABLES
  public static readonly botToken = process.env.BOT_TOKEN || '';
  public static readonly dbName = process.env.DB_NAME || '';
  public static readonly mongoUri = process.env.MONGODB_URI || '';

  // VARIABLE ACCESSORS BASED ON ENVIRONMENT
  public static readonly botColor =
    Constants.environment === 'production'
      ? ('' as ColorResolvable) // Replace with actual color
      : ('' as ColorResolvable); // Replace with actual color
  public static readonly botId =
    Constants.environment === 'production'
      ? '' // Replace with actual bot ID
      : ''; // Replace with actual bot ID
}
