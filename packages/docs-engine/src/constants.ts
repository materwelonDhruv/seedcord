import path from 'node:path';

const GENERATED_RELATIVE_PATH = '../../../packages/docs-generator/generated';

export const MANIFEST_FILENAME = 'manifest.json';
export const DEFAULT_GENERATED_DIR = path.resolve(import.meta.dirname, GENERATED_RELATIVE_PATH);

const INIT_CWD = process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD) : undefined;

const resolveInputPath = (input: string): string => {
    if (path.isAbsolute(input)) {
        return path.normalize(input);
    }

    const base = INIT_CWD ?? process.cwd();
    return path.normalize(path.resolve(base, input));
};

export const resolveGeneratedDir = (rootDir?: string): string => {
    const envOverride = process.env.SEEDCORD_DOCS_DIR;
    if (typeof envOverride === 'string' && envOverride.trim().length > 0) {
        return resolveInputPath(envOverride.trim());
    }

    if (rootDir) {
        return resolveInputPath(rootDir);
    }

    return DEFAULT_GENERATED_DIR;
};

export const resolveManifestPath = (rootDir?: string, manifestPath?: string): string => {
    if (manifestPath) {
        return resolveInputPath(manifestPath);
    }

    return path.join(resolveGeneratedDir(rootDir), MANIFEST_FILENAME);
};
