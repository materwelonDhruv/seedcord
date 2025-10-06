'use client';

import { useEffect } from 'react';

import { log } from '@lib/logger';

import { EntityFooter, EntityHeader } from './entity-header';
import EntityMembersSection from './entity-members-section';
import { useEntityTone } from './use-entity-tone';

import type { ReactElement } from 'react';

const PROPERTY_SUMMARIES = [
    {
        id: 'options',
        label: 'options',
        description: 'Resolved ClientOptions exposed after the framework boots.',
        signature: 'readonly options: ClientOptions',
        documentation: 'Provides the fully merged ClientOptions object backing this Client instance.',
        tags: ['readonly'],
        inheritedFrom: 'BaseClient.options'
    },
    {
        id: 'services',
        label: 'services',
        description: 'Lazy service container registry bound to the current client instance.',
        signature: 'readonly services: ServiceContainer',
        documentation:
            'Service container exposed for retrieving modules registered during bootstrap and plugin resolution.',
        tags: ['readonly']
    },
    {
        id: 'status',
        label: 'status',
        description: 'Connection status helper describing the current Discord gateway state.',
        signature: 'status: GatewayStatus',
        documentation: 'Represents the current Discord gateway lifecycle phase for this client.'
    },
    {
        id: 'user',
        label: 'user',
        description: 'The currently authenticated bot user, if connected.',
        signature: 'readonly user: User | null',
        documentation:
            'The currently authenticated bot user, or null if the client is not yet connected to the gateway.',
        tags: ['readonly', 'nullable']
    }
] as const;

const METHOD_SUMMARIES = [
    {
        id: 'connect',
        label: 'connect()',
        description: 'Bootstraps the WebSocket session and hydrates the Client runtime.',
        signature: 'connect(options?: ConnectOptions): Promise<void>',
        documentation:
            'Initializes the gateway connection, logs in with the provided token, and prepares background workers.',
        tags: ['async']
    },
    {
        id: 'use',
        label: 'use()',
        description: 'Registers plugins that will run inside the Seedcord lifecycle.',
        signature: 'use<TPlugin extends Plugin>(plugin: TPlugin): this',
        documentation:
            'Adds a plugin to the current client, wiring it into dependency injection and lifecycle callbacks.'
    },
    {
        id: 'disconnect',
        label: 'disconnect()',
        description: 'Gracefully tears down network resources and background tasks.',
        signature: 'disconnect(reason?: string): Promise<void>',
        documentation:
            'Closes the gateway session and stops any scheduled jobs or inflight tasks initiated by the client.',
        tags: ['async']
    }
] as const;

export interface EntityContentProps {
    kind: string;
    pkg: string;
    signature: string;
    signatureHtml: string | null;
    symbolName: string;
}

export default function EntityContent({
    kind,
    pkg,
    signature,
    signatureHtml,
    symbolName
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
            />
            <EntityMembersSection properties={PROPERTY_SUMMARIES} methods={METHOD_SUMMARIES} />
            <EntityFooter tone={tone} />
        </article>
    );
}
