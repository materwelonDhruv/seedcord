import fs from 'node:fs/promises';

import { resolveManifestPath } from './constants';

import type { DocManifest } from './types';

export interface ManifestReaderOptions {
    rootDir?: string;
    manifestPath?: string;
}

export class ManifestReader {
    private readonly manifestPath: string;

    constructor(options: ManifestReaderOptions = {}) {
        this.manifestPath = resolveManifestPath(options.rootDir, options.manifestPath);
    }

    async read(): Promise<DocManifest> {
        const raw = await fs.readFile(this.manifestPath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<DocManifest>;

        return {
            generatedAt: parsed.generatedAt ?? '',
            tool: parsed.tool ?? '',
            typedocVersion: parsed.typedocVersion ?? '',
            outputDir: parsed.outputDir ?? '',
            packages: Array.isArray(parsed.packages) ? parsed.packages : []
        } satisfies DocManifest;
    }
}
