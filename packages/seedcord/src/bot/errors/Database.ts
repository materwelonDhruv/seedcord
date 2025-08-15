import { CustomError } from '../../interfaces/Components';

import type { UUID } from 'crypto';

/**
 * Error thrown when database connection fails.
 *
 * Provides a user-friendly message when the bot cannot establish
 * a connection to the database.
 */
export class MongoConnectionFailure extends CustomError {
  /**
   * Creates a new MongoConnectionFailure error.
   *
   * @param message - The error message
   */
  constructor(message = 'Failed to connect to the MongoDB.') {
    super(message);

    this.response.setDescription('Failed to connect to MongoDB.');
  }
}

/**
 * Generic database operation error with UUID tracking.
 *
 * Thrown for various database operation failures and includes
 * a UUID for error tracking and debugging purposes.
 */
export class DatabaseError extends CustomError {
  protected override _emit = true; // Emit in logs regardless of environment

  /**
   * Creates a new DatabaseError.
   *
   * @param message - The error message describing what went wrong
   * @param uuid - A unique identifier for this specific error instance
   */
  constructor(
    message: string,
    public uuid: UUID
  ) {
    super(message);
    this.name = 'DatabaseError';

    this.response
      .setTitle('Database Error')
      .setDescription(`An error occurred while interacting with the database.\n### UUID: \`${this.uuid}\``);
  }
}
