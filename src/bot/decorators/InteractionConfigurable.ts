import type { ConstructorFunction } from '../../core/library/types/Miscellaneous';

export enum InteractionRoutes {
  Slash = 'interaction:slash',
  Button = 'interaction:button',
  Modal = 'interaction:modal',
  StringMenu = 'interaction:stringMenu',
  UserMenu = 'interaction:userMenu',
  RoleMenu = 'interaction:roleMenu',
  ChannelMenu = 'interaction:channelMenu',
  MentionableMenu = 'interaction:mentionableMenu'
}

export enum SelectMenuType {
  String = 'string',
  User = 'user',
  Role = 'role',
  Channel = 'channel',
  Mentionable = 'mentionable'
}

export const InteractionMetadataKey = Symbol('interaction:metadata');

/**
 * Decorator for slash command routes. The route can be:
 *  - "profile"
 *  - "settings/edit"
 *  - "settings/advanced/edit"
 *
 * Pass an array of routes if the same handler should respond to multiple.
 */
export function SlashRoute(routeOrRoutes: string | string[]) {
  return function (constructor: ConstructorFunction): void {
    storeMetadata(InteractionRoutes.Slash, routeOrRoutes, constructor);
  };
}

/**
 * Decorator for button routes. This should match a `customId` prefix.
 * e.g., 'accept' or 'login'.
 */
export function ButtonRoute(routeOrRoutes: string | string[]) {
  return function (constructor: ConstructorFunction): void {
    storeMetadata(InteractionRoutes.Button, routeOrRoutes, constructor);
  };
}

/**
 * Decorator for modal routes. This should match a `customId` prefix.
 */
export function ModalRoute(routeOrRoutes: string | string[]) {
  return function (constructor: ConstructorFunction): void {
    storeMetadata(InteractionRoutes.Modal, routeOrRoutes, constructor);
  };
}

/**
 * Decorator for select menu routes. This should match a `customId` prefix.
 */
export function SelectMenuRoute(type: SelectMenuType, routeOrRoutes: string | string[]) {
  return function (constructor: ConstructorFunction): void {
    const routeMap = {
      [SelectMenuType.String]: InteractionRoutes.StringMenu,
      [SelectMenuType.User]: InteractionRoutes.UserMenu,
      [SelectMenuType.Role]: InteractionRoutes.RoleMenu,
      [SelectMenuType.Channel]: InteractionRoutes.ChannelMenu,
      [SelectMenuType.Mentionable]: InteractionRoutes.MentionableMenu
    };

    storeMetadata(routeMap[type], routeOrRoutes, constructor);
  };
}

/**
 * Helper to store route(s) in an array on reflect metadata.
 */
function storeMetadata(symbol: InteractionRoutes, routes: string | string[], constructor: ConstructorFunction): void {
  const areRoutes = (routes: unknown): routes is string[] => {
    return Array.isArray(routes) && routes.every((r) => typeof r === 'string');
  };

  const savedRoutes: unknown = Reflect.getMetadata(symbol, constructor);
  const existing: string[] = areRoutes(savedRoutes) ? savedRoutes : [];

  const toStore = Array.isArray(routes) ? routes : [routes];
  Reflect.defineMetadata(symbol, [...existing, ...toStore], constructor);
  Reflect.defineMetadata(InteractionMetadataKey, true, constructor);
}
