/* eslint-disable max-lines-per-function */
import { highlightToHtml } from '@lib/shiki';

import type { EntityMembersByKind } from '@components/docs/entity/member-types';

const SOURCE_ROOT = 'https://github.com/materwelondhruv/seedcord/blob/main/packages/core/src';

export async function buildPlaceholderMembers(symbolName: string): Promise<EntityMembersByKind> {
    const anchor = symbolName.toLowerCase();

    const [optionsHtml, statusHtml, connectHtml, disconnectHtml, destroyHtml, typeParamHtml] = await Promise.all([
        highlightToHtml('readonly options: ClientOptions', 'ts'),
        highlightToHtml('status: ClientStatus', 'ts'),
        highlightToHtml('async connect(options?: ConnectOptions): Promise<void>', 'ts'),
        highlightToHtml('disconnect(reason?: string): Promise<void>', 'ts'),
        highlightToHtml('destroy(): Promise<void>', 'ts'),
        highlightToHtml('<TEvents extends Record<string, unknown> = Record<string, unknown>>', 'ts')
    ]);

    return {
        properties: [
            {
                id: 'options',
                label: 'options',
                description: 'Resolved configuration applied to the client after boot.',
                signature: 'readonly options: ClientOptions',
                signatureHtml: optionsHtml,
                documentation: 'This property exposes the normalized ClientOptions that power the runtime.',
                access: 'public',
                tags: ['readonly'] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L48`
            },
            {
                id: 'status',
                label: 'status',
                description: 'Tracks the current lifecycle status for the client instance.',
                signature: 'status: ClientStatus',
                signatureHtml: statusHtml,
                documentation: 'Used internally to guard operations that depend on connection state.',
                access: 'protected',
                tags: [] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L62`
            }
        ],
        methods: [
            {
                id: 'connect',
                label: 'connect',
                description: 'Establishes the websocket session with Discord.',
                signature: 'async connect(options?: ConnectOptions): Promise<void>',
                signatureHtml: connectHtml,
                documentation: 'Either resumes a previous session or performs a clean login.',
                access: 'public',
                tags: ['async'] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L104`
            },
            {
                id: 'disconnect',
                label: 'disconnect',
                description: 'Shuts down the websocket session and releases resources.',
                signature: 'disconnect(reason?: string): Promise<void>',
                signatureHtml: disconnectHtml,
                documentation: 'Ensures coordinated cleanup across plugins and services.',
                access: 'public',
                tags: [] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L142`
            },
            {
                id: 'destroy',
                label: 'destroy',
                description: 'Alias for Client#disconnect().',
                signature: 'destroy(): Promise<void>',
                signatureHtml: destroyHtml,
                documentation:
                    'Provided as a more semantically meaningful way to indicate permanent shutdown of the client.',
                access: 'public',
                tags: [] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L178`
            }
        ],
        typeParameters: [
            {
                id: 'events',
                label: 'TEvents',
                description: 'Shape describing the event payloads emitted by the client.',
                signature: '<TEvents extends Record<string, unknown> = Record<string, unknown>>',
                signatureHtml: typeParamHtml,
                documentation: 'Override this generic to unlock typed events when building plugins.',
                tags: [] as const,
                sourceUrl: `${SOURCE_ROOT}/${anchor}.ts#L24`
            }
        ]
    } satisfies EntityMembersByKind;
}
