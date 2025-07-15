import mongoose from 'mongoose';
import { ServiceMapKeys } from '../types/ServiceMap';

export const ModelMetadataKey = Symbol('db:model');

export function DatabaseModel(collection: ServiceMapKeys) {
  return <T extends Record<K, mongoose.Schema>, K extends keyof T & (string | symbol)>(
    target: T,
    propertyKey: K
  ): void => {
    const schema = target[propertyKey];
    const name = collection;
    const model = mongoose.model(name, schema);
    Reflect.defineMetadata(ModelMetadataKey, model, target);
  };
}
