import type { PackageCatalogEntry } from './types';

export const PACKAGE_CATALOG: readonly PackageCatalogEntry[] = [
    {
        id: '@seedcord/core',
        label: '@seedcord/core',
        description: 'Runtime lifecycle, scheduling, and Discord gateway helpers.',
        versions: [
            {
                id: 'v0.2.5',
                label: 'v0.2.5 • latest',
                summary: 'Current stable release with task orchestration.',
                categories: [
                    { title: 'Classes', tone: 'class', items: ['Client', 'GatewayManager', 'TaskQueue'] },
                    {
                        title: 'Interfaces',
                        tone: 'interface',
                        items: ['ClientOptions', 'LoggerOptions', 'ShardConfig']
                    },
                    { title: 'Types', tone: 'type', items: ['DeepPartial', 'LifecycleHook', 'MaybePromise'] },
                    {
                        title: 'Functions',
                        tone: 'function',
                        items: ['createService', 'createPlugin', 'resolveGateway']
                    },
                    { title: 'Enums', tone: 'enum', items: ['LogLevel', 'ShardStatus', 'TaskState'] },
                    {
                        title: 'Variables',
                        tone: 'variable',
                        items: ['DEFAULT_TIMEOUT', 'MAX_RETRIES', 'SeedcordVersion']
                    }
                ]
            },
            {
                id: 'canary',
                label: 'canary',
                summary: 'Experimental build with background requeueing.',
                categories: [
                    { title: 'Classes', tone: 'class', items: ['Client', 'EventBus', 'ShardSupervisor'] },
                    {
                        title: 'Interfaces',
                        tone: 'interface',
                        items: ['ClientOptions', 'MetricsReporter', 'Scheduler']
                    },
                    { title: 'Types', tone: 'type', items: ['LifecycleHook', 'ResolvedConfig', 'MaybePromise'] },
                    {
                        title: 'Functions',
                        tone: 'function',
                        items: ['createService', 'createPlugin', 'useInstrumentation']
                    },
                    { title: 'Enums', tone: 'enum', items: ['LogLevel', 'ReconnectPolicy', 'TaskState'] },
                    {
                        title: 'Variables',
                        tone: 'variable',
                        items: ['DEFAULT_TIMEOUT', 'HEARTBEAT_INTERVAL', 'SeedcordVersion']
                    }
                ]
            }
        ]
    },
    {
        id: '@seedcord/plugins',
        label: '@seedcord/plugins',
        description: 'Composable plugin framework, decorators, and guards.',
        versions: [
            {
                id: 'v0.2.5',
                label: 'v0.2.5',
                summary: 'Stable plugin decorators and context helpers.',
                categories: [
                    { title: 'Functions', tone: 'function', items: ['createPlugin', 'defineLifecycle', 'useContext'] },
                    { title: 'Interfaces', tone: 'interface', items: ['PluginMetadata', 'PluginOptions'] },
                    { title: 'Types', tone: 'type', items: ['PluginFactory', 'PluginResult'] },
                    { title: 'Variables', tone: 'variable', items: ['DEFAULT_PLUGIN_TIMEOUT', 'PLUGIN_SYMBOLS'] }
                ]
            },
            {
                id: 'legacy',
                label: 'v0.1.x',
                summary: 'Legacy decorators retained for migration guidance.',
                categories: [
                    { title: 'Functions', tone: 'function', items: ['createPlugin', 'withPlugin', 'registerCommand'] },
                    { title: 'Types', tone: 'type', items: ['PluginContext', 'LegacyHook'] },
                    { title: 'Variables', tone: 'variable', items: ['LEGACY_TIMEOUT', 'PLUGIN_VERSION'] }
                ]
            }
        ]
    },
    {
        id: '@seedcord/services',
        label: '@seedcord/services',
        description: 'Service registry, dependency injection, and schedulers.',
        versions: [
            {
                id: 'v0.2.5',
                label: 'v0.2.5',
                summary: 'Default service bus with resilient jobs.',
                categories: [
                    { title: 'Classes', tone: 'class', items: ['ServiceContainer', 'JobRunner'] },
                    { title: 'Interfaces', tone: 'interface', items: ['ServiceDefinition', 'JobContext'] },
                    { title: 'Functions', tone: 'function', items: ['createService', 'useService', 'registerJob'] },
                    { title: 'Types', tone: 'type', items: ['ServiceToken', 'JobPayload'] }
                ]
            }
        ]
    }
];
