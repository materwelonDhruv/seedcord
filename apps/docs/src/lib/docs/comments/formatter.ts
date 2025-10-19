import { renderExamples } from './renderers/renderExamples';
import { renderParagraphs } from './renderers/renderParagraphs';
import { renderSeeAlso } from './renderers/renderSeeAlso';

import type { FormatContext, FormattedComment } from '../types';
import type { DocComment } from '@seedcord/docs-engine';

export async function formatCommentRich(
    comment: DocComment | null | undefined,
    context: FormatContext
): Promise<FormattedComment> {
    if (!comment) {
        return { paragraphs: [], examples: [] } satisfies FormattedComment;
    }

    const [paragraphs, examples, seeAlso] = await Promise.all([
        renderParagraphs(comment, context),
        renderExamples(comment),
        Promise.resolve(renderSeeAlso(comment, context))
    ]);

    return {
        paragraphs,
        examples,
        seeAlso: seeAlso ?? []
    } satisfies FormattedComment;
}
