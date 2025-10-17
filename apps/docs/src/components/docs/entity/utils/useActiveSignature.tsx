'use client';

import { useState, useEffect } from 'react';

import type { SignatureSelection } from '../member/MemberCardBody';
import type { EntityMemberSummary } from '../types';

export function useActiveSignature(member: EntityMemberSummary): SignatureSelection {
    const [activeSignatureId, setActiveSignatureId] = useState(() => member.signatures[0]?.id ?? '');

    useEffect(() => {
        const [firstSignature] = member.signatures;
        if (!firstSignature) {
            return;
        }

        setActiveSignatureId((current) => {
            if (current && member.signatures.some((signature) => signature.id === current)) {
                return current;
            }
            return firstSignature.id;
        });
    }, [member.signatures]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const hash = window.location.hash.slice(1);
        if (!hash) {
            return;
        }

        const matchingSignature = member.signatures.find(
            (signature) => signature.anchor === hash || signature.id === hash
        );

        if (matchingSignature) {
            setActiveSignatureId(matchingSignature.id);
        }
    }, [member.signatures]);

    return [activeSignatureId, setActiveSignatureId];
}
