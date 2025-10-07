import { buildCollection, type ResolveOptions } from './builders/collection-builder';

import type { GlobalId } from './ids';
import type { DocCollection, DocManifest, DocNode, DocPackageModel, DocReference, DocSearchEntry } from './types';

export class DocsEngine {
    private readonly searchIndex: DocSearchEntry[];

    private constructor(private readonly collection: DocCollection) {
        this.searchIndex = aggregateSearchIndex(collection);
    }

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

    getNodeByQualifiedName(pkgName: string, qualifiedName: string): DocNode | null {
        const pkg = this.getPackage(pkgName);
        if (!pkg) {
            return null;
        }

        return pkg.indexes.byQName.get(qualifiedName) ?? null;
    }

    getNodeByKey(key: GlobalId): DocNode | null {
        return this.collection.byKey.get(key) ?? null;
    }

    getNodeByGlobalSlug(packageName: string, slug: string): DocNode | null {
        const key = `${packageName}:${slug}`;
        return this.collection.byGlobalSlug.get(key) ?? null;
    }

    search(query: string, pkgName?: string): DocSearchEntry[] {
        const tokens = tokenizeQuery(query);
        if (tokens.length === 0) {
            return [];
        }

        const source = pkgName ? (this.getPackage(pkgName)?.indexes.search ?? []) : this.searchIndex;

        const score = (entry: DocSearchEntry): number => {
            let value = 0;
            for (const token of tokens) {
                if (safeEquals(entry.name, token)) {
                    value += SCORE_NAME_EXACT;
                }

                if (safeEquals(entry.qualifiedName, token)) {
                    value += SCORE_QNAME_EXACT;
                }

                if (entry.tokens.includes(token)) {
                    value += SCORE_TOKEN_MATCH;
                }

                if (entry.tokens.some((candidate) => candidate.startsWith(token))) {
                    value += SCORE_TOKEN_PREFIX;
                }

                if (entry.aliases?.some((alias) => safeEquals(alias, token))) {
                    value += SCORE_ALIAS_EXACT;
                }

                if (entry.file && safeEquals(entry.file, token)) {
                    value += SCORE_FILE_EXACT;
                }

                if (safeEquals(entry.packageName, token) || safeEquals(entry.packageVersion, token)) {
                    value += SCORE_PACKAGE_MATCH;
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

        if (reference.targetKey) {
            const targetNode = this.getNodeByKey(reference.targetKey);
            if (targetNode) {
                return { packageName: targetNode.packageName, slug: targetNode.slug };
            }
        }

        const packageOrder = orderedPackageCandidates(currentPackage, reference.packageName, this.listPackages());

        for (const pkgName of packageOrder) {
            const pkg = this.getPackage(pkgName);
            if (!pkg) {
                continue;
            }

            const resolved = resolveWithinPackage(reference, pkg);
            if (resolved) {
                return { packageName: pkg.manifest.name, slug: resolved.slug };
            }
        }

        if (reference.qualifiedName) {
            const node = findByQualifiedName(this.collection.packages, reference.qualifiedName);
            if (node) {
                return { packageName: node.packageName, slug: node.slug };
            }
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
const SCORE_QNAME_EXACT = 10;
const SCORE_TOKEN_MATCH = 4;
const SCORE_TOKEN_PREFIX = 2;
const SCORE_ALIAS_EXACT = 9;
const SCORE_FILE_EXACT = 5;
const SCORE_PACKAGE_MATCH = 3;

const collator = new Intl.Collator(undefined, { sensitivity: 'accent', usage: 'search' });

const safeEquals = (value: string | undefined, token: string): boolean =>
    typeof value === 'string' && value.length > 0 && collator.compare(value.toLowerCase(), token) === 0;

const aggregateSearchIndex = (collection: DocCollection): DocSearchEntry[] =>
    collection.packages.flatMap((pkg) => pkg.indexes.search);

const orderedPackageCandidates = (
    currentPackage: string,
    hintedPackage: string | undefined,
    available: string[]
): string[] => {
    const ordered = new Set<string>();

    if (hintedPackage) {
        ordered.add(hintedPackage);
    }

    if (currentPackage) {
        ordered.add(currentPackage);
    }

    for (const name of available) {
        ordered.add(name);
    }

    return Array.from(ordered);
};

const resolveWithinPackage = (reference: DocReference, pkg: DocPackageModel): DocNode | null => {
    if (reference.qualifiedName) {
        const byQName = pkg.indexes.byQName.get(reference.qualifiedName);
        if (byQName) {
            return byQName;
        }
    }

    for (const node of pkg.indexes.byQName.values()) {
        if (node.qualifiedName === reference.name) return node;
    }

    return null;
};

const findByQualifiedName = (packages: DocPackageModel[], qualifiedName: string): DocNode | null => {
    for (const pkg of packages) {
        const node = pkg.indexes.byQName.get(qualifiedName);
        if (node) {
            return node;
        }
    }

    return null;
};
