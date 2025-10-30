/**
 * Configuration options for MongoDB connection and service loading.
 */

export interface MongoOptions {
    /** Directory path containing database service classes */
    dir: string;
    /** MongoDB connection URI */
    uri: string;
    /** Database name to use */
    name: string;
}
