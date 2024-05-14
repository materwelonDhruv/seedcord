export class StringUtils {
  /**
   * Rounds a number to a specified number of decimal places.
   *
   * @param num - The number to be rounded.
   * @param decimalPlaces - The number of decimal places to round to.
   * @returns The rounded number.
   */
  public static numberFixer(num: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round((num + Number.EPSILON) * factor) / factor;
  }

  /**
   * Takes two numbers and returns the percentage of the first number in the second number with two decimal places.
   *
   * @param num1 The first number.
   * @param num2 The second number.
   *
   * @returns The percentage of the first number in the second number with two decimal places.
   */
  public static percentage(num1: number, num2: number): number {
    return Number(((num1 / num2) * 100).toFixed(2));
  }

  /**
   * Returns the word with it's first letter capitalized and the rest in lowercase.
   * @param word - The word to be formatted.
   * @returns The formatted word.
   */
  public static formatWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  /**
   * Function takes an array of strings or numbers and returns the number of characters in the longest string/number
   * @param arr - The array of strings or numbers
   */
  public static longestStringLength(arr: (string | number)[]): number {
    return Math.max(...arr.map((el) => el.toString().length));
  }
}
