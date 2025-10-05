/* eslint-disable no-console */
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Application, EntryPointStrategy, LogLevel } from 'typedoc';

// configuration we can put in package.json to tweak how docs get generated
interface SeedcordDocsConfig {
  entryPoints?: string[];
  tsconfig?: string;
}

// shape of package.json we care about
interface PackageManifest {
  name: string;
  version: string;
  private?: boolean;
  types?: string;
  seedcordDocs?: SeedcordDocsConfig;
}

// result of trying to generate docs for one package
interface PackageDocResult {
  name: string;
  version: string;
  entryPoints: string[];
  outputPath: string | null;
  warnings: string[];
  errors: string[];
  succeeded: boolean;
}

// stable ref to where this script is so paths correctly work
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const REPO_ROOT = path.resolve(dirName, '..');
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages');
const OUTPUT_DIR = path.join(REPO_ROOT, 'docs', 'api');

// most of our packages expose src/index.ts, but we can override it later
const DEFAULT_ENTRY_POINTS = ['src/index.ts'];

/**
 * find every package folder that actually has a package.json file we can read
 */
async function discoverWorkspacePackages(): Promise<string[]> {
  const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  const packageDirs: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const packageDir = path.join(PACKAGES_DIR, entry.name);
    const packageJsonPath = path.join(packageDir, 'package.json');

    if (await pathExists(packageJsonPath)) packageDirs.push(packageDir);
  }

  return packageDirs;
}

/**
 * load the package.json so we can grab names, versions, and any custom doc config
 */
async function readPackageManifest(packageDir: string): Promise<PackageManifest> {
  const packageJsonPath = path.join(packageDir, 'package.json');
  const raw = await readFile(packageJsonPath, 'utf8');
  return JSON.parse(raw) as PackageManifest;
}

/**
 * light wrapper to check if a file or directory is really there before we rely on it
 */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * make sure relative paths look noice and work on every os
 */
function normalizeRelativePath(segment: string): string {
  return segment.replace(/^[.][/\\]+/, '').replace(/\\/g, '/');
}

// make a path relative to the repo root and use forward slashes so links work in markdown
function toRepoRelative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
}

/**
 * typedoc prints colored output, which is hard to stash in json, so we strip the control codes
 */
function stripAnsi(input: string): string {
  return input.replace(/\u001B\[[0-9;]*m/g, '');
}

/**
 * figure out which files typedoc should start from for a given package
 * it respects overrides in package.json, falls back to src/index.ts, and will try the types entry too
 */
async function resolveEntryPoints(
  packageDir: string,
  manifest: PackageManifest
): Promise<{ absolute: string[]; relative: string[] }> {
  const configured = manifest.seedcordDocs?.entryPoints ?? [];
  const candidateRelPaths = [...configured, ...DEFAULT_ENTRY_POINTS];
  const absolute: string[] = [];
  const relative: string[] = [];

  for (const candidate of candidateRelPaths) {
    const normalized = normalizeRelativePath(candidate);
    if (!normalized) continue;

    const absolutePath = path.join(packageDir, normalized);
    if (await pathExists(absolutePath)) {
      absolute.push(absolutePath);
      relative.push(normalized);
    }
  }

  if (absolute.length === 0 && manifest.types) {
    const normalizedTypes = normalizeRelativePath(manifest.types);
    const declarationCandidate = path.join(packageDir, normalizedTypes);

    if (await pathExists(declarationCandidate)) {
      absolute.push(declarationCandidate);
      relative.push(normalizedTypes);
    }
  }

  return { absolute, relative };
}

/**
 * pick the tsconfig typedoc should use, falling back to the package default unless someone points elsewhere
 */
function resolveTsconfigPath(packageDir: string, manifest: PackageManifest): string {
  const override = manifest.seedcordDocs?.tsconfig;
  if (!override) return path.join(packageDir, 'tsconfig.json');

  if (path.isAbsolute(override)) return override;

  return path.join(packageDir, normalizeRelativePath(override));
}

/**
 * run typedoc for one package and collect the status, warnings, and output location
 */
// eslint-disable-next-line max-statements
async function extractPackageDocs(packageDir: string): Promise<PackageDocResult | null> {
  const manifest = await readPackageManifest(packageDir);
  if (manifest.private) return null;

  const { absolute: entryPoints, relative: relativeEntryPoints } = await resolveEntryPoints(packageDir, manifest);
  if (entryPoints.length === 0) {
    console.warn(`⚠️  Skipping ${manifest.name}: no entry points found`);
    return null;
  }

  const tsconfigPath = resolveTsconfigPath(packageDir, manifest);
  if (!(await pathExists(tsconfigPath))) {
    console.warn(`⚠️  Skipping ${manifest.name}: tsconfig not found at ${toRepoRelative(tsconfigPath)}`);
    return null;
  }

  const warnings: string[] = [];
  const errors: string[] = [];

  // make a typedoc app with the same options we'd pass on the command line
  const app = await Application.bootstrapWithPlugins({
    entryPoints,
    entryPointStrategy: EntryPointStrategy.Resolve,
    tsconfig: tsconfigPath,
    readme: 'none',
    includeVersion: true,
    categorizeByGroup: false,
    excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    excludeInternal: true,
    logLevel: LogLevel.Warn
  });

  const blockTags = (app.options.getValue('blockTags') as string[] | undefined) ?? [];
  // typedoc ignores @decorator for some reason even tho it's valid tsdoc
  if (!blockTags.includes('@decorator')) app.options.setValue('blockTags', [...blockTags, '@decorator']);

  // typedoc writes to stdout, so we intercept the logger to stash warn/error lines for the manifest
  const originalLog = app.logger.log.bind(app.logger);
  app.logger.log = (message, level, ...rest) => {
    const raw = typeof message === 'string' ? message : JSON.stringify(message);
    const text = stripAnsi(raw);

    if (level === LogLevel.Error) errors.push(text);
    else if (level === LogLevel.Warn) warnings.push(text);

    originalLog(message, level, ...rest);
  };

  const project = await app.convert();
  const unscopedName = manifest.name.includes('/') ? (manifest.name.split('/').pop() ?? manifest.name) : manifest.name;
  const outputPath = path.join(OUTPUT_DIR, `${unscopedName}.json`);

  let succeeded = false;
  if (project && errors.length === 0) {
    // we only save the json if typedoc gave us a project and no hard errors
    await app.generateJson(project, outputPath);
    succeeded = true;
  } else if (await pathExists(outputPath)) {
    // if something failed and we had stale output, clean it up so nobody trusts old data
    await rm(outputPath, { force: true });
  }

  return {
    name: manifest.name,
    version: manifest.version,
    entryPoints: relativeEntryPoints,
    outputPath: succeeded ? outputPath : null,
    warnings,
    errors,
    succeeded
  };
}

/**
 * write a simple manifest we save what got generated and whether any warnings happened
 */
async function writeManifest(results: PackageDocResult[]): Promise<void> {
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  const payload = {
    generatedAt: new Date().toISOString(),
    tool: 'typedoc',
    typedocVersion: Application.VERSION,
    packages: results.map((result) => ({
      name: result.name,
      version: result.version,
      entryPoints: result.entryPoints,
      output: result.outputPath ? toRepoRelative(result.outputPath) : null,
      warningCount: result.warnings.length,
      errorCount: result.errors.length,
      warnings: result.warnings,
      errors: result.errors,
      succeeded: result.succeeded
    }))
  };

  await writeFile(manifestPath, JSON.stringify(payload, null, 2), 'utf8');
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const packageDirs = await discoverWorkspacePackages();
  const results: PackageDocResult[] = [];

  for (const packageDir of packageDirs) {
    const result = await extractPackageDocs(packageDir);
    if (!result) continue;

    results.push(result);

    const statusIcon = result.succeeded ? '✅' : '❌';
    const outputSummary = result.outputPath ? `→ ${toRepoRelative(result.outputPath)}` : '→ —';
    const warningSummary = result.warnings.length > 0 ? ` ⚠️ ${result.warnings.length}` : '';
    console.log(`${statusIcon} ${result.name}@${result.version} ${outputSummary}${warningSummary}`);

    if (!result.succeeded) {
      throw new Error(`TypeDoc extraction failed for ${result.name}. See logs above.`);
    }
  }

  await writeManifest(results);

  console.log(`\nGenerated ${results.length} API documents → ${toRepoRelative(OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
