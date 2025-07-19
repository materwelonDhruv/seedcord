import * as dotenv from 'dotenv';

// eslint-disable-next-line import/no-cycle
import { Parser } from './lib/Parser';
import { EnvumentType } from './lib/Types.enum';

let configObject: Record<string, unknown> = {};

export class Envuments {
  private static readonly parser = new Parser();

  private static getConfig(): Record<string, unknown> {
    if (!Object.keys(configObject).length) {
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

  private static _get(key: string, type: EnvumentType = EnvumentType.STRING, def?: unknown): unknown {
    const rawVal = this.getConfig()[key] as string | number | boolean;
    if (!rawVal) return def;

    const parsed = this.parser.resolveValueString(key, String(rawVal));

    switch (type) {
      case EnvumentType.STRING: {
        return (parsed !== '' && parsed) || def;
      }
      case EnvumentType.NUMBER: {
        const num = Number(parsed);

        return (!isNaN(num) && num) || def;
      }
      case EnvumentType.BOOLEAN: {
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
    return this._get(key, EnvumentType.STRING, def) as string;
  }

  static getNumber(key: string, def?: number): number {
    return this._get(key, EnvumentType.NUMBER, def) as number;
  }

  static getBoolean(key: string, def?: boolean): boolean {
    return this._get(key, EnvumentType.BOOLEAN, def) as boolean;
  }

  get(key: string, def?: string): string {
    return Envuments._get(key, EnvumentType.STRING, def) as string;
  }

  getNumber(key: string, def?: number): number {
    return Envuments._get(key, EnvumentType.NUMBER, def) as number;
  }

  getBoolean(key: string, def?: boolean): boolean {
    return Envuments._get(key, EnvumentType.BOOLEAN, def) as boolean;
  }
}
