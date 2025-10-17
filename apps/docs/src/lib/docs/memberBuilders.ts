import { createPlainParagraph, formatCommentRich } from './commentFormatting';
import { formatDeclarationHeader, formatSignature, highlightCode, renderInlineType } from './formatting';
import { resolveReferenceHref } from './resolveReferenceHref';

import type { CommentParagraph, CommentExample, FormatContext, CodeRepresentation, FormattedComment } from './types';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { DocNode, DocSignature, RenderedDeclarationHeader } from '@seedcord/docs-engine';

export const FALLBACK_DESCRIPTION = 'Documentation will be sourced from TypeDoc soon.';

const cloneParagraphs = (paragraphs: CommentParagraph[]): CommentParagraph[] => paragraphs.slice();

const cloneExamples = (examples: CommentExample[]): CommentExample[] => examples.slice();

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

function normalizeAccessor(accessor?: string | null): EntityMemberSummary['accessorType'] {
    if (!accessor) {
        return undefined;
    }

    if (accessor === 'getter' || accessor === 'setter') {
        return accessor;
    }

    return 'accessor';
}

function collectMemberTags(node: DocNode): string[] {
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

function selectDescription(
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

function stripDuplicateDescription(paragraphs: CommentParagraph[], description: CommentParagraph): CommentParagraph[] {
    if (paragraphs.length && paragraphs[0] === description) {
        return paragraphs.slice(1);
    }

    return cloneParagraphs(paragraphs);
}

function deriveSharedDocumentation(
    nodeComment: FormattedComment,
    description: CommentParagraph,
    descriptionSignatureIndex: number | null
): CommentParagraph[] {
    if (descriptionSignatureIndex !== null) {
        return cloneParagraphs(nodeComment.paragraphs);
    }

    return stripDuplicateDescription(nodeComment.paragraphs, description);
}

interface SignatureDetailsOptions {
    node: DocNode;
    context: FormatContext;
    signatureComments: (FormattedComment | undefined)[];
    description: CommentParagraph;
    descriptionSignatureIndex: number | null;
    headerSignature: CodeRepresentation;
}

async function buildSignatureDetails({
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

    return Promise.all(
        node.signatures.map(async (signature, index) => {
            const code = signature.render
                ? await formatSignature(signature.render, context)
                : await highlightCode(signature.name);

            const comment = signatureComments[index];
            const documentation = cloneParagraphs(comment?.paragraphs ?? []);
            const examples = cloneExamples(comment?.examples ?? []);

            const detail: EntityMemberSummary['signatures'][number] = {
                id: ensureSignatureAnchor(signature),
                anchor: ensureSignatureAnchor(signature),
                code,
                documentation,
                examples
            };

            if (descriptionSignatureIndex === index) {
                detail.documentation = stripDuplicateDescription(detail.documentation, description);
            }

            const signatureSourceUrl = signature.sourceUrl ?? node.sourceUrl;
            if (signatureSourceUrl) {
                detail.sourceUrl = signatureSourceUrl;
            }

            return detail;
        })
    );
}

export async function buildTypeParameterSummaries(
    header: RenderedDeclarationHeader | undefined,
    context: FormatContext
): Promise<EntityMemberSummary[]> {
    const params = header?.typeParams ?? [];
    if (!params.length) {
        return [];
    }

    return Promise.all(
        params.map(async (param) => {
            const segments: string[] = [param.name];

            if (param.constraint) {
                segments.push(`extends ${renderInlineType(param.constraint, context)}`);
            }

            if (param.default) {
                segments.push(`= ${renderInlineType(param.default, context)}`);
            }

            const code = await highlightCode(segments.join(' '));
            const documentation: CommentParagraph[] = [];
            const examples: CommentExample[] = [];

            return {
                id: `type-${param.name}`,
                label: param.name,
                description: createPlainParagraph('Type parameter.'),
                sharedDocumentation: documentation,
                sharedExamples: examples,
                signatures: [
                    {
                        id: `type-${param.name}-signature`,
                        anchor: `type-${param.name}`,
                        code,
                        documentation,
                        examples
                    }
                ]
            } satisfies EntityMemberSummary;
        })
    );
}

export async function buildMemberSummary(node: DocNode, context: FormatContext): Promise<EntityMemberSummary> {
    const memberId = ensureSlug(node);
    const headerSignature = await resolveHeaderSignature(node, context);
    const nodeComment = await formatCommentRich(node.comment, context);
    const signatureComments = await Promise.all(node.signatures.map((sig) => formatCommentRich(sig.comment, context)));

    const { description, signatureIndex } = selectDescription(signatureComments, nodeComment);
    const sharedDocumentation = deriveSharedDocumentation(nodeComment, description, signatureIndex);
    const sharedExamples = cloneExamples(nodeComment.examples);
    const signatures = await buildSignatureDetails({
        node,
        context,
        signatureComments,
        description,
        descriptionSignatureIndex: signatureIndex,
        headerSignature
    });

    const summary: EntityMemberSummary = {
        id: memberId,
        label: node.name,
        description,
        sharedDocumentation,
        sharedExamples,
        signatures
    };

    const tags = collectMemberTags(node);
    if (tags.length) summary.tags = tags;
    if (node.flags.access) summary.access = node.flags.access;
    const accessorType = normalizeAccessor(node.flags.accessor);
    if (accessorType) summary.accessorType = accessorType;
    if (node.sourceUrl) summary.sourceUrl = node.sourceUrl;
    if (node.inheritedFrom?.name) {
        const href = resolveReferenceHref(node.inheritedFrom, {
            engine: context.engine,
            currentPackage: context.manifestPackage
        });
        summary.inheritedFrom = href ? { name: node.inheritedFrom.name, href } : node.inheritedFrom.name;
    }

    return summary;
}
