import path from 'node:path';

const GENERATED_RELATIVE_PATH = '../../../../../packages/api-docs/generated';

export const MANIFEST_FILENAME = 'manifest.json';
export const DEFAULT_GENERATED_DIR = path.resolve(__dirname, GENERATED_RELATIVE_PATH);

export const resolveGeneratedDir = (rootDir?: string): string => {
    return rootDir ?? DEFAULT_GENERATED_DIR;
};

export const resolveManifestPath = (rootDir?: string, manifestPath?: string): string => {
    if (manifestPath) {
        return manifestPath;
    }

    return path.join(resolveGeneratedDir(rootDir), MANIFEST_FILENAME);
};
