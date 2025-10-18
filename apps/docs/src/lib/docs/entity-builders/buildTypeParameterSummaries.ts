import { createPlainParagraph } from '../commentFormatting';
import { renderInlineType, highlightCode } from '../formatting';

import type { FormatContext, CommentParagraph, CommentExample } from '../types';
import type { EntityMemberSummary } from '@components/docs/entity/types';
import type { RenderedDeclarationHeader } from '@seedcord/docs-engine';

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
