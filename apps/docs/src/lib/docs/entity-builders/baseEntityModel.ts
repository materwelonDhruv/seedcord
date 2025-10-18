import { ensureSlug } from './utils';

import type { EntityKind, CommentParagraph, CommentExample, CodeRepresentation, BaseEntityModel } from '../types';
import type { DocNode } from '@seedcord/docs-engine';

export function createBaseEntityModel({
    node,
    kind,
    manifestPackage,
    displayPackage,
    summary,
    summaryExamples,
    signature
}: {
    node: DocNode;
    kind: EntityKind;
    manifestPackage: string;
    displayPackage: string;
    summary: readonly CommentParagraph[];
    summaryExamples: readonly CommentExample[];
    signature: CodeRepresentation;
}): BaseEntityModel {
    const base: BaseEntityModel = {
        kind,
        name: node.name,
        slug: ensureSlug(node),
        qualifiedName: node.qualifiedName,
        manifestPackage,
        displayPackage,
        summary,
        summaryExamples,
        signature,
        isDeprecated: node.flags.isDeprecated
    };

    if (node.packageVersion) base.version = node.packageVersion;
    if (node.sourceUrl) base.sourceUrl = node.sourceUrl;

    return base;
}
