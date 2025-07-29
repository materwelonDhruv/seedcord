# Envapt - The apt way to handle env

[![Downloads](https://img.shields.io/npm/dt/envuments.svg)](https://www.npmjs.com/package/envuments)
[![npm bundle size](https://img.shields.io/bundlephobia/min/envuments)](https://www.npmjs.com/package/envuments)
[![Version](https://img.shields.io/npm/v/envuments.svg)](https://www.npmjs.com/package/envuments)
[![License](https://img.shields.io/npm/l/envuments)](https://www.npmjs.com/package/envuments)

---

A powerful TypeScript-first environment configuration library that provides type detection, template variable resolution, and decorator-based class property configuration by extending dotenv.

This library is inspired by [envuments](https://github.com/mason-rogers/envuments).

## Features

- 🔧 **Automatic Type Detection** - Types inferred from fallback values
- 🔗 **Template Variables** - `${VAR}` syntax with circular reference protection
- 🎯 **Class Properties** - Decorator-based configuration for class members
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

// Global application configuration using static properties
class AppConfig extends Envapter {
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

// Service-specific configuration using instance properties
class DatabaseService {
  @Envapt('DATABASE_URL', 'sqlite://memory')
  declare readonly databaseUrl: string;

  @Envapt('MAX_CONNECTIONS', { converter: 'number', fallback: 10 })
  declare readonly maxConnections: number;

  async connect() {
    console.log(`Connecting to ${this.databaseUrl} with max ${this.maxConnections} connections`);
    // Connection logic here
  }
}

// Usage
console.log(AppConfig.port); // 8443 (number)
console.log(AppConfig.url); // "http://localhost:8443" (templated!)
console.log(AppConfig.allowedOrigins); // ["https://app.com", "https://admin.com"]
console.log(AppConfig.isProduction); // false (provided by the Envapter class)

const dbService = new DatabaseService();
await dbService.connect(); // Uses instance properties
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

The `@Envapt` decorator can be used on both **static** and **instance** class properties:

- **Static properties**: Use for global configuration that's shared across your entire application (e.g., app port, global features, environment settings)
- **Instance properties**: Use for service-specific configuration that may vary per service or when you want the configuration tied to a specific class instance (e.g., database connections, service endpoints, per-service settings)

**Important**: Instance properties must be declared with `declare` keyword or `!` assertion since they're populated by the decorator rather than set in a constructor.

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
// Global app configuration (static properties)
class AppConfig extends Envapter {
  @Envapt('APP_NAME', 'MyApp') // string
  static readonly appName: string;

  @Envapt('APP_PORT', 3000) // number
  static readonly port: number;

  @Envapt('DEBUG_MODE', false) // boolean
  static readonly debugMode: boolean;
}

// Service-specific configuration (instance properties)
class EmailService {
  @Envapt('SMTP_HOST', 'localhost') // string
  declare readonly smtpHost: string;

  @Envapt('SMTP_PORT', 587) // number
  declare readonly smtpPort: number;

  @Envapt('SMTP_SECURE', true) // boolean
  declare readonly smtpSecure: boolean;

  sendEmail(to: string, subject: string) {
    console.log(`Sending email via ${this.smtpHost}:${this.smtpPort} (secure: ${this.smtpSecure})`);
    // Email sending logic using instance properties
  }
}
```

#### Built-in Converters

Envapt provides many built-in converters for common patterns. Here are examples using both static and instance properties:

```ts
// Application-wide configuration (static)
class AppConfig extends Envapter {
  // String converter (explicit)
  @Envapt('APP_NAME', { converter: 'string', fallback: 'MyApp' })
  static readonly appName: string;

  // Numeric converters
  @Envapt('PORT', { converter: 'number', fallback: 3000 })
  static readonly port: number;

  @Envapt('MAX_CONNECTIONS', { converter: 'integer', fallback: 100 })
  static readonly maxConnections: number;

  // Boolean converter (supports yes/no, on/off, 1/0, true/false)
  @Envapt('PRODUCTION_MODE', { converter: 'boolean', fallback: false })
  static readonly productionMode: boolean;

  // Array with different delimiters
  @Envapt('CORS_ORIGINS', { converter: { delimiter: '|' }, fallback: [] })
  static readonly corsOrigins: string[];

  // JSON converter (safely parses JSON)
  @Envapt('GLOBAL_CONFIG', { converter: 'json', fallback: {} })
  static readonly globalConfig: object;
}

// Service-specific configuration (instance)
class CacheService {
  @Envapt('REDIS_HOST', { fallback: 'localhost' })
  declare readonly host: string;

  @Envapt('REDIS_PORT', { converter: 'integer', fallback: 6379 })
  declare readonly port: number;

  @Envapt('CACHE_TTL', { converter: 'float', fallback: 60.5 })
  declare readonly ttl: number;

  @Envapt('REDIS_URL', { converter: 'url', fallback: new URL('redis://localhost:6379') })
  declare readonly url: URL;

  @Envapt('CACHE_KEYS', { converter: 'array', fallback: [] })
  declare readonly keys: string[];

  connect() {
    console.log(`Connecting to Redis at ${this.host}:${this.port}`);
    console.log(`Cache TTL: ${this.ttl}s, Keys: ${this.keys.join(', ')}`);
  }
}

// Authentication service (instance)
class AuthService {
  @Envapt('JWT_SECRET', { fallback: 'dev-secret' })
  declare readonly jwtSecret: string;

  @Envapt('TOKEN_EXPIRY', { converter: 'date', fallback: new Date() })
  declare readonly tokenExpiry: Date;

  @Envapt('AUTH_PROVIDERS', { converter: { delimiter: ',', type: 'string' }, fallback: [] })
  declare readonly providers: string[];

  @Envapt('SESSION_REGEX', { converter: 'regexp', fallback: /.*/ })
  declare readonly sessionPattern: RegExp;

  @Envapt('MAX_LOGIN_ATTEMPTS', { converter: 'bigint', fallback: 5n })
  declare readonly maxAttempts: bigint;

  validateSession(sessionId: string): boolean {
    return this.sessionPattern.test(sessionId);
  }
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

For more control over array parsing, use the ArrayConverter object syntax:

```ts
// Global feature configuration (static)
class FeatureConfig extends Envapter {
  @Envapt('GLOBAL_TAGS', { converter: 'array', fallback: [] })
  static readonly globalTags: string[];

  @Envapt('ENABLED_FEATURES', { converter: { delimiter: '|' }, fallback: [] })
  static readonly enabledFeatures: string[];
}

// Microservice configuration (instance)
class ApiService {
  // Custom delimiter
  @Envapt('ALLOWED_METHODS', { converter: { delimiter: '|' }, fallback: ['GET'] })
  declare readonly allowedMethods: string[];

  // Custom delimiter with type conversion
  @Envapt('RATE_LIMITS', { converter: { delimiter: ',', type: 'number' }, fallback: [100] })
  declare readonly rateLimits: number[];

  @Envapt('FEATURE_FLAGS', { converter: { delimiter: ';', type: 'boolean' }, fallback: [false] })
  declare readonly featureFlags: boolean[];

  // Multiple custom delimiters
  @Envapt('API_ENDPOINTS', { converter: { delimiter: ' | ' }, fallback: ['/health'] })
  declare readonly endpoints: string[];

  isMethodAllowed(method: string): boolean {
    return this.allowedMethods.includes(method.toUpperCase());
  }
}
```

**ArrayConverter Interface:**

- `delimiter: string` - The string used to split array elements
- `type?: BuiltInConverter` - Optional type to convert each element to (excludes 'array', 'json', and 'regexp')

#### Custom Converters

Transform environment values to any type using both static and instance properties:

```ts
// Global configuration (static)
class GlobalConfig extends Envapter {
  @Envapt('GLOBAL_TAGS', {
    fallback: new Set(['default']),
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      return new Set(raw.split(',').map((s) => s.trim()));
    }
  })
  static readonly globalTags: Set<string>;
}

// Service configuration (instance)
class NotificationService {
  @Envapt('NOTIFICATION_CHANNELS', {
    fallback: new Map([['email', 'enabled']]),
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      const map = new Map();
      raw.split(',').forEach((pair) => {
        const [key, value] = pair.split(':');
        map.set(key?.trim(), value?.trim() || 'enabled');
      });
      return map;
    }
  })
  declare readonly channels: Map<string, string>;

  isChannelEnabled(channel: string): boolean {
    return this.channels.get(channel) === 'enabled';
  }
}
```

#### Handling Missing Values

Control what happens when environment variables don't exist:

```ts
// Application configuration (static)
class AppConfig extends Envapter {
  // Returns undefined if not found
  @Envapt('OPTIONAL_FEATURE', { fallback: undefined })
  static readonly optionalFeature: string | undefined;

  // Returns null if not found (no fallback provided)
  @Envapt('MISSING_CONFIG', { converter: 'string' })
  static readonly missingConfig: string | null;

  // Uses fallback if not found
  @Envapt('DEFAULT_THEME', { fallback: 'light' })
  static readonly defaultTheme: string;
}

// Service configuration (instance)
class LoggingService {
  // Optional instance configuration
  @Envapt('LOG_FILE_PATH', { fallback: undefined })
  declare readonly logFilePath: string | undefined;

  @Envapt('LOG_LEVEL', { fallback: 'info' })
  declare readonly logLevel: string;

  shouldLogToFile(): boolean {
    return this.logFilePath !== undefined;
  }
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

### Complex Configuration Classes

#### Global Application Configuration (Static Properties)

```ts
import { Envapt } from '@seedcord/envapt';

class AppConfig extends Envapter {
  @Envapt('PORT', 3000)
  static readonly port: number;

  @Envapt('HOST', 'localhost')
  static readonly host: string;

  @Envapt('CORS_ORIGINS', {
    fallback: ['http://localhost:3000'],
    converter: 'array'
  })
  static readonly corsOrigins: string[];

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
}
```

#### Service-Specific Configuration (Instance Properties)

```ts
// Database service configuration
class DatabaseService {
  @Envapt('DATABASE_URL', 'sqlite://memory')
  declare readonly databaseUrl: string;

  @Envapt('DB_POOL_SIZE', { converter: 'integer', fallback: 10 })
  declare readonly poolSize: number;

  @Envapt('DB_TIMEOUT', { converter: 'number', fallback: 30000 })
  declare readonly timeout: number;

  @Envapt('DB_RETRY_ATTEMPTS', { converter: 'integer', fallback: 3 })
  declare readonly retryAttempts: number;

  async connect() {
    console.log(`Connecting to ${this.databaseUrl}`);
    console.log(`Pool size: ${this.poolSize}, Timeout: ${this.timeout}ms`);
    // Connection logic here
  }
}

// Redis cache service configuration
class CacheService {
  @Envapt('REDIS_URLS', {
    fallback: [new URL('redis://localhost:6379')],
    converter: (raw, fallback) => (raw ? raw.split(',').map((s) => new URL(s)) : fallback)
  })
  declare readonly redisUrls: URL[];

  @Envapt('CACHE_PREFIX', { fallback: 'app:' })
  declare readonly cachePrefix: string;

  @Envapt('DEFAULT_TTL', { converter: 'integer', fallback: 3600 })
  declare readonly defaultTtl: number;

  async set(key: string, value: any, ttl?: number) {
    const prefixedKey = `${this.cachePrefix}${key}`;
    const cacheTtl = ttl || this.defaultTtl;
    console.log(`Setting cache ${prefixedKey} with TTL ${cacheTtl}s`);
    // Cache logic here
  }
}
```

### Custom Converter Examples

#### Static Properties for App-Wide Configuration

```ts
// Parse global JSON configuration
class GlobalConfig extends Envapter {
  @Envapt('GLOBAL_CONFIG_JSON', {
    fallback: {},
    converter: 'json'
  })
  static readonly config: Record<string, any>;

  @Envapt('APP_TIMEOUT', {
    fallback: 30000,
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      const match = raw.match(/^(\d+)(s|ms|m|h)?$/);
      if (!match) return fallback;
      const [, num, unit = 'ms'] = match;
      const value = parseInt(num);
      if (unit === 's') return value * 1000;
      if (unit === 'm') return value * 60 * 1000;
      if (unit === 'h') return value * 60 * 60 * 1000;
      return value;
    }
  })
  static readonly timeout: number;
}
```

#### Instance Properties for Service Configuration

```ts
// Email service with custom duration parsing
class EmailService {
  @Envapt('SMTP_CONFIG', {
    fallback: { host: 'localhost', port: 587, secure: false },
    converter: 'json'
  })
  declare readonly smtpConfig: { host: string; port: number; secure: boolean };

  @Envapt('EMAIL_RETRY_DELAY', {
    fallback: 5000, // 5 seconds
    converter: (raw, fallback) => {
      if (!raw) return fallback;
      const match = raw.match(/^(\d+)(s|m|h)$/);
      if (!match) return fallback;
      const [, num, unit] = match;
      const value = parseInt(num);
      if (unit === 's') return value * 1000;
      if (unit === 'm') return value * 60 * 1000;
      if (unit === 'h') return value * 60 * 60 * 1000;
      return fallback;
    }
  })
  declare readonly retryDelay: number;

  async sendEmail(to: string, subject: string, body: string) {
    const { host, port, secure } = this.smtpConfig;
    console.log(`Sending email via ${host}:${port} (secure: ${secure})`);
    // Email logic with retry using this.retryDelay
  }
}
```

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/mason-rogers/envuments).
