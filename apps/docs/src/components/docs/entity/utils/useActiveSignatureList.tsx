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

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onHashChange = (): void => {
            const hash = window.location.hash.slice(1);
            if (!hash) return;
            const matching = signatures.find((s) => s.id === hash || s.anchor === hash);
            if (matching) setActiveSignatureId(matching.id);
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [signatures]);

    const setActive = (id: string): void => {
        setActiveSignatureId(id);
        if (typeof window !== 'undefined') {
            try {
                window.location.hash = id;
            } catch {
                // ignore
            }
        }
    };

    return [activeSignatureId, setActive] as const;
}
