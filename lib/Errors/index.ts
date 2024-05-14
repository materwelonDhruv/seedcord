import { CustomErrorEmbed } from '../Interfaces';

// Exports
export * from './Database';
export * from './Channels';
export * from './Unauthorized';

export class GenericErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while processing this request. Please report this to materwelon`
    );
  }
}

/**
 * Handles an error by throwing a custom error with a formatted message.
 * @template T - The type of the custom error class.
 * @param error - The error to handle.
 * @param message - The error message.
 * @param CustomError - The custom error class.
 * @throws {CustomError} - Throws a custom error with the formatted message.
 * @returns {never} - This function never returns as it always throws an error.
 */
export function throwCustomError<T extends new (...args: any[]) => Error>(
  error: unknown,
  message: string,
  CustomError: T
): never {
  if (error instanceof Error) {
    throw new CustomError(`${message}: ${error.message}`);
  } else {
    throw new CustomError(message);
  }
}
