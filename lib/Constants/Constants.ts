import { ColorResolvable } from 'discord.js';
import dotenv from 'dotenv';

export class Constants {
  public static readonly ENV = process.env.NODE_ENV || 'development';

  private constructor() {}

  static {
    Constants.initialize();
  }

  private static initialize() {
    dotenv.config({ path: `.env.${Constants.ENV}` });
  }

  // PRIVATE CONSTANTS | VARIABLES
  public static readonly BOT_TOKEN = process.env.BOT_TOKEN || '';
  public static readonly DB_NAME = process.env.DB_NAME || '';
  public static readonly MONGO_URI = process.env.MONGODB_URI || '';

  // VARIABLE ACCESSORS BASED ON ENVIRONMENT
  public static readonly BOT_COLOR =
    Constants.ENV === 'production'
      ? ('' as ColorResolvable) // Replace with actual color
      : ('' as ColorResolvable); // Replace with actual color
  public static readonly BOT_ID =
    Constants.ENV === 'production'
      ? '' // Replace with actual bot ID
      : ''; // Replace with actual bot ID
}
