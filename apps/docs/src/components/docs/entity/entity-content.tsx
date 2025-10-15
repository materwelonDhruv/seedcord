'use client';

import { useEffect } from 'react';

import { log } from '@lib/logger';

import { EntityHeader } from './entity-header';
import EntityMembersSection from './entity-members-section';
import { useEntityTone } from './use-entity-tone';

import type { EntityMemberSummary, EntityMembersByKind } from './member-types';
import type { ReactElement } from 'react';

export interface EntityContentProps {
    kind: string;
    pkg: string;
    signature: string;
    signatureHtml: string | null;
    symbolName: string;
    sourceUrl?: string;
    members?: EntityMembersByKind | null;
}

export default function EntityContent({
    kind,
    pkg,
    signature,
    signatureHtml,
    symbolName,
    sourceUrl,
    members
}: EntityContentProps): ReactElement {
    const { tone, badgeLabel } = useEntityTone(kind, symbolName);
    const properties = members?.properties ?? [];
    const methods = members?.methods ?? [];
    const typeParameters: readonly EntityMemberSummary[] = members?.typeParameters ?? [];
    const showAccessControls = kind.toLowerCase() === 'class';

    useEffect(() => {
        log('Entity page mounted', { symbolName, kind, pkg, tone });
    }, [symbolName, kind, pkg, tone]);

    return (
        <article className="min-w-0 w-full space-y-6 lg:space-y-8">
            <EntityHeader
                badgeLabel={badgeLabel}
                pkg={pkg}
                signature={signature}
                signatureHtml={signatureHtml}
                symbolName={symbolName}
                tone={tone}
                sourceUrl={sourceUrl ?? null}
            />
            <EntityMembersSection
                properties={properties}
                methods={methods}
                typeParameters={typeParameters}
                showAccessControls={showAccessControls}
            />
        </article>
    );
}
