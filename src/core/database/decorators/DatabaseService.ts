import { ConstructorFunction } from '../../library/types/Miscellaneous';
import { BaseService } from '../BaseService';
import { ServiceMapKeys } from '../types/Services';

export const ServiceMetadataKey = Symbol('db:serviceKey');

export function DatabaseService(key: ServiceMapKeys) {
  return <T extends ConstructorFunction & { prototype: BaseService }>(ctor: T): void => {
    Reflect.defineMetadata(ServiceMetadataKey, key, ctor);
  };
}
