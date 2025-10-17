'use client';

import { useMemo } from 'react';

import type { FunctionEntityModel, FunctionSignatureModel } from '@/lib/docs/types';

import { MemberDetailGroup } from '../member/MemberDetailGroup';
import { useActiveSignatureList } from '../utils/useActiveSignatureList';

import type { EntityMemberSummary } from '../types';
import type { ReactElement } from 'react';

function buildTypeParamMember(
    tp: {
        name: string;
        constraint?: string | undefined;
        default?: string | undefined;
        description?: string | undefined;
    },
    index: number
): EntityMemberSummary {
    const id = `typeparam-${tp.name}-${index}`;
    const codeText = [
        tp.name,
        tp.constraint ? `extends ${tp.constraint}` : undefined,
        tp.default ? `= ${tp.default}` : undefined
    ]
        .filter(Boolean)
        .join(' ');

    return {
        id,
        label: tp.name,
        description: { plain: '', html: '' },
        sharedDocumentation: [],
        sharedExamples: [],
        signatures: [
            {
                id: `${id}-sig`,
                anchor: `${id}-sig`,
                code: { text: codeText, html: null },
                documentation: [],
                examples: []
            }
        ]
    } as unknown as EntityMemberSummary;
}

function buildParamMember(
    p: {
        name: string;
        optional?: boolean | undefined;
        type?: string | undefined;
        defaultValue?: string | undefined;
        documentation?: { plain: string; html: string }[] | undefined;
    },
    index: number
): EntityMemberSummary {
    const id = `param-${p.name}-${index}`;
    const label = p.name + (p.optional ? '?' : '');
    const sigParts: string[] = [];
    if (p.type) sigParts.push(`${label}: ${p.type}`);
    else sigParts.push(label);
    if (p.defaultValue) sigParts.push(`= ${p.defaultValue}`);

    return {
        id,
        label,
        description: { plain: '', html: '' },
        sharedDocumentation: p.documentation ?? [],
        sharedExamples: [],
        signatures: [
            {
                id: `${id}-sig`,
                anchor: `${id}-sig`,
                code: { text: sigParts.join(' '), html: null },
                documentation: [],
                examples: []
            }
        ],
        sourceUrl: undefined
    } as unknown as EntityMemberSummary;
}

export default function FunctionBody({ model }: { model: FunctionEntityModel }): ReactElement | null {
    const signatures = model.signatures;
    if (!signatures.length) return null;

    const mapped = signatures.map((s) => ({ id: s.id, anchor: (s as unknown as { anchor?: string }).anchor }));
    const [activeSignatureId] = useActiveSignatureList(mapped as { id: string; anchor?: string }[]);

    const activeSignature = useMemo(
        () => signatures.find((s) => s.id === activeSignatureId) ?? signatures[0],
        [signatures, activeSignatureId]
    ) as FunctionSignatureModel;

    const rawTypeParams =
        (activeSignature as unknown as { typeParameters?: { name: string; constraint?: string; default?: string }[] })
            .typeParameters ?? [];
    const typeParameterItems: EntityMemberSummary[] = rawTypeParams.map((tp, idx) =>
        buildTypeParamMember(
            {
                name: tp.name,
                constraint: tp.constraint ?? undefined,
                default: tp.default ?? undefined,
                description: undefined
            },
            idx
        )
    );

    const parameterItems: EntityMemberSummary[] = activeSignature.parameters.map((p, idx) =>
        buildParamMember(
            {
                name: p.name,
                optional: p.optional,
                type: p.type ?? undefined,
                defaultValue: p.defaultValue ?? undefined,
                documentation: p.documentation
            },
            idx
        )
    );

    return (
        <section className="space-y-6">
            <div>
                <MemberDetailGroup items={typeParameterItems} prefix="typeParameter" />
            </div>
            <div>
                <MemberDetailGroup items={parameterItems} prefix="property" />
            </div>
        </section>
    );
}
