export class Utils {
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
   * Handles an error by throwing a custom error with a formatted message.
   * @template T - The type of the custom error class.
   * @param error - The error to handle.
   * @param message - The error message.
   * @param CustomError - The custom error class.
   * @throws {CustomError} - Throws a custom error with the formatted message.
   * @returns {never} - This function never returns as it always throws an error.
   */
  public static throwCustomError<T extends new (...args: any[]) => Error>(
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
   * Generates an ASCII table from the provided data.
   *
   * @param data - The data to be displayed in the table.
   * @returns The generated ASCII table as a string.
   */
  public static generateAsciiTable(data: string[][]): string {
    let table = '';
    const columnWidths: number[] = [];

    // Determine the maximum width for each column
    for (let i = 0; i < data[0].length; i++) {
      let maxWidth = 0;
      for (let j = 0; j < data.length; j++) {
        maxWidth = Math.max(maxWidth, data[j][i].length);
      }
      columnWidths.push(maxWidth);
    }

    // Function to create a horizontal line
    const createLine = (
      char: string,
      left: string,
      intersect: string,
      right: string
    ) => {
      let line = left;
      columnWidths.forEach((width, index) => {
        line += char.repeat(width + 2);
        if (index < columnWidths.length - 1) {
          line += intersect;
        } else {
          line += right;
        }
      });
      line += '\n';
      return line;
    };

    // Top border
    table += createLine('═', '╔', '╦', '╗');

    data.forEach((row, rowIndex) => {
      // Row content
      table += '║';
      row.forEach((cell, columnIndex) => {
        table += ` ${cell.padEnd(columnWidths[columnIndex])} ║`;
      });
      table += '\n';

      // Separator or bottom border
      if (rowIndex < data.length - 1) {
        table += createLine('─', '╠', '╬', '╣');
      } else {
        table += createLine('═', '╚', '╩', '╝');
      }
    });

    return table;
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
