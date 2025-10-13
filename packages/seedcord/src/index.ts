import 'reflect-metadata';

// Main exports
export * from './Seedcord';

// Bot export
export * from './bot/Bot';

// Bot decorators exports
export * from './bot/decorators/Checkable';
export * from './bot/decorators/Catchable';
export * from './bot/decorators/CommandRegisterable';
export * from './bot/decorators/EventCatchable';
export * from './bot/decorators/EventRegisterable';
export * from './bot/decorators/InteractionConfigurable';

// Bot Controller Exports
export * from './bot/controllers/CommandRegistry';
export * from './bot/controllers/EventController';
export * from './bot/controllers/InteractionController';

// Bot Error Exports
export * from './bot/errors/Channels';
export * from './bot/errors/Database';
export * from './bot/errors/Roles';
export * from './bot/errors/User';

// Bot Injectors Exports
export * from './bot/injectors/EmojiInjector';

// Bot Utilities Exports
export * from './bot/utilities/ChannelsUtils';
export * from './bot/utilities/ErrorHandlingUtils';
export * from './bot/utilities/MessageUtils';
export * from './bot/utilities/RoleUtils';
export * from './bot/utilities/UserUtils';

// Bot Default Exports
export * from './bot/defaults/UnhandledEvent';

// Library exports
export * from './library/Helpers';

// Interfaces exports
export * from './interfaces/Components';
export * from './interfaces/Handler';
export * from './interfaces/Plugin';
export type * from './interfaces/Core';
export type * from './interfaces/Config';

// Effects exports
export * from './effects/EffectsRegistry';
export * from './effects/EffectsEmitter';
export * from './effects/decorators/RegisterEffect';
export * from './effects/default/UnknownException';
export * from './effects/interfaces/EffectsHandler';
export * from './effects/interfaces/abstracts/WebhookLog';
export type * from './effects/types/Effects';

// Errors
export * from './bot/errors/Database';

// Export Services
export * from '@seedcord/services';

// Export Types
export type * from '@seedcord/types';

// Export Utils
export * from '@seedcord/utils';
