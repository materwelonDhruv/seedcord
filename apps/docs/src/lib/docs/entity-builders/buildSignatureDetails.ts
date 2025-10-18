import { cloneCommentParagraphs } from '../commentFormatting';
import { formatSignature, highlightCode } from '../formatting';
import { ensureSlug, stripDuplicateDescription, cloneExamples, ensureSignatureAnchor } from './utils';

import type { CodeRepresentation, CommentExample, CommentParagraph, FormatContext, FormattedComment } from '../types';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { DocNode } from '@seedcord/docs-engine';

interface SignatureDetailsOptions {
    node: DocNode;
    context: FormatContext;
    signatureComments: (FormattedComment | undefined)[];
    description: CommentParagraph;
    descriptionSignatureIndex: number | null;
    headerSignature: CodeRepresentation;
}

export async function buildSignatureDetails({
    node,
    context,
    signatureComments,
    description,
    descriptionSignatureIndex,
    headerSignature
}: SignatureDetailsOptions): Promise<EntityMemberSummary['signatures']> {
    if (node.signatures.length === 0) {
        const documentation: CommentParagraph[] = [];
        const examples: CommentExample[] = [];
        const anchor = ensureSlug(node);
        const fallbackDetail: EntityMemberSummary['signatures'][number] = {
            id: `${anchor}-signature`,
            anchor,
            code: headerSignature,
            documentation,
            examples
        };

        if (node.sourceUrl) {
            fallbackDetail.sourceUrl = node.sourceUrl;
        }

        return [fallbackDetail];
    }

    function buildModifierPrefix(node: DocNode, signature?: { kindLabel?: string }): string {
        const flags = node.flags;
        const parts: string[] = [];

        const access = flags.access as string | undefined;
        if (access) parts.push(access);

        if (flags.isAbstract === true) parts.push('abstract');
        if (flags.isStatic === true) parts.push('static');
        if (flags.isReadonly === true) parts.push('readonly');
        if (flags.isAsync === true) parts.push('async');

        let accessorToken: string | undefined;
        if (signature && typeof signature.kindLabel === 'string') {
            const kl = signature.kindLabel.toLowerCase();
            if (kl.includes('get')) accessorToken = 'get';
            if (kl.includes('set')) accessorToken = 'set';
        }

        if (!accessorToken) {
            const accessor = flags.accessor as string | undefined;
            if (accessor === 'getter') accessorToken = 'get';
            if (accessor === 'setter') accessorToken = 'set';
        }

        if (accessorToken) parts.push(accessorToken);

        return parts.join(' ');
    }

    return Promise.all(
        node.signatures.map(async (signature, index) => {
            const baseCode = signature.render
                ? await formatSignature(signature.render, context)
                : await highlightCode(signature.name);

            const modifierPrefix = buildModifierPrefix(node, { kindLabel: signature.kindLabel });
            const code = modifierPrefix ? await highlightCode(`${modifierPrefix} ${baseCode.text}`) : baseCode;

            const comment = signatureComments[index];
            let documentation = cloneCommentParagraphs(comment?.paragraphs);
            if (descriptionSignatureIndex === index) {
                documentation = stripDuplicateDescription(documentation, description);
            }

            const examples = cloneExamples(comment?.examples ?? []);

            const detail: EntityMemberSummary['signatures'][number] = {
                id: ensureSignatureAnchor(signature),
                anchor: ensureSignatureAnchor(signature),
                code,
                documentation,
                examples
            };

            const signatureSourceUrl = signature.sourceUrl ?? node.sourceUrl;
            if (signatureSourceUrl) {
                detail.sourceUrl = signatureSourceUrl;
            }

            return detail;
        })
    );
}
