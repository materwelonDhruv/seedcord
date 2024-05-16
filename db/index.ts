import mongoose from 'mongoose';
import { Constants, DatabaseConnectionFailure, ErrorUtils } from '../lib';

export default class Database {
  private readonly uri: string;

  constructor() {
    this.uri = `${Constants.MONGO_URI}`;
  }

  public async connect(): Promise<void> {
    await mongoose
      .connect(this.uri, {
        ...(Constants.ENV === 'production' ? { tls: true } : {}),
        ...(Constants.ENV === 'production' ? { ssl: true } : {}),
        dbName: Constants.DB_NAME
      })
      .then((instance) =>
        console.log('Connected to MongoDB: ' + instance.connection.name)
      )
      .catch((err) => {
        ErrorUtils.throwCustomError(
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
