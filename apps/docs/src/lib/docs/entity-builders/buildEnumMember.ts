import { cloneCommentParagraphs, formatCommentRich } from '../commentFormatting';
import { highlightCode } from '../formatting';
import { ensureSlug } from './utils';

import type { EnumMemberModel, FormatContext } from '../types';
import type { DocNode } from '@seedcord/docs-engine';

export async function buildEnumMember(node: DocNode, context: FormatContext): Promise<EnumMemberModel> {
    const code = await highlightCode(node.headerText ?? node.name);
    const comment = await formatCommentRich(node.comment, context);
    const member: EnumMemberModel = {
        id: ensureSlug(node),
        label: node.name,
        summary: cloneCommentParagraphs(comment.paragraphs),
        signature: code
    };

    if (node.defaultValue !== undefined) member.value = node.defaultValue;
    if (node.sourceUrl) member.sourceUrl = node.sourceUrl;

    return member;
}
