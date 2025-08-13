import 'reflect-metadata';

// Main exports
export * from './core/Seedcord';

// Bot exports
export * from './bot/Bot';

// Services exports
export * from './core/services/Logger';
export * from './core/services/Lifecycle/CoordinatedStartup';
export * from './core/services/Lifecycle/CoordinatedShutdown';
export * from './core/services/HealthCheck';
export * from './core/services/CooldownManager';

// Database exports
export * from './core/database/Mongo';
export * from './core/database/BaseService';

// Library exports
export * from './core/library/globals/Globals';
export * from './core/library/Helpers';
export type * from './core/library/interfaces/Core';
export type * from './core/library/interfaces/Config';

// Hooks exports
export * from './core/hooks/HookController';
export * from './core/hooks/HookEmitter';
