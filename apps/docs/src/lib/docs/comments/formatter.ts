import { renderExamples, renderParagraphs } from './renderers';

import type { FormatContext, FormattedComment } from '../types';
import type { DocComment } from '@seedcord/docs-engine';

export async function formatCommentRich(
    comment: DocComment | null | undefined,
    context: FormatContext
): Promise<FormattedComment> {
    if (!comment) {
        return { paragraphs: [], examples: [] } satisfies FormattedComment;
    }

    const [paragraphs, examples] = await Promise.all([renderParagraphs(comment, context), renderExamples(comment)]);

    return {
        paragraphs,
        examples
    } satisfies FormattedComment;
}
