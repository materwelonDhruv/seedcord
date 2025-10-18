import { escapeAttribute, sanitizeInternalHref, escapeHtml, normalizeInlineCode } from './cleaners';
import { highlightCode } from '../formatting';
import { collectExamplesFromBlockTags, collectSummaryParts } from './collectors';
import { DOUBLE_NEWLINE, DEFAULT_INLINE_LANG, FENCE_PREFIX_LENGTH, FENCE_SUFFIX } from './constants';
import { createParagraphAccumulator } from './creators';
import { resolveInlineHref } from './resolvers';
import { highlightInlineToHtml } from '../../shiki';

import type {
    InlineTagPart,
    FormatContext,
    CommentExample,
    CommentParagraph,
    CommentDisplayPart,
    ParagraphAccumulator
} from '../types';
import type { DocComment, DocCommentExample } from '@seedcord/docs-engine';

function renderInlineTag(part: InlineTagPart, context: FormatContext): { plain: string; html: string } {
    if (part.tag === '@link') {
        const href = resolveInlineHref(part, context);
        if (href) {
            const sanitizedHref = escapeAttribute(sanitizeInternalHref(href));
            const rawLabel = typeof part.text === 'string' ? part.text : href;
            const escapedLabel = escapeHtml(rawLabel);
            const external = /^https?:\/\//i.test(href);
            const attrs = external ? ' target="_blank" rel="noreferrer noopener"' : '';

            return {
                plain: rawLabel,
                html: `<a href="${sanitizedHref}"${attrs}>${escapedLabel}</a>`
            };
        }
    }

    const fallbackLabel = typeof part.text === 'string' ? part.text : '';
    return { plain: fallbackLabel, html: escapeHtml(fallbackLabel) };
}

export async function renderExamples(comment: DocComment): Promise<CommentExample[]> {
    const sourceExamples: DocCommentExample[] | undefined =
        Array.isArray(comment.examples) && comment.examples.length
            ? comment.examples
            : collectExamplesFromBlockTags(comment);

    if (!Array.isArray(sourceExamples) || sourceExamples.length === 0) return [];

    const examples: CommentExample[] = [];
    for (const example of sourceExamples) {
        const { code, language } = extractExample(example);
        if (!code) continue;

        const representation = await highlightCode(code, language);
        const entry: CommentExample = { code: representation };
        if (example.caption) entry.caption = example.caption;
        examples.push(entry);
    }

    return examples;
}

export async function renderParagraphs(comment: DocComment, context: FormatContext): Promise<CommentParagraph[]> {
    const parts = collectSummaryParts(comment);
    if (!parts.length) {
        return [];
    }

    const accumulator = createParagraphAccumulator();

    for (const part of parts) {
        await appendPart(part, accumulator, context);
    }

    return accumulator.toParagraphs();
}

// helpers

async function appendPart(
    part: CommentDisplayPart,
    accumulator: ParagraphAccumulator,
    context: FormatContext
): Promise<void> {
    switch (part.kind) {
        case 'text': {
            const text = typeof part.text === 'string' ? part.text : '';
            if (!text) return;
            const segments = text.split(DOUBLE_NEWLINE);

            segments.forEach((segment, index) => {
                if (index > 0) {
                    accumulator.breakParagraph();
                }
                const rendered = convertSingleNewlines(segment);
                accumulator.append(rendered.plain, rendered.html);
            });
            return;
        }
        case 'code': {
            const raw = normalizeInlineCode(typeof part.text === 'string' ? part.text : '');
            if (!raw) return;

            const highlighted =
                (await highlightInlineToHtml(raw, DEFAULT_INLINE_LANG)) ?? `<code>${escapeHtml(raw)}</code>`;
            accumulator.append(raw, highlighted);
            return;
        }
        case 'inline-tag': {
            const rendered = renderInlineTag(part, context);
            accumulator.append(rendered.plain, rendered.html);
            return;
        }
        default: {
            const fallback = part.text;
            if (!fallback) return;
            const segments = fallback.split(DOUBLE_NEWLINE);
            segments.forEach((segment, index) => {
                if (index > 0) {
                    accumulator.breakParagraph();
                }
                const rendered = convertSingleNewlines(segment);
                accumulator.append(rendered.plain, rendered.html);
            });
        }
    }
}

export function extractExample(example: DocCommentExample): { code: string; language: string } {
    const raw = example.content.trim();
    if (!raw.startsWith('```')) {
        return {
            code: raw,
            language: (example.language ?? DEFAULT_INLINE_LANG).toLowerCase()
        };
    }

    const fenceEnd = raw.lastIndexOf(FENCE_SUFFIX);
    if (fenceEnd === -1) {
        return {
            code: raw,
            language: (example.language ?? DEFAULT_INLINE_LANG).toLowerCase()
        };
    }

    const firstNewline = raw.indexOf('\n');
    if (firstNewline === -1) {
        return {
            code: raw,
            language: (example.language ?? DEFAULT_INLINE_LANG).toLowerCase()
        };
    }

    const prefixLanguage = raw.slice(FENCE_PREFIX_LENGTH, firstNewline).trim();
    const fallbackLanguage = example.language ?? DEFAULT_INLINE_LANG;
    const languageValue = prefixLanguage.length > 0 ? prefixLanguage : fallbackLanguage;
    const body = raw.slice(firstNewline + 1, fenceEnd).trim();

    return {
        code: body,
        language: languageValue.toLowerCase()
    };
}

export function convertSingleNewlines(segment: string): { plain: string; html: string } {
    if (!segment) {
        return { plain: '', html: '' };
    }
    const plain = segment.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    const html = escapeHtml(segment).replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    return { plain, html };
}
