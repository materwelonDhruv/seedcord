import {
  CustomErrorEmbed,
  DatabaseErrorEmbed,
  GenericErrorEmbed
} from '../../lib';

export class GeneralUtils {
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
      GeneralUtils.errorEmbedMap.get(errorName)?.(error) ??
      new GenericErrorEmbed();
    return errorEmbed;
  }
}
