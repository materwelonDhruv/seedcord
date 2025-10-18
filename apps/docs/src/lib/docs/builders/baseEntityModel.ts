import { ensureSlug } from './utils';
import { createPlainParagraph } from '../comments/creators';

import type {
    EntityKind,
    CommentParagraph,
    CommentExample,
    CodeRepresentation,
    BaseEntityModel,
    DeprecationStatus
} from '../types';
import type { DocNode } from '@seedcord/docs-engine';

function buildDeprecationStatus(node: DocNode): DeprecationStatus {
    if (!node.flags.isDeprecated) return { isDeprecated: false };

    const deprecationBlock = node.comment?.blockTags.find((val) => val.tag === '@deprecated');

    let paragraphs: CommentParagraph[] | undefined;
    const deprecationText = deprecationBlock?.text;
    if (deprecationText && deprecationText.length > 0) {
        paragraphs = [createPlainParagraph(deprecationText)];
    }

    return {
        isDeprecated: true,
        deprecationMessage: paragraphs
    };
}

export function buildBaseEntityModel({
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
        deprecationStatus: buildDeprecationStatus(node)
    };

    if (node.packageVersion) base.version = node.packageVersion;
    if (node.sourceUrl) base.sourceUrl = node.sourceUrl;

    return base;
}
