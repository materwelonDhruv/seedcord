import { BaseService } from '../BaseService';

// Base constraint for any service map - all values must extend BaseService
export type ServiceMapConstraint = Record<string, BaseService<any>>;

// This interface can be augmented via declaration merging
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Services extends ServiceMapConstraint {}

// Helper type to extract service keys
export type ServiceMapKeys = keyof Services;
