import EntityContent from '../../../components/docs/entity/entity-content';
import { highlightToHtml } from '../../../lib/shiki';

import type { ReactElement } from 'react';

type SearchParamsRecord = Record<string, string | string[] | undefined>;
type SearchParamsInput = Promise<SearchParamsRecord>;

interface EntityPageProps {
    searchParams?: SearchParamsInput;
}

function resolveParam(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default async function EntityPage({ searchParams }: EntityPageProps): Promise<ReactElement> {
    const resolvedParams: SearchParamsRecord = searchParams ? await searchParams : {};

    const symbolName = resolveParam(resolvedParams.symbol) ?? 'Client';
    const kind = resolveParam(resolvedParams.kind) ?? 'class';
    const pkg = resolveParam(resolvedParams.pkg) ?? '@seedcord/core';

    const signature = `class ${symbolName} extends SeedcordBase { /* TODO: insert generated signature */ }`;
    const signatureHtml = await highlightToHtml(signature, 'ts');

    return (
        <EntityContent
            kind={kind}
            pkg={pkg}
            signature={signature}
            signatureHtml={signatureHtml}
            symbolName={symbolName}
        />
    );
}
