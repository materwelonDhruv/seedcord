# Envapt - The apt way to handle env

[![Downloads](https://img.shields.io/npm/dt/envuments.svg)](https://www.npmjs.com/package/envuments)
[![npm bundle size](https://img.shields.io/bundlephobia/min/envuments)](https://www.npmjs.com/package/envuments)
[![Version](https://img.shields.io/npm/v/envuments.svg)](https://www.npmjs.com/package/envuments)
[![License](https://img.shields.io/npm/l/envuments)](https://www.npmjs.com/package/envuments)

---

A powerful TypeScript-first environment configuration library that provides type detection, template variable resolution, and decorator-based static class property configuration by extending dotenv.

This library is inspired by [envuments](https://github.com/mason-rogers/envuments).

## Features

- 🔧 **Automatic Type Detection** - Types inferred from fallback values
- 🔗 **Template Variables** - `${VAR}` syntax with circular reference protection
- 🎯 **Static Class Properties** - Decorator-based configuration for static class members
- 🏷️ **Built-in & Custom Converters** - Ready-to-use converters for common patterns + custom transformations
- 🌍 **Environment Detection** - Built-in development/staging/production handling
- 📂 **Multiple .env Files** - Load from multiple sources
- 💪 **Edge Case Handling** - Robust parsing for all scenarios
- 🛡️ **Type Safety** - Full TypeScript support with proper type inference

## Requirements

- **Node.js**: v18 or later (recommended for ESM and nodenext support)
- **TypeScript**: v5.8 or later
- **Dependencies**:
  - `dotenv` (runtime dependency | bundled)
  - `reflect-metadata` (peer dependency, required for decorators)
- **TypeScript Compiler Options**:
  - `experimentalDecorators: true`
  - `emitDecoratorMetadata: true`
  - `module: nodenext`
  - `moduleResolution: nodenext`
  - `target: esnext`
  - `lib: ESNext`
- **ESM Support**: Project uses ESM (`nodenext`), so your environment and tooling should support ES modules.

## Quick Start

### Installation

```bash
# npm
npm install @seedcord/envapt reflect-metadata

# pnpm
pnpm add @seedcord/envapt reflect-metadata

# yarn
yarn add @seedcord/envapt reflect-metadata
```

### Basic Usage

Create a `.env` file:

```env
APP_PORT=8443
APP_URL=http://localhost:${APP_PORT}
DATABASE_URL=postgres://localhost:5432/mydb
IS_PRODUCTION=false
MAX_CONNECTIONS=100
ALLOWED_ORIGINS=https://app.com,https://admin.com
```

Use with decorators (recommended):

```ts
import { Envapt } from '@seedcord/envapt';

class Config extends Envapter {
  @Envapt('APP_PORT', 3000)
  static readonly port: number;

  @Envapt('APP_URL', 'http://localhost:3000', 'url')
  static readonly url: URL;

  @Envapt('ALLOWED_ORIGINS', {
    fallback: ['http://localhost:3000'],
    converter: 'array' // Built-in array converter
  })
  static readonly allowedOrigins: string[];
}

console.log(Config.port); // 8443 (number)
console.log(Config.url); // "http://localhost:8443" (templated!)
console.log(Config.allowedOrigins); // ["https://app.com", "https://admin.com"]
console.log(Config.isProduction); // false (provided by the Envapter class)
```

Or use functionally:\
<sub>Limited to primitives, String, Number, Boolean, Symbol, and BigInt. Does not support converters.</sub>

```ts
import { Envapter } from '@seedcord/envapt';

const port = Envapter.getNumber('APP_PORT', 3000);
const url = Envapter.get('APP_URL', 'http://localhost:3000');
const isProduction = Envapter.getBoolean('IS_PRODUCTION', false);
```

## API Reference

### Decorator API

The `@Envapt` decorator supports both class and modern syntax:

#### Modern Syntax (Recommended)

```ts
@Envapt('ENV_VAR', { fallback?: T, converter?: EnvConverter<T> })
```

#### Classic Syntax

```ts
@Envapt('ENV_VAR', fallback?, converter?)
```

#### Automatic Type Detection

Types are automatically inferred from fallback values:

```ts
class Config extends Envapter {
  @Envapt('STRING_VAR', 'default') // string
  static readonly stringVar: string;

  @Envapt('NUMBER_VAR', 42) // number
  static readonly numberVar: number;

  @Envapt('BOOLEAN_VAR', true) // boolean
  static readonly booleanVar: boolean;
}
```

#### Built-in Converters

Envapt provides many built-in converters for common patterns:

```ts
class Config extends Envapter {
  // String converter (explicit)
  @Envapt('APP_NAME', { converter: 'string', fallback: 'MyApp' })
  static readonly appName: string;

  // Numeric converters
  @Envapt('PORT', { converter: 'number', fallback: 3000 })
  static readonly port: number;

  @Envapt('MAX_CONNECTIONS', { converter: 'integer', fallback: 100 })
  static readonly maxConnections: number;

  @Envapt('TIMEOUT', { converter: 'float', fallback: 30.5 })
  static readonly timeout: number;

  // Boolean converter (supports yes/no, on/off, 1/0, true/false)
  @Envapt('ENABLED', { converter: 'boolean', fallback: false })
  static readonly enabled: boolean;

  // Array converters with different delimiters
  @Envapt('TAGS', { converter: 'array', fallback: [] })
  static readonly tags: string[];

  @Envapt('ENDPOINTS', { converter: { delimiter: ';' }, fallback: [] })
  static readonly endpoints: string[];

  @Envapt('CORS_ORIGINS', { converter: { delimiter: '|' }, fallback: [] })
  static readonly corsOrigins: string[];

  @Envapt('SERVICES', { converter: { delimiter: ' ' }, fallback: [] })
  static readonly services: string[];

  @Envapt('METHODS', { converter: { delimiter: ', ' }, fallback: [] })
  static readonly methods: string[];

  // Array with type conversion
  @Envapt('PORTS', { converter: { delimiter: ',', type: 'number' }, fallback: [] })
  static readonly ports: number[];

  @Envapt('FEATURE_FLAGS', { converter: { delimiter: ',', type: 'boolean' }, fallback: [] })
  static readonly featureFlags: boolean[];

  // JSON converter (safely parses JSON)
  @Envapt('CONFIG', { converter: 'json', fallback: {} })
  static readonly config: object;

  // URL converter
  @Envapt('API_URL', { converter: 'url', fallback: new URL('http://localhost') })
  static readonly apiUrl: URL;

  // RegExp converter (supports /pattern/flags syntax)
  @Envapt('VALIDATION_PATTERN', { converter: 'regexp', fallback: /.*/ })
  static readonly validationPattern: RegExp;

  // Date converter (supports ISO strings and timestamps)
  @Envapt('CREATED_AT', { converter: 'date', fallback: new Date() })
  static readonly createdAt: Date;

  // BigInt converter (for large integers)
  @Envapt('LARGE_NUMBER', { converter: 'bigint', fallback: 0n })
  static readonly largeNumber: bigint;

  // Symbol converter (creates symbols from strings)
  @Envapt('UNIQUE_KEY', { converter: 'symbol', fallback: Symbol('default') })
  static readonly uniqueKey: symbol;
}
```

**Available Built-in Converters:**

- `'string'` - String values
- `'number'` - Numeric values (integers and floats)
- `'integer'` - Integer values only
- `'float'` - Float values only
- `'boolean'` - Boolean values (true/false, yes/no, on/off, 1/0)
- `'bigint'` - BigInt values for large integers
- `'symbol'` - Symbol values (creates symbols from string descriptions)
- `'json'` - JSON objects/arrays (safe parsing with fallback)
- `'array'` - Comma-separated string arrays
- `'url'` - URL objects
- `'regexp'` - Regular expressions (supports `/pattern/flags` syntax)
- `'date'` - Date objects (supports ISO strings and timestamps)

#### Custom Array Converters

For more control over array parsing, use the ArrayConverter object syntax:\

```ts
class Config extends Envapter {
  // Basic array (comma-separated strings)
  @Envapt('TAGS', { converter: 'array', fallback: [] })
  static readonly tags: string[];

  // Custom delimiter
  @Envapt('SERVICES', { converter: { delimiter: '|' }, fallback: [] })
  static readonly services: string[];

  // Custom delimiter with type conversion
  @Envapt('PORTS', { converter: { delimiter: ',', type: 'number' }, fallback: [] })
  static readonly ports: number[];

  @Envapt('FEATURE_FLAGS', { converter: { delimiter: ';', type: 'boolean' }, fallback: [] })
  static readonly featureFlags: boolean[];

  // Multiple custom delimiters
  @Envapt('ENDPOINTS', { converter: { delimiter: ' | ' }, fallback: [] })
  static readonly endpoints: string[];
}
```

**ArrayConverter Interface:**

- `delimiter: string` - The string used to split array elements
- `type?: BuiltInConverter` - Optional type to convert each element to (excludes 'array', 'json', and 'regexp')

#### Custom Converters

Transform environment values to any type:

```ts
class Config extends Envapter {
  @Envapt('TAGS', {
    fallback: new Set(['default']),
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      return new Set(raw.split(',').map((s) => s.trim()));
    }
  })
  static readonly tags: Set<string>;
}
```

#### Handling Missing Values

Control what happens when environment variables don't exist:

```ts
class Config extends Envapter {
  // Returns undefined if not found
  @Envapt('OPTIONAL_VAR', { fallback: undefined })
  static readonly optional: string | undefined;

  // Returns null if not found (no fallback provided)
  @Envapt('MISSING_VAR', { converter: String })
  static readonly missing: string | null;

  // Uses fallback if not found
  @Envapt('WITH_FALLBACK', { fallback: 'default' })
  static readonly withFallback: string;
}
```

### Functional API

```ts
import { Envapter } from '@seedcord/envapt';

// Type-specific getters
const str = Envapter.get('STRING_VAR', 'default');
const num = Envapter.getNumber('NUMBER_VAR', 42);
const bool = Envapter.getBoolean('BOOLEAN_VAR', false);

// Instance methods (same API)
const envapter = new Envapter();
const value = envapter.get('VAR', 'default');
```

## Environment Detection

Envapt automatically detects your environment from these variables (in order):

1. `ENVIRONMENT`
2. `ENV`
3. `NODE_ENV`

Supported values: `development`, `staging`, `production` (case-sensitive)

### Environment Management

```ts
import { Envapter, EnvaptEnvironment } from '@seedcord/envapt';

// Check current environment
console.log(Envapter.environment); // Environment.Development
console.log(Envapter.isProduction); // false
console.log(Envapter.isDevelopment); // true
console.log(Envapter.isStaging); // false

// Set environment
Envapter.environment = EnvaptEnvironment.Production;
Envapter.environment = 'staging'; // string also works
```

### Multiple .env Files

```ts
import { resolve } from 'node:path';
import { Envapter } from '@seedcord/envapt';

// Load from multiple files
Envapter.envPaths = [resolve(__dirname, '.env.local'), resolve(__dirname, '.env.production')];

// Or single file
Envapter.envPaths = resolve(__dirname, '.env.production');

// Or just don't set a path for it to default to .env at the root of your project
```

## Template Variables

Envapt supports variable interpolation with `${VARIABLE}` syntax:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_URL=postgres://${DATABASE_HOST}:${DATABASE_PORT}/mydb

API_VERSION=v1
API_BASE=https://api.example.com
API_ENDPOINT=${API_BASE}/${API_VERSION}/users
```

### Circular Reference Protection

```env
CIRCULAR_A=${CIRCULAR_B}
CIRCULAR_B=${CIRCULAR_A}
```

Circular references are detected and preserved as-is rather than causing infinite loops.

## Advanced Examples

### Complex Configuration Class

```ts
import { Envapt } from '@seedcord/envapt';

class AppConfig extends Envapter {
  @Envapt('PORT', 3000)
  static readonly port: number;

  @Envapt('HOST', 'localhost')
  static readonly host: string;

  @Envapt('DATABASE_URL', 'sqlite://memory')
  static readonly databaseUrl: string;

  @Envapt('REDIS_URLS', {
    fallback: [new URL('redis://localhost:6379')],
    converter: (raw, fallback) => (raw ? raw.split(',').map((s) => new URL(s)) : fallback)
  })
  static readonly redisUrls: URL[];

  @Envapt('FEATURE_FLAGS', {
    fallback: new Set(['basic']),
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      return new Set(raw.split(',').map((s) => s.trim()));
    }
  })
  static readonly featureFlags: Set<string>;

  @Envapt('LOG_LEVEL', 'info')
  static readonly logLevel: string;

  @Envapt('MAX_UPLOAD_SIZE', {
    fallback: 10 * 1024 * 1024, // 10MB
    converter: 'integer'
  })
  static readonly maxUploadSize: number;
}
```

### Custom Converter Examples

```ts
// Parse JSON
@Envapt('CONFIG_JSON', {
  fallback: {},
  converter: 'json'
})
static readonly config: Record<string, any>;

// Parse duration strings
@Envapt('TIMEOUT', {
  fallback: 30000,
  converter: (raw, fallback) => {
    if (!raw) return fallback;
    const match = raw.match(/^(\d+)(s|ms|m|h)?$/);
    if (!match) return fallback;

    const [, num, unit = 'ms'] = match;
    const value = parseInt(num);

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      default: return value;
    }
  }
})
static readonly timeout: number;
```

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/mason-rogers/envuments).
