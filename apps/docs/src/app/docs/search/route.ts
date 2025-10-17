import { kindName, type DocSearchEntry } from '@seedcord/docs-engine';
import { NextResponse, type NextRequest } from 'next/server';

import { getDocsEngine } from '@lib/docs/engine';
import { resolveManifestPackageName } from '@lib/docs/packages';
import { buildPackageBasePath } from '@lib/docs/routes';

const MAX_RESULTS = 24;
const MIN_QUERY_LENGTH = 3;

type SearchResultKind =
    | 'class'
    | 'interface'
    | 'type'
    | 'enum'
    | 'function'
    | 'variable'
    | 'method'
    | 'property'
    | 'parameter'
    | 'typeParameter'
    | 'page';

interface CommandActionPayload {
    id: string;
    label: string;
    path: string;
    href: string;
    kind: SearchResultKind;
    description?: string;
}

interface SearchResponse {
    results: CommandActionPayload[];
}

const KIND_TO_RESULT = new Map<string, SearchResultKind>([
    ['class', 'class'],
    ['interface', 'interface'],
    ['enum', 'enum'],
    ['enumMember', 'enum'],
    ['typeAlias', 'type'],
    ['typeParameter', 'typeParameter'],
    ['function', 'function'],
    ['method', 'method'],
    ['constructor', 'method'],
    ['callSignature', 'function'],
    ['constructorSignature', 'method'],
    ['getSignature', 'property'],
    ['setSignature', 'property'],
    ['accessor', 'property'],
    ['property', 'property'],
    ['variable', 'variable'],
    ['parameter', 'parameter']
]);

const getResultKind = (kind: number): SearchResultKind => {
    const key = kindName(kind);
    return KIND_TO_RESULT.get(key) ?? 'page';
};

const encodeSlug = (slug: string): string =>
    slug
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

const buildBreadcrumb = (entry: DocSearchEntry): string => {
    const versionLabel = entry.packageVersion ? `@${entry.packageVersion}` : undefined;
    const qualifiedLabel = entry.qualifiedName && entry.qualifiedName !== entry.name ? entry.qualifiedName : undefined;

    const baseLabel = versionLabel ? `${entry.packageName}${versionLabel}` : entry.packageName;
    const parts = [baseLabel];

    if (qualifiedLabel) {
        parts.push(qualifiedLabel);
    } else {
        parts.push(entry.slug);
    }

    return parts.filter(Boolean).join(' · ');
};

const mapSearchEntry = (entry: DocSearchEntry): CommandActionPayload | null => {
    if (!entry.slug) {
        return null;
    }

    const basePath = buildPackageBasePath(entry.packageName, entry.packageVersion ?? null);
    const slugSegment = encodeSlug(entry.slug);
    const href = `${basePath}/${slugSegment}`;

    const payload: CommandActionPayload = {
        id: `${entry.packageName}:${entry.slug}:${entry.kind}`,
        label: entry.name,
        path: buildBreadcrumb(entry),
        href,
        kind: getResultKind(entry.kind)
    } satisfies CommandActionPayload;

    if (entry.summary) {
        payload.description = entry.summary;
    }

    return payload;
};

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
    const url = request.nextUrl;
    const rawQuery = url.searchParams.get('q') ?? '';
    const query = rawQuery.trim();

    if (query.length < MIN_QUERY_LENGTH) {
        return NextResponse.json({ results: [] });
    }

    const engine = await getDocsEngine();
    const pkgParam = url.searchParams.get('pkg');
    const manifestPackage = pkgParam ? resolveManifestPackageName(engine, pkgParam) : undefined;
    const results = engine.search(query, manifestPackage).slice(0, MAX_RESULTS);

    const payload = results.map(mapSearchEntry).filter((entry): entry is CommandActionPayload => entry !== null);

    return NextResponse.json({ results: payload });
}
