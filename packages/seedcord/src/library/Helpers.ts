import { readdir } from 'node:fs/promises';
import * as path from 'node:path';

import { DatabaseError } from '../bot/errors/Database';
import { Logger } from '../services/Logger';

// @ts-expect-error - TS thinks it's unused. But it's used in TSDoc
//  eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CustomErrorConstructor, CustomError } from '../interfaces/Components';
import type * as fs from 'node:fs';

/**
 * Determines if a directory entry is a TypeScript or JavaScript file.
 *
 * @param entry - The directory entry to check.
 * @returns True if the entry is a file ending with .ts or .js.
 */
export function isTsOrJsFile(entry: fs.Dirent): boolean {
  return (
    entry.isFile() &&
    (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) &&
    !entry.name.endsWith('.d.ts') &&
    !entry.name.endsWith('.map')
  );
}

/**
 * Recursively traverses through a directory, importing all .ts and .js files and applying a callback to each import.
 *
 * @param dir - The directory path to traverse.
 * @param callback - A function that will be called for each imported module. It receives the full file path, the file's relative path, and the imported module as arguments.
 * @returns A Promise that resolves when the traversal is complete.
 */
export async function traverseDirectory(
  dir: string,
  callback: (fullPath: string, relativePath: string, imported: Record<string, unknown>) => Promise<void> | void
): Promise<void> {
  let entries: fs.Dirent[];

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    Logger.Error('Failed to read directory', dir);
    entries = [];
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      await traverseDirectory(fullPath, callback);
    } else if (isTsOrJsFile(entry)) {
      const imported = (await import(fullPath)) as Record<string, unknown>;
      await callback(fullPath, relativePath, imported);
    }
  }
}

/**
 * Throws a custom error with a formatted message and optional UUID.
 *
 * Wraps an unknown error in a {@link CustomError} subclass. If the error class
 * is {@link DatabaseError}, a UUID is generated and passed to the constructor.
 *
 * @typeParam T - A constructor for a {@link CustomError} subclass
 * @param error - The original error or value
 * @param message - Custom message to include
 * @param CustomError - Error class to instantiate and throw
 * @throws Instance of the provided {@link CustomError} subclass
 *
 * @example
 * ```typescript
 * try {
 *   // risky code
 * } catch (e) {
 *   throwCustomError(e, "Something went wrong", MyCustomError);
 * }
 * ```
 */
export function throwCustomError<Ctor extends CustomErrorConstructor>(
  error: unknown,
  message: string,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CustomError: Ctor
): never {
  const uuid = crypto.randomUUID();
  Logger.Error('Throwing Custom Error', (error as Error).name);

  if (typeof CustomError === typeof DatabaseError) {
    const errorMessage = error instanceof Error ? error.message : message;
    throw new CustomError(errorMessage, uuid);
  } else {
    if (error instanceof Error) {
      throw new CustomError(`${message}: ${error.message ? error.message : error.toString()}`);
    } else {
      throw new CustomError(message);
    }
  }
}
