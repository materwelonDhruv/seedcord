import * as dotenv from 'dotenv';
// eslint-disable-next-line import/no-cycle
import { Parser } from './lib/Parser';
import { EnvumentType } from './lib/Types.enum';

let configObject: Record<string, unknown> = {};

export class Envuments {
  private static readonly parser = new Parser();

  private static getConfig(): Record<string, unknown> {
    if (Object.keys(configObject).length === 0) {
      // Default to dotenv config
      try {
        dotenv.config();
      } catch {
        // Do Nothing
      }
      Envuments.seedConfig(process.env);
    }

    return configObject;
  }

  static seedConfig(config: { [key: string]: unknown; parsed?: Record<string, string> }): void {
    if (Object.keys(config).includes('parsed')) {
      // Dotenv.config() response
      configObject = config.parsed as Record<string, string>;
    } else {
      configObject = config;
    }
  }

  private static _get(key: string, type: EnvumentType = EnvumentType.String, def?: unknown): unknown {
    const rawVal = this.getConfig()[key] as string | number | boolean | undefined;
    if (rawVal === undefined || rawVal === null) return def;

    const parsed = this.parser.resolveValueString(key, String(rawVal));

    switch (type) {
      case EnvumentType.String: {
        return (parsed !== '' && parsed) || def;
      }
      case EnvumentType.Number: {
        const num = Number(parsed);

        return (!isNaN(num) && num !== 0) || def;
      }
      case EnvumentType.Boolean: {
        const yes = ['1', 'yes', 'true'];
        const no = ['0', 'no', 'false'];

        if (yes.includes(parsed)) return true;
        if (no.includes(parsed)) return false;

        return def;
      }

      default: {
        return (parsed !== '' && parsed) || def;
      }
    }
  }

  static get(key: string, def?: string): string {
    return this._get(key, EnvumentType.String, def) as string;
  }

  static getNumber(key: string, def?: number): number {
    return this._get(key, EnvumentType.Number, def) as number;
  }

  static getBoolean(key: string, def?: boolean): boolean {
    return this._get(key, EnvumentType.Boolean, def) as boolean;
  }

  get(key: string, def?: string): string {
    return Envuments._get(key, EnvumentType.String, def) as string;
  }

  getNumber(key: string, def?: number): number {
    return Envuments._get(key, EnvumentType.Number, def) as number;
  }

  getBoolean(key: string, def?: boolean): boolean {
    return Envuments._get(key, EnvumentType.Boolean, def) as boolean;
  }
}
