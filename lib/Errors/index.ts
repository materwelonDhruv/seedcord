import { CustomErrorEmbed } from '../Interfaces';
import { DatabaseErrorEmbed } from './Database';

// Exports
export * from './Database';
export * from './Channels';
export * from './Unauthorized';

// --------------------------------------------------------

export class GenericErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while processing this request. Please report this to materwelon`
    );
  }
}

export type CustomErrorType = new (...args: any[]) => Error;

export class ErrorUtils {
  private static errorEmbedMap = new Map<
    string,
    (error: any) => CustomErrorEmbed
  >([
    ['DatabaseError', () => new DatabaseErrorEmbed()],
    ['DatabaseConnectionFailure', () => new DatabaseErrorEmbed()]
  ]);

  public static getErrorEmbed(error: any): CustomErrorEmbed {
    const errorName = error instanceof Error ? error.constructor.name : '';
    const errorEmbed =
      ErrorUtils.errorEmbedMap.get(errorName)?.(error) ??
      new GenericErrorEmbed();
    return errorEmbed;
  }

  public static throwCustomError<T extends CustomErrorType>(
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
}
