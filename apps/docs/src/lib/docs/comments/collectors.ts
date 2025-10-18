import type { CommentDisplayPart } from '../types';
import type { DocComment, DocCommentExample } from '@seedcord/docs-engine';

export function collectSummaryParts(comment: DocComment): CommentDisplayPart[] {
    if (Array.isArray(comment.summaryParts) && comment.summaryParts.length) {
        return comment.summaryParts;
    }

    if (typeof comment.summary === 'string' && comment.summary.length) {
        return [{ kind: 'text', text: comment.summary } as CommentDisplayPart];
    }

    return [];
}

// eslint-disable-next-line complexity
export function collectExamplesFromBlockTags(comment: DocComment): DocCommentExample[] | undefined {
    if (!Array.isArray(comment.blockTags) || comment.blockTags.length === 0) return undefined;

    const collected: DocCommentExample[] = [];
    for (const tag of comment.blockTags) {
        if (tag.tag !== '@example') continue;

        const text = typeof tag.text === 'string' && tag.text.length ? tag.text : undefined;

        let contentText: string | undefined;
        if (Array.isArray(tag.content) && tag.content.length) {
            const first = tag.content[0] as { text?: string } | undefined;
            if (first && typeof first.text === 'string' && first.text.length) contentText = first.text;
        }

        const value = text ?? contentText;
        if (typeof value === 'string' && value.length) {
            collected.push({ content: value });
        }
    }

    return collected.length ? collected : undefined;
}
