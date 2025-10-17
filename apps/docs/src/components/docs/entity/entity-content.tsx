'use client';

import { Fragment, useEffect, type ReactElement } from 'react';

import { log } from '@lib/logger';

import { CodePanel } from './code-panel';
import { EntityHeader } from './entity-header';
import { MemberDetailGroup } from './entity-member-components';
import EntityMembersSection from './entity-members-section';
import { EnumMembersSection } from './enum-members-section';
import { FunctionSignaturesSection } from './function-signatures-section';
import { useEntityTone } from './use-entity-tone';

import type { EntityModel } from '@lib/docs/entities';

const MEMBERS_PLACEHOLDER = (
    <p className="text-sm text-subtle">
        TypeDoc metadata for this symbol is empty in the debugging manifest. Check back after the next extraction run.
    </p>
);

type ClassLikeModel = Extract<EntityModel, { kind: 'class' | 'interface' }>;
type EnumModel = Extract<EntityModel, { kind: 'enum' }>;
type TypeModel = Extract<EntityModel, { kind: 'type' }>;
type FunctionModel = Extract<EntityModel, { kind: 'function' }>;
type VariableModel = Extract<EntityModel, { kind: 'variable' }>;

function renderClassLike(model: ClassLikeModel): ReactElement {
    const showAccessControls = model.kind === 'class';
    const hasMembers = model.properties.length > 0 || model.methods.length > 0 || model.typeParameters.length > 0;

    return (
        <Fragment>
            {hasMembers ? (
                <EntityMembersSection
                    properties={model.properties}
                    methods={model.methods}
                    typeParameters={model.typeParameters}
                    showAccessControls={showAccessControls}
                />
            ) : (
                MEMBERS_PLACEHOLDER
            )}
        </Fragment>
    );
}

function renderEnum(model: EnumModel): ReactElement {
    return <EnumMembersSection members={model.members} />;
}

function renderType(model: TypeModel): ReactElement {
    return (
        <div className="space-y-6">
            <CodePanel
                representation={model.declaration}
                title="Type declaration"
                description="The rendered declaration mirrors the output from the docs-engine debugging artifacts."
            />
            {model.typeParameters.length ? (
                <MemberDetailGroup items={model.typeParameters} prefix="typeParameter" />
            ) : null}
        </div>
    );
}

function renderFunction(model: FunctionModel): ReactElement {
    return <FunctionSignaturesSection signatures={model.signatures} />;
}

function renderVariable(model: VariableModel): ReactElement {
    return (
        <CodePanel
            representation={model.declaration}
            title="Variable declaration"
            description="Sourced directly from the debugging manifest so you can inspect runtime defaults without leaving the docs."
        />
    );
}

function renderEntityBody(model: EntityModel): ReactElement | null {
    switch (model.kind) {
        case 'class':
        case 'interface':
            return renderClassLike(model);
        case 'enum':
            return renderEnum(model);
        case 'type':
            return renderType(model);
        case 'function':
            return renderFunction(model);
        case 'variable':
            return renderVariable(model);
        default:
            return null;
    }
}

export interface EntityContentProps {
    model: EntityModel;
}

export default function EntityContent({ model }: EntityContentProps): ReactElement {
    const { tone, badgeLabel } = useEntityTone(model.kind, model.name);

    useEffect(() => {
        log('Entity page mounted', {
            symbolName: model.name,
            kind: model.kind,
            pkg: model.displayPackage,
            tone
        });
    }, [model.name, model.kind, model.displayPackage, tone]);

    const body = renderEntityBody(model);

    return (
        <article className="min-w-0 w-full space-y-6 lg:space-y-8">
            <EntityHeader
                badgeLabel={badgeLabel}
                pkg={model.displayPackage}
                signature={model.signature}
                summary={model.summary}
                symbolName={model.name}
                tone={tone}
                sourceUrl={model.sourceUrl ?? null}
                {...(model.version ? { version: model.version } : {})}
                isDeprecated={model.isDeprecated}
            />
            {body ?? MEMBERS_PLACEHOLDER}
        </article>
    );
}
