import type { FunctionSignatureModel } from '@/lib/docs/types';

import { cn } from '@lib/utils';

import { SignatureCard } from '../signatures/SignatureCard';

import type { ReactElement } from 'react';

interface FunctionSignaturesSectionProps {
    signatures: readonly FunctionSignatureModel[];
}

export function FunctionSignaturesSection({ signatures }: FunctionSignaturesSectionProps): ReactElement | null {
    if (!signatures.length) {
        return null;
    }

    return (
        <section className="space-y-4">
            <header className="space-y-1">
                <h2 className="text-xl font-semibold text-[color-mix(in_srgb,var(--entity-function-color)_72%,var(--text))]">
                    {signatures.length === 1 ? 'Function Signature' : 'Function Signatures'}
                </h2>
            </header>
            <div className={cn('grid gap-4', signatures.length > 1 ? 'lg:grid-cols-2' : undefined)}>
                {signatures.map((signature) => (
                    <SignatureCard key={signature.id} signature={signature} />
                ))}
            </div>
        </section>
    );
}
