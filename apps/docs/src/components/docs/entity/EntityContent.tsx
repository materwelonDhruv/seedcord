'use client';

import { useEffect, type ReactElement } from 'react';

import type { EntityModel, FunctionEntityModel } from '@/lib/docs/types';

import { log } from '@lib/logger';

import { MEMBERS_PLACEHOLDER } from './constants';
import { EntityHeader } from './EntityHeader';
import { renderEntityBody } from './utils/renderers/renderEntityBody';
import { useEntityTone } from './utils/useEntityTone';

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
    let functionSignatures: FunctionEntityModel['signatures'] | undefined = undefined;
    if (model.kind === 'function') {
        functionSignatures = model.signatures;
    }

    return (
        <article className="min-w-0 w-full space-y-6 lg:space-y-8">
            <EntityHeader
                badgeLabel={badgeLabel}
                pkg={model.displayPackage}
                signature={model.signature}
                summary={model.summary}
                summaryExamples={model.summaryExamples}
                symbolName={model.name}
                tone={tone}
                sourceUrl={model.sourceUrl ?? null}
                {...(model.version ? { version: model.version } : {})}
                deprecationStatus={model.deprecationStatus}
                {...(functionSignatures ? { functionSignatures } : {})}
            />
            {body ?? MEMBERS_PLACEHOLDER}
        </article>
    );
}
