/* eslint-disable no-console */
import { existsSync } from 'node:fs';
import path from 'node:path';

import { resolveManifestPath } from './constants';
import { DocsEngine } from './engine';
import { ManifestReader } from './manifest-reader';

import type { DocNode, DocManifestPackage } from './types';
import type { ProjectReflection } from 'typedoc';

const DIVIDER_WIDTH = 40;
const HELP_TEXT = `Usage: tsx temp.ts [generated-root]

- generated-root: optional absolute or relative path to the directory that contains the manifest.json file.
  Defaults to the docs generated directory resolved by \`resolveManifestPath\`.
`;

const KEY_SAMPLE_LIMIT = 15;

const formatEntryPoints = (pkg: DocManifestPackage): string => {
    if (!Array.isArray(pkg.entryPoints) || pkg.entryPoints.length === 0) {
        return 'n/a';
    }

    return pkg.entryPoints.join(', ');
};

const logPackageSummary = (pkg: DocManifestPackage, index: number): void => {
    console.log(`\n[${index + 1}] ${pkg.name}`);
    console.log(`  entry points: ${formatEntryPoints(pkg)}`);
    console.log(`  output: ${pkg.output ?? 'n/a'}`);
    console.log(`  succeeded: ${pkg.succeeded}`);
    console.log(`  warnings: ${pkg.warningCount} | errors: ${pkg.errorCount}`);
};

const logDivider = (): void => {
    console.log(`\n${'-'.repeat(DIVIDER_WIDTH)}`);
};

const resolveGeneratedRoot = (arg?: string): string | undefined => {
    if (!arg) {
        return undefined;
    }

    return path.resolve(process.cwd(), arg);
};

const printManifestSummary = (manifestPackages: DocManifestPackage[]): void => {
    console.log('Packages found:', manifestPackages.length);
    manifestPackages.forEach((pkg, index) => logPackageSummary(pkg, index));
};

const logEngineSummary = (engine: DocsEngine): void => {
    const packages = engine.listPackages();
    logDivider();
    console.log('Packages:', packages.join(', '));

    const firstName = packages[0];
    if (!firstName) {
        console.log('No packages available in engine.');
        return;
    }

    const firstPackage = engine.getPackage(firstName);
    if (!firstPackage) {
        console.log('Unable to resolve first package from engine.');
        return;
    }

    console.log('First package root:', firstPackage.root.name, 'children:', firstPackage.root.children.length);
    logTransformedRoot(firstPackage.root);
    logProjectOverview(firstPackage.project);

    const sample = engine.search('Prettier', firstPackage.manifest.name).slice(0, 5);
    const formattedSample = sample.length > 0 ? sample.map((entry) => entry.fullName).join(', ') : '(no matches)';
    console.log('Search sample:', formattedSample);
};

const findWorkspaceRoot = (): string => {
    let cursor = __dirname;
    let lastPackageJsonDir: string | null = null;

    for (;;) {
        const workspaceMarker = path.join(cursor, 'pnpm-workspace.yaml');
        if (existsSync(workspaceMarker)) {
            return cursor;
        }

        const packageJsonPath = path.join(cursor, 'package.json');
        if (existsSync(packageJsonPath)) {
            lastPackageJsonDir = cursor;
        }

        const parent = path.dirname(cursor);
        if (parent === cursor) {
            if (lastPackageJsonDir) {
                return lastPackageJsonDir;
            }

            throw new Error('Unable to locate workspace root from temp.ts');
        }

        cursor = parent;
    }
};

interface ReflectionSummary {
    name?: string | undefined;
    kind?: number | undefined;
    kindString?: string | undefined;
}

const toReflectionSummary = (value: unknown): ReflectionSummary => {
    if (!value || typeof value !== 'object') {
        return {};
    }

    const candidate = value as ReflectionSummary;

    const summary: ReflectionSummary = {};

    if (typeof candidate.name === 'string') {
        summary.name = candidate.name;
    }

    if (typeof candidate.kind === 'number') {
        summary.kind = candidate.kind;
    }

    if (typeof candidate.kindString === 'string') {
        summary.kindString = candidate.kindString;
    }

    return summary;
};

const formatChildSummary = (child: ReflectionSummary, index: number): string => {
    const kindLabel = child.kindString ?? (typeof child.kind === 'number' ? `#${child.kind}` : 'unknown');
    const name = child.name ?? '(anonymous)';
    return `  [${index + 1}] ${name} — ${kindLabel}`;
};

const logFirstReflectionDetails = (reflection: unknown): void => {
    const safe = reflection as Record<string, unknown> | null | undefined;
    if (!safe || typeof safe !== 'object') {
        return;
    }

    const safeRecord: Record<string, unknown> = safe;
    const childKeys = Object.keys(safeRecord);
    console.log('First reflection keys:', childKeys.slice(0, KEY_SAMPLE_LIMIT).join(', '));

    const typeParams = safeRecord.typeParameters;
    if (Array.isArray(typeParams) && typeParams.length > 0) {
        const typeParamKeys = Object.keys(typeParams[0] as Record<string, unknown>);
        console.log('Type parameter keys:', typeParamKeys.join(', '));
    }

    const signatures = safeRecord.signatures;
    if (Array.isArray(signatures) && signatures.length > 0) {
        const firstSignature = signatures[0] as Record<string, unknown>;
        const signatureKeys = Object.keys(firstSignature);
        console.log('Signature keys:', signatureKeys.join(', '));

        const parameterList = firstSignature.parameters;
        if (Array.isArray(parameterList) && parameterList.length > 0) {
            const paramKeys = Object.keys(parameterList[0] as Record<string, unknown>);
            console.log('Signature parameter keys:', paramKeys.join(', '));
        }
    }
};

const logGroupOverview = (project: ProjectReflection): void => {
    const groups = Array.isArray(project.groups) ? project.groups : [];
    if (groups.length === 0) {
        return;
    }

    const descriptions = groups.map((group) => {
        const count = Array.isArray(group.children) ? group.children.length : 0;
        const title = typeof group.title === 'string' ? group.title : 'Untitled';
        return `${title} (${count})`;
    });
    console.log('Groups:', descriptions.join(', '));

    const firstGroup = groups[0];
    if (!firstGroup) {
        return;
    }

    const keyList = Object.keys(firstGroup as unknown as Record<string, unknown>);
    console.log('First group keys:', keyList.join(', '));
    const childSample = Array.isArray(firstGroup.children) ? firstGroup.children[0] : undefined;
    console.log('First group child sample typeof:', typeof childSample);
};

const logProjectOverview = (project: ProjectReflection): void => {
    const children = Array.isArray(project.children) ? project.children : [];
    console.log('Top-level reflections:', children.length);
    children.slice(0, 10).forEach((child, index) => {
        console.log(formatChildSummary(toReflectionSummary(child), index));
    });
    logFirstReflectionDetails(children[0]);
    logGroupOverview(project);
};

const logTransformedRoot = (root: DocNode): void => {
    console.log('Root node kind:', root.kind.label);
    console.log('Root node children:', root.children.length);

    const firstChild = root.children.length > 0 ? root.children[0] : null;
    if (!firstChild) {
        return;
    }

    console.log('First child flags:', firstChild.flags);
    console.log('First child sources:', firstChild.sources.slice(0, 1));
};

const main = async (): Promise<void> => {
    const arg = process.argv[2];
    if (arg === '--help' || arg === '-h') {
        console.log(HELP_TEXT);
        return;
    }

    const generatedRoot = resolveGeneratedRoot(arg);
    const manifestPath = resolveManifestPath(generatedRoot);
    const manifestDir = path.dirname(manifestPath);
    const manifestReader = new ManifestReader(generatedRoot ? { rootDir: generatedRoot } : {});
    const manifest = await manifestReader.read();

    console.log('Manifest loaded from:', manifest.outputDir.trim() || '<default>');
    printManifestSummary(manifest.packages);
    const workspaceRoot = findWorkspaceRoot();
    const engine = await DocsEngine.fromManifest(manifest, {
        workspaceRoot,
        manifestDir,
        manifestOutputDir: manifest.outputDir,
        ...(generatedRoot ? { generatedRoot } : {})
    });
    logEngineSummary(engine);
};

main().catch((error: unknown) => {
    console.error('\n❌ temp.ts encountered an error:\n');
    console.error(error);
    process.exitCode = 1;
});
