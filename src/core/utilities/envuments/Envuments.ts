/*
 * Based on: https://github.com/mason-rogers/envuments
 * Copyright (c) 2020 Mason Rogers <viction.dev@gmail.com> (https://github.com/mason-rogers)
 *
 * Modified in 2025 by Dhruv (https://github.com/materwelonDhruv)
 * Changes: improved type safety, added resolver support, service dependency
 */

import { config } from 'dotenv';

import { Parser as EnvParser, type EnvConverterService } from './Parser';

export const EnvCache = new Map<string, unknown>();

enum EnvumentType {
  String,
  Number,
  Boolean
}

enum Environment {
  Development,
  Staging,
  Production
}

class Envuments implements EnvConverterService {
  private static readonly parser = new EnvParser(new Envuments());

  // Environment handling
  private static internalEnvironment = this.determineEnvironment(
    this.get('ENVIRONMENT', this.get('ENV', this.get('NODE_ENV', 'development')))
  );

  private static determineEnvironment(env: string | Environment): Environment {
    if (typeof env === 'string') {
      switch (env.toLowerCase()) {
        case 'production':
          return Environment.Production;
        case 'staging':
          return Environment.Staging;
        default:
          return Environment.Development;
      }
    }

    return env;
  }

  static set environment(env: string | Environment) {
    this.internalEnvironment = this.determineEnvironment(env);
  }

  static get environment(): Environment {
    return this.internalEnvironment;
  }

  static get isProduction(): boolean {
    return this.internalEnvironment === Environment.Production;
  }

  static get isStaging(): boolean {
    return this.internalEnvironment === Environment.Staging;
  }

  static get isDevelopment(): boolean {
    return this.internalEnvironment === Environment.Development;
  }

  private static get config(): Map<string, unknown> {
    if (EnvCache.size === 0) {
      // Create isolated environment object to avoid mutating process.env
      const isolatedEnv: Record<string, string> = { ...(process.env as Record<string, string>) };

      try {
        // Load .env file into isolated environment object
        config({ quiet: true, processEnv: isolatedEnv });
      } catch {
        // Do Nothing
      }

      // Populate the Map with global environment variables
      for (const [key, value] of Object.entries(isolatedEnv)) EnvCache.set(key, value);
    }

    return EnvCache;
  }

  private static _get(key: string, type: EnvumentType = EnvumentType.String, def?: unknown): unknown {
    const rawVal = this.config.get(key) as string | number | boolean;
    if (!rawVal) return def;

    const parsed = this.parser.resolveValueString(key, String(rawVal));

    switch (type) {
      case EnvumentType.String: {
        return (parsed !== '' && parsed) || def;
      }
      case EnvumentType.Number: {
        const num = Number(parsed);

        return (!Number.isNaN(num) && num) || def;
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

export { Envuments, EnvumentType, Environment };
