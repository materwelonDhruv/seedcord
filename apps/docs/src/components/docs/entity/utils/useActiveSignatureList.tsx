'use client';

import { useState, useEffect } from 'react';

export function useActiveSignatureList(
    signatures: { id: string; anchor?: string }[]
): readonly [string, (id: string) => void] {
    const [activeSignatureId, setActiveSignatureId] = useState(() => signatures[0]?.id ?? '');

    useEffect(() => {
        const [firstSignature] = signatures;
        if (!firstSignature) return;

        setActiveSignatureId((current) => {
            if (current && signatures.some((s) => s.id === current)) return current;
            return firstSignature.id;
        });
    }, [signatures]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        const matching = signatures.find((s) => s.id === hash || s.anchor === hash);
        if (matching) setActiveSignatureId(matching.id);
    }, [signatures]);

    return [activeSignatureId, setActiveSignatureId] as const;
}
