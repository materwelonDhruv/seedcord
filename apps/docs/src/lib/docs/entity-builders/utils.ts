import { createPlainParagraph, cloneCommentParagraphs } from '../commentFormatting';
import { formatDeclarationHeader, formatSignature, highlightCode } from '../formatting';

import type { CommentExample, FormatContext, CodeRepresentation, CommentParagraph, FormattedComment } from '../types';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { DocNode, DocSignature } from '@seedcord/docs-engine';

export const FALLBACK_DESCRIPTION = 'Documentation will be sourced from TypeDoc soon.';

export const cloneExamples = (examples: readonly CommentExample[] | null | undefined): CommentExample[] =>
    examples?.length ? [...examples] : [];

export const ensureSlug = (node: DocNode): string =>
    typeof node.slug === 'string' && node.slug.length > 0 ? node.slug : String(node.id);

export const ensureSignatureAnchor = (signature: DocSignature): string =>
    typeof signature.anchor === 'string' && signature.anchor.length > 0
        ? signature.anchor
        : `${signature.name}-${signature.overloadIndex}`;

export async function resolveHeaderSignature(node: DocNode, context: FormatContext): Promise<CodeRepresentation> {
    if (node.header) {
        return formatDeclarationHeader(node.header, context);
    }

    const rendered = node.signatures[0]?.render;
    if (rendered) {
        return formatSignature(rendered, context);
    }

    return highlightCode(node.headerText ?? node.name);
}

export function normalizeAccessor(accessor?: string | null): EntityMemberSummary['accessorType'] {
    if (!accessor) {
        return undefined;
    }

    if (accessor === 'getter' || accessor === 'setter') {
        return accessor;
    }

    return 'accessor';
}

export function collectMemberTags(node: DocNode): string[] {
    const tags = new Set<string>();
    const { flags } = node;

    if (flags.isStatic) tags.add('static');
    if (flags.isReadonly) tags.add('readonly');
    if (flags.isAbstract) tags.add('abstract');
    if (flags.isOptional) tags.add('optional');
    if (flags.isDeprecated) tags.add('deprecated');

    return Array.from(tags);
}

interface DescriptionSelection {
    description: CommentParagraph;
    signatureIndex: number | null;
}

export function selectDescription(
    signatureComments: (FormattedComment | undefined)[],
    nodeComment: FormattedComment
): DescriptionSelection {
    for (let index = 0; index < signatureComments.length; index += 1) {
        const comment = signatureComments[index];
        if (!comment) {
            continue;
        }

        const [firstParagraph] = comment.paragraphs;
        if (firstParagraph) {
            return { description: firstParagraph, signatureIndex: index };
        }
    }

    const [firstParagraph] = nodeComment.paragraphs;
    if (firstParagraph) {
        return { description: firstParagraph, signatureIndex: null };
    }

    return { description: createPlainParagraph(FALLBACK_DESCRIPTION), signatureIndex: null };
}

export function stripDuplicateDescription(
    paragraphs: readonly CommentParagraph[],
    description: CommentParagraph
): CommentParagraph[] {
    if (paragraphs.length && paragraphs[0] === description) {
        return paragraphs.slice(1);
    }

    return cloneCommentParagraphs(paragraphs);
}

export function deriveSharedDocumentation(
    nodeComment: FormattedComment,
    description: CommentParagraph,
    descriptionSignatureIndex: number | null
): CommentParagraph[] {
    if (descriptionSignatureIndex !== null) {
        return cloneCommentParagraphs(nodeComment.paragraphs);
    }

    return stripDuplicateDescription(nodeComment.paragraphs, description);
}
