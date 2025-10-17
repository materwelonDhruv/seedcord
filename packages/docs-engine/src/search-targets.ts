export interface SearchTarget {
    query: string;
    packageName?: string;
}

export const DEFAULT_SEARCH_TARGETS: SearchTarget[] = [
    // Classes
    { query: 'MongoService' },
    { query: 'Seedcord' },
    { query: 'AutocompleteHandler' },
    { query: 'HealthCheck' },
    { query: 'BaseHandler' },
    { query: 'BaseErrorEmbed' },
    { query: 'BuilderComponent' },
    { query: 'CoordinatedShutdown' },
    { query: 'UnknownException' },
    { query: 'Mongo' },
    { query: 'BaseComponent' },

    // Properties
    { query: 'db' },
    { query: 'PLUGIN_INIT_TIMEOUT_MS' },
    { query: 'botColor' },
    { query: 'tasksMap' },
    { query: 'host' },
    { query: 'server' },

    // Methods
    { query: 'checkPermissions' },
    { query: 'canAddTask' },
    { query: 'logout' },
    { query: 'addTask' },

    // Accessors
    { query: 'isRunning' },
    { query: 'custom error emit' },
    { query: 'client' },

    // Interfaces
    { query: 'HandlerWithChecks' },
    { query: 'Handler' },
    { query: 'BaseCore' },
    { query: 'CooldownOptions' },

    // Types
    { query: 'AtleastOne' },
    { query: 'TupleOf' },
    { query: 'NumberRange' },
    { query: 'TypedConstructor' },
    { query: 'BotPermissionScopeGroups' },

    // Enums
    { query: 'StartupPhase' },
    { query: 'ShutdownPhase' },
    { query: 'SelectMenuType' },

    // Functions
    { query: 'prettify' },
    { query: 'fyShuffle' },
    { query: 'RegisterCommand' },
    { query: 'SelectMenuRoute' },
    { query: 'AutocompleteRoute' },
    { query: 'checkPermissions' },

    // Variables
    { query: 'BuilderTypes' },
    { query: 'EffectMetadataKey' },
    { query: 'RowTypes' },
    { query: 'PermissionNames' },
    { query: 'PERM_GROUPS' },
    { query: 'PRETTIER_CONFIG' }
];
