'use client';

import { useEffect } from 'react';

import { log } from '@lib/logger';

import { EntityFooter, EntityHeader } from './entity-header';
import EntityMembersSection from './entity-members-section';
import { useEntityTone } from './use-entity-tone';

import type { EntityMembersByKind } from './member-types';
import type { ReactElement } from 'react';

export interface EntityContentProps {
    kind: string;
    pkg: string;
    signature: string;
    signatureHtml: string | null;
    symbolName: string;
    sourceUrl?: string;
    members: EntityMembersByKind;
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

    useEffect(() => {
        log('Entity page mounted', { symbolName, kind, pkg, tone });
    }, [symbolName, kind, pkg, tone]);

    return (
        <article className="space-y-8">
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
                properties={members.properties}
                methods={members.methods}
                typeParameters={members.typeParameters ?? []}
            />
            <EntityFooter tone={tone} />
        </article>
    );
}
