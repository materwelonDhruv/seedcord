import mongoose from 'mongoose';
import { IDocument } from '../library/types/Miscellaneous';
import { Database } from './Database';
import { ServiceMetadataKey } from './decorators/DatabaseService';
import { ServiceMap } from './types/ServiceMap';
import { ModelMetadataKey } from './decorators/DatabaseModel';

export abstract class BaseService<D extends IDocument = IDocument> {
  public readonly model: mongoose.Model<D>;

  public constructor(protected readonly db: Database) {
    const ctor = this.constructor;

    const key = Reflect.getMetadata(ServiceMetadataKey, ctor) as string | undefined;
    if (!key) throw new Error(`Missing @DatabaseService on ${ctor.name}`);

    const model = Reflect.getMetadata(ModelMetadataKey, ctor) as mongoose.Model<D> | undefined;
    if (!model) throw new Error(`Missing @DatabaseModel on ${ctor.name}`);

    this.model = model;

    db._register(key as keyof ServiceMap, this as unknown as ServiceMap[keyof ServiceMap]);
  }
}
