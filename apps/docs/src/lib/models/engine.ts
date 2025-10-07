import { buildCollection, type ResolveOptions } from './builders/collection-builder';

import type { DocCollection, DocManifest, DocNode, DocPackageModel, DocReference, DocSearchEntry } from './types';

export class DocsEngine {
    private constructor(private readonly collection: DocCollection) {}

    static async fromManifest(manifest: DocManifest, resolve: ResolveOptions): Promise<DocsEngine> {
        const coll = await buildCollection(manifest, resolve);
        return new DocsEngine(coll);
    }

    listPackages(): string[] {
        return this.collection.packages.map((pkg) => pkg.manifest.name);
    }

    getPackage(name: string): DocPackageModel | null {
        return this.collection.packages.find((pkg) => pkg.manifest.name === name) ?? null;
    }

    getNodeBySlug(pkgName: string, slug: string): DocNode | null {
        const pkg = this.getPackage(pkgName);
        if (!pkg) {
            return null;
        }

        return pkg.indexes.bySlug.get(slug) ?? null;
    }

    getNodeByFullName(pkgName: string, fullName: string): DocNode | null {
        const pkg = this.getPackage(pkgName);
        if (!pkg) {
            return null;
        }

        return pkg.indexes.byFullName.get(fullName) ?? null;
    }

    search(query: string, pkgName?: string): DocSearchEntry[] {
        const tokens = tokenizeQuery(query);
        if (tokens.length === 0) {
            return [];
        }

        const source = pkgName ? (this.getPackage(pkgName)?.indexes.search ?? []) : this.collection.indexes.search;

        const score = (entry: DocSearchEntry): number => {
            let value = 0;
            for (const token of tokens) {
                if (safeEquals(entry.name, token)) {
                    value += SCORE_NAME_EXACT;
                }

                if (safeEquals(entry.fullName, token)) {
                    value += SCORE_FULLNAME_EXACT;
                }

                if (entry.tokens.includes(token)) {
                    value += SCORE_TOKEN_MATCH;
                }

                if (entry.tokens.some((candidate) => candidate.startsWith(token))) {
                    value += SCORE_TOKEN_PREFIX;
                }
            }

            return value;
        };

        return source
            .map((entry) => ({ entry, value: score(entry) }))
            .filter(({ value }) => value > 0)
            .sort((a, b) => b.value - a.value)
            .map(({ entry }) => entry);
    }

    resolveReference(
        currentPackage: string,
        reference: DocReference | null
    ): { packageName?: string; slug?: string; externalUrl?: string } {
        if (!reference) {
            return {};
        }

        if (reference.externalUrl) {
            return { externalUrl: reference.externalUrl };
        }

        const packageName = reference.packageName ?? currentPackage;
        const pkg = this.getPackage(packageName);
        if (!pkg) {
            return {};
        }

        if (typeof reference.target === 'number') {
            const target = pkg.indexes.byId.get(reference.target);
            if (target) {
                return { packageName, slug: target.slug };
            }
        }

        if (reference.qualifiedName) {
            const candidate = pkg.indexes.byFullName.get(reference.qualifiedName);
            if (candidate) {
                return { packageName, slug: candidate.slug };
            }
        }

        const fallback = pkg.indexes.byFullName.get(reference.name);
        if (fallback) {
            return { packageName, slug: fallback.slug };
        }

        return {};
    }
}

const tokenizeQuery = (query: string): string[] =>
    query
        .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
        .split(/[^a-zA-Z0-9]+/gu)
        .filter(Boolean)
        .map((token) => token.toLowerCase());

const SCORE_NAME_EXACT = 8;
const SCORE_FULLNAME_EXACT = 10;
const SCORE_TOKEN_MATCH = 4;
const SCORE_TOKEN_PREFIX = 2;

const collator = new Intl.Collator(undefined, { sensitivity: 'accent', usage: 'search' });

const safeEquals = (value: string, token: string): boolean => collator.compare(value.toLowerCase(), token) === 0;
