import { DatabaseErrorEmbed, GenericErrorEmbed } from '../Components';
import { CustomErrorEmbed } from '../Interfaces';

export class GeneralFunctions {
  public static getErrorEmbed(error: any): CustomErrorEmbed {
    const errorEmbedMap: Record<string, () => CustomErrorEmbed> = {
      DatabaseError: () => new DatabaseErrorEmbed(),
      DatabaseConnectionFailure: () => new DatabaseErrorEmbed(),
    };

    const errorName: string =
      error instanceof Error ? error.constructor.name : '';

    const errorEmbed: CustomErrorEmbed =
      errorEmbedMap[errorName]?.() ?? new GenericErrorEmbed();

    return errorEmbed;
  }
}
