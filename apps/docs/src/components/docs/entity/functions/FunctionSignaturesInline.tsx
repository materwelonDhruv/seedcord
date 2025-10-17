import type { FunctionSignatureModel } from '@/lib/docs/types';

import SignatureSelector from '../signatures/SignatureSelector';
import { useActiveSignatureList } from '../utils/useActiveSignatureList';

import type { ReactElement } from 'react';

export default function FunctionSignaturesInline({
    signatures
}: {
    signatures: readonly FunctionSignatureModel[];
}): ReactElement | null {
    if (!signatures.length) return null;

    const mapped = signatures.map((s) => ({ id: s.id, anchor: (s as unknown as { anchor?: string }).anchor }));
    const [activeSignatureId, setActiveSignatureId] = useActiveSignatureList(
        mapped as { id: string; anchor?: string }[]
    );
    return (
        <div>
            <SignatureSelector
                signatures={signatures}
                activeSignatureId={activeSignatureId}
                onChange={setActiveSignatureId}
                legend={signatures.length === 1 ? 'Signature' : 'Overloads'}
            />
        </div>
    );
}
