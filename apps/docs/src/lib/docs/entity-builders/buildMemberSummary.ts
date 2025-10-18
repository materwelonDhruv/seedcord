import { formatCommentRich } from '../commentFormatting';
import { resolveReferenceHref } from '../resolveReferenceHref';
import { buildSignatureDetails } from './buildSignatureDetails';
import {
    ensureSlug,
    resolveHeaderSignature,
    selectDescription,
    deriveSharedDocumentation,
    cloneExamples,
    collectMemberTags,
    normalizeAccessor
} from './utils';

import type { FormatContext } from '../types';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { DocNode } from '@seedcord/docs-engine';

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
    if (node.flags.access && (node.flags.access === 'public' || node.flags.access === 'protected')) {
        summary.access = node.flags.access;
    }
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
