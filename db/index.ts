import mongoose from 'mongoose';
import { Constants, DatabaseConnectionFailure, throwCustomError } from '../lib';

export default class Database {
  private readonly uri: string;

  constructor() {
    this.uri = `${Constants.mongoUri}`;
  }

  public async connect(): Promise<void> {
    await mongoose
      .connect(this.uri, {
        ...(Constants.environment === 'production' ? { tls: true } : {}),
        ...(Constants.environment === 'production' ? { ssl: true } : {}),
        dbName: Constants.dbName
      })
      .then((instance) =>
        console.log('Connected to MongoDB: ' + instance.connection.name)
      )
      .catch((err) => {
        throwCustomError(
          err,
          'Could not connect to MongoDB',
          DatabaseConnectionFailure
        );
      });
  }

  public async disconnect(): Promise<void> {
    await mongoose
      .disconnect()
      .then(() => console.log('Disconnected from MongoDB'))
      .catch((err) => console.error('Could not disconnect from MongoDB', err));
  }
}

// export * from './Middleware';
// export * from './Models';
