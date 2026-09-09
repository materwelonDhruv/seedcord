export { ApiDocsGenerator } from './ApiDocsGenerator';
export { documentedPackageNames } from './workspace';
export type { ApiDocsGeneratorOptions, ApiDocsGeneratorResult } from './ApiDocsGenerator';
export type * from './types';

export const version = process.env.PACKAGE_VERSION ?? '0.0.0';
