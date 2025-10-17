import { CodePanel } from '@ui/CodePanel';

import { MemberDetailGroup } from '../../member/MemberDetailGroup';

import type { TypeModel } from '../../types';
import type { ReactElement } from 'react';

export function renderType(model: TypeModel): ReactElement {
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
