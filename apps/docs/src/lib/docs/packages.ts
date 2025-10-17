import { cache } from 'react';

import type { DocsEngine } from '@seedcord/docs-engine';

type ExternalDocumentationMap = ReadonlyMap<string, string>;

const rawExternalLinks = {
    // Built-in types
    bigint: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt',
    boolean: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
    null: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null',
    number: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number',
    string: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String',
    symbol: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol',
    undefined: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined',

    // Built-in classes
    AbortSignal: 'https://developer.mozilla.org/docs/Web/API/AbortSignal',
    Agent: 'https://undici.nodejs.org/#/docs/api/Agent',
    Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array',
    ArrayBuffer: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer',
    AsyncGenerator: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator',
    AsyncIterable: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols',
    AsyncIterableIterator: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols',
    Buffer: 'https://nodejs.org/api/buffer.html#class-buffer',
    ChildProcess: 'https://nodejs.org/api/child_process.html#class-childprocess',
    Date: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date',
    Dispatcher: 'https://undici.nodejs.org/#/docs/api/Dispatcher',
    Error: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error',
    Function: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function',
    Generator: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator',
    IncomingMessage: 'https://nodejs.org/api/http.html#class-httpincomingmessage',
    Iterable: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols',
    IterableIterator: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols',
    Iterator: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator',
    Map: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map',
    MessagePort: 'https://nodejs.org/api/worker_threads.html#class-messageport',
    Promise: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    RangeError: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RangeError',
    Readable: 'https://nodejs.org/api/stream.html#class-streamreadable',
    ReadableStream: 'https://developer.mozilla.org/docs/Web/API/ReadableStream',
    RegExp: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
    Response: 'https://developer.mozilla.org/docs/Web/API/Response',
    ServerResponse: 'https://nodejs.org/api/http.html#class-httpserverresponse',
    Set: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set',
    Stream: 'https://nodejs.org/api/stream.html#stream',
    SymbolConstructor: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol',
    TypeError: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypeError',
    URL: 'https://developer.mozilla.org/docs/Web/API/URL',
    URLSearchParams: 'https://developer.mozilla.org/docs/Web/API/URLSearchParams',
    WeakMap: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap',
    WeakRef: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakRef',
    WeakSet: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet',
    WebSocket: 'https://developer.mozilla.org/docs/Web/API/WebSocket',
    Worker: 'https://nodejs.org/api/worker_threads.html#class-worker',
    'NodeJS.Timeout': 'https://nodejs.org/api/timers.html#class-timeout',

    // Typed arrays
    BigInt64Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array',
    BigUint64Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array',
    Float32Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array',
    Float64Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float64Array',
    Int16Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array',
    Int32Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int32Array',
    Int8Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array',
    Uint16Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array',
    Uint32Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array',
    Uint8Array: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array',
    Uint8ClampedArray: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray',

    // TypeScript types
    any: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
    never: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#never',
    object: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#object',
    ReadonlyArray: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type',
    ReadonlyMap:
        'https://github.com/microsoft/TypeScript/blob/1416053b9e85ca2344a7a6aa10456d633ea1cd65/src/lib/es2015.collection.d.ts#L38-L43',
    ReadonlySet:
        'https://github.com/microsoft/TypeScript/blob/1416053b9e85ca2344a7a6aa10456d633ea1cd65/src/lib/es2015.collection.d.ts#L104-L108',
    unknown: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown',
    void: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#void',

    // TypeScript utility types
    Awaited: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype',
    Partial: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
    Required: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype',
    Readonly: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
    Record: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
    Pick: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
    Omit: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys',
    Exclude: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers',
    Extract: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union',
    NonNullable: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype',
    Parameters: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype',
    ConstructorParameters: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype',
    ReturnType: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype',
    InstanceType: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype',
    ThisParameterType: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype',
    OmitThisParameter: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparametertype',
    ThisType: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype',
    Uppercase: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#uppercasestringtype',
    Lowercase: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#lowercasestringtype',
    Capitalize: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#capitalizestringtype',
    Uncapitalize: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#uncapitalizestringtype',

    // External Libraries
    'discord.js': 'https://discord.js.org/docs',
    mongoose: 'https://mongoosejs.com/docs/guide.html'
} as const;

export const EXTERNAL_DOCUMENTATION_LINKS: ExternalDocumentationMap = new Map(
    Object.entries(rawExternalLinks).map(([key, value]) => [key.toLowerCase(), value])
);

interface PackageOverride {
    displayName?: string;
    aliases?: readonly string[];
}

const PACKAGE_OVERRIDES: Record<string, PackageOverride> = {
    seedcord: {
        displayName: 'seedcord',
        aliases: ['@seedcord', 'core']
    },
    '@seedcord/plugins': {
        displayName: 'plugins',
        aliases: ['@seedcord/plugins']
    },
    '@seedcord/services': {
        displayName: 'services',
        aliases: ['@seedcord/services']
    },
    '@seedcord/types': {
        displayName: 'types',
        aliases: ['@seedcord/types']
    },
    '@seedcord/utils': {
        displayName: 'utils',
        aliases: ['@seedcord/utils']
    },
    '@seedcord/eslint-config': {
        displayName: 'eslint-config',
        aliases: ['eslint', '@seedcord/eslint-config']
    }
};

const DEFAULT_MANIFEST_PACKAGE = 'seedcord';

const normalizeKey = (value: string): string => value.trim().toLowerCase();

export function resolveExternalPackageUrl(packageName?: string | null): string | null {
    if (!packageName) {
        return null;
    }

    const normalized = normalizeKey(packageName);
    return EXTERNAL_DOCUMENTATION_LINKS.get(normalized) ?? null;
}

export function formatDisplayPackageName(manifestName: string): string {
    const override = PACKAGE_OVERRIDES[manifestName]?.displayName;
    return override ?? manifestName;
}

const computePackageAliases = cache((available: readonly string[]): Map<string, string> => {
    const map = new Map<string, string>();

    for (const manifestName of available) {
        const override = PACKAGE_OVERRIDES[manifestName];
        const aliases = new Set<string>([
            manifestName,
            normalizeKey(manifestName),
            formatDisplayPackageName(manifestName),
            normalizeKey(formatDisplayPackageName(manifestName))
        ]);

        const lastSegment = manifestName.includes('/') ? manifestName.split('/').at(-1) : manifestName;
        if (lastSegment) {
            aliases.add(lastSegment);
            aliases.add(normalizeKey(lastSegment));
        }

        if (!manifestName.startsWith('@')) {
            const scoped = `@seedcord/${manifestName}`;
            aliases.add(scoped);
            aliases.add(normalizeKey(scoped));
        }

        if (override?.aliases) {
            for (const alias of override.aliases) {
                aliases.add(alias);
                aliases.add(normalizeKey(alias));
            }
        }

        for (const alias of aliases) {
            map.set(normalizeKey(alias), manifestName);
        }
    }

    return map;
});

export function resolveManifestPackageName(engine: DocsEngine, requested?: string | null): string {
    const packages = engine.listPackages();
    if (!packages.length) {
        return DEFAULT_MANIFEST_PACKAGE;
    }

    if (!requested) {
        const fallback = packages[0] ?? DEFAULT_MANIFEST_PACKAGE;
        return packages.includes(DEFAULT_MANIFEST_PACKAGE) ? DEFAULT_MANIFEST_PACKAGE : fallback;
    }

    const aliasMap = computePackageAliases(packages);
    const normalized = normalizeKey(requested);
    const resolved = aliasMap.get(normalized);

    if (resolved) {
        return resolved;
    }

    const direct = packages.find((pkg) => normalizeKey(pkg) === normalized);
    if (direct) {
        return direct;
    }

    const fallback = packages[0] ?? DEFAULT_MANIFEST_PACKAGE;
    return packages.includes(DEFAULT_MANIFEST_PACKAGE) ? DEFAULT_MANIFEST_PACKAGE : fallback;
}

export function listDisplayPackages(engine: DocsEngine): string[] {
    return engine.listPackages().map((pkg) => formatDisplayPackageName(pkg));
}
