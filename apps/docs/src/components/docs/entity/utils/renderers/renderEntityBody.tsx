import { renderClassLike } from './renderClassLike';
import { renderEnum } from './renderEnum';
import { renderFunction } from './renderFunction';
import { renderType } from './renderType';
import { renderVariable } from './renderVariable';

import type { EntityModel } from '@lib/docs/entities';
import type { ReactElement } from 'react';

export function renderEntityBody(model: EntityModel): ReactElement | null {
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
