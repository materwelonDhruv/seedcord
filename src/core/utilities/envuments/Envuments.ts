/*
 * Based on: https://github.com/mason-rogers/envuments
 * Copyright (c) 2020 Mason Rogers <viction.dev@gmail.com> (https://github.com/mason-rogers)
 *
 * Modified in 2025 by Dhruv (https://github.com/materwelonDhruv)
 * Changes: improved type safety, added resolver support
 */

import { config } from 'dotenv';

let configObject: Record<string, unknown> = {};

class Parser {
  private readonly TEMPLATE_REGEX = /\${\w*}/g;

  private escapeRegexChars(str: string): string {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
  }

  resolveValueString(key: string, value: string): string {
    const templates = value.match(this.TEMPLATE_REGEX);
    if (!templates) return value;

    for (const template of templates) {
      const variable = template.slice(2, -1);
      if (!variable || variable === key) continue; // Prevent any circulars

      const variableVal = Envuments.get(variable);

      value = value.replace(new RegExp(this.escapeRegexChars(template), 'g'), variableVal || template);
    }

    return value;
  }
}

enum EnvumentType {
  String,
  Number,
  Boolean
}

class Envuments {
  private static readonly parser = new Parser();

  private static getConfig(): Record<string, unknown> {
    if (!Object.keys(configObject).length) {
      // Create isolated environment object to avoid mutating process.env
      const isolatedEnv: Record<string, string> = { ...(process.env as Record<string, string>) };

      try {
        // Load .env file into isolated environment object
        config({ quiet: true, processEnv: isolatedEnv });
      } catch {
        // Do Nothing
      }

      configObject = isolatedEnv;
    }

    return configObject;
  }

  private static _get(key: string, type: EnvumentType = EnvumentType.String, def?: unknown): unknown {
    const rawVal = this.getConfig()[key] as string | number | boolean;
    if (!rawVal) return def;

    const parsed = this.parser.resolveValueString(key, String(rawVal));

    switch (type) {
      case EnvumentType.String: {
        return (parsed !== '' && parsed) || def;
      }
      case EnvumentType.Number: {
        const num = Number(parsed);

        return (!isNaN(num) && num) || def;
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

export { Envuments, EnvumentType, Parser };
