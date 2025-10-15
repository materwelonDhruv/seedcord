import EntityContent from '@components/docs/entity/entity-content';
import { buildPlaceholderMembers } from '@lib/placeholder-members';
import { highlightToHtml } from '@lib/shiki';

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

    const signature = `class ${symbolName} extends [SeedcordBase](https://github.com/materwelondhruv/seedcord/blob/main/packages/core/src/seedcord-base.ts) { /* TODO: insert generated signature and a bunch of random text to test if the content spills over for testing scrollbar. */ }`;
    // const signature = `class ${symbolName} extends SeedcordBase { /* TODO: insert generated signature */ }`;
    const signatureHtml = await highlightToHtml(signature, 'ts');
    const members = await buildPlaceholderMembers(symbolName);
    const sourceUrl = `https://github.com/materwelondhruv/seedcord/blob/main/packages/core/src/${symbolName.toLowerCase()}.ts`;

    return (
        <EntityContent
            kind={kind}
            pkg={pkg}
            signature={signature}
            signatureHtml={signatureHtml}
            symbolName={symbolName}
            members={members}
            sourceUrl={sourceUrl}
        />
    );
}
