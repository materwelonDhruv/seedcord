import { FunctionSignaturesSection } from '../../functions/FunctionSignaturesSection';

import type { FunctionModel } from '../../types';
import type { ReactElement } from 'react';

export function renderFunction(model: FunctionModel): ReactElement {
    return <FunctionSignaturesSection signatures={model.signatures} />;
}
