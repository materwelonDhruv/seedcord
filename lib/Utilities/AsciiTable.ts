/**
 * Generates an ASCII table from the provided data.
 *
 * @param data - The data to be displayed in the table.
 * @returns The generated ASCII table as a string.
 */
export function generateAsciiTable(data: string[][]): string {
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
