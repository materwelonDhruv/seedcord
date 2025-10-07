import { Comment } from 'typedoc';

import type { DocComment, DocCommentBlockTag, DocCommentExample } from '../types';
import type { CommentDisplayPart, CommentTag } from 'typedoc';

export class CommentTransformer {
    toDocComment(comment?: Comment | null): DocComment | null {
        if (!comment) {
            return null;
        }

        const summaryParts = this.cloneParts(comment.summary);
        const summary = Comment.combineDisplayParts(summaryParts).trim();

        const blockTags = comment.blockTags.map((tag) => this.toBlockTag(tag));
        const modifierTags = Array.from(comment.modifierTags);
        const examples = blockTags.filter((tag) => tag.tag === '@example').map((tag) => this.toExampleFromBlock(tag));

        return {
            summary,
            summaryParts,
            blockTags,
            modifierTags,
            examples
        };
    }

    toBlockTag(tag: CommentTag): DocCommentBlockTag {
        const content = this.cloneParts(tag.content);
        const text = Comment.combineDisplayParts(content).trim();

        return {
            tag: tag.tag,
            name: tag.name ?? '',
            content,
            text
        };
    }

    private toExampleFromBlock(block: DocCommentBlockTag): DocCommentExample {
        const codePart = block.content.find((part) => part.kind === 'code');
        const textParts = block.content.filter((part) => part.kind !== 'code');

        const example: DocCommentExample = {
            content: (codePart?.text ?? block.text).trim()
        };

        const captionText = Comment.combineDisplayParts(textParts).trim();
        const caption = captionText || block.name;
        if (caption) {
            example.caption = caption;
        }

        return example;
    }

    private cloneParts(parts: CommentDisplayPart[]): CommentDisplayPart[] {
        return Comment.cloneDisplayParts(parts);
    }
}
