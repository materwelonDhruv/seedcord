import 'reflect-metadata';
import { HookKeys } from '../types/HookMap';
import { ConstructorFunction } from '../../library/types/Miscellaneous';

export const HookMetadataKey = Symbol('hook:metadata');

export function RegisterHook(hook: HookKeys) {
  return function (constructor: ConstructorFunction) {
    Reflect.defineMetadata(HookMetadataKey, hook, constructor);
  };
}
