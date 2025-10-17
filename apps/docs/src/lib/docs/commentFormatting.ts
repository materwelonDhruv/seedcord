import { highlightInlineToHtml } from '@lib/shiki';

import { highlightCode } from './formatting';
import { resolveReferenceHref } from './resolveReferenceHref';

import type { DocsEngine } from './engine';
import type {
    CommentParagraph,
    InlineTagPart,
    FormatContext,
    CommentDisplayPart,
    TextPart,
    CodePart,
    CommentExample,
    FormattedComment,
    ParagraphAccumulator
} from './types';
import type { DocComment, DocCommentExample, DocNode, DocReference } from '@seedcord/docs-engine';

export const DOUBLE_NEWLINE = /\n{2,}/;
export const HTML_ESCAPE_PATTERN = /[&<>"']/g;
export const ATTRIBUTE_ESCAPE_PATTERN = /[&<>"']/g;
export const INLINE_CODE_TRIM = /^`+|`+$/g;
export const DEFAULT_INLINE_LANG = 'ts';
export const INTERNAL_DOC_PATH = /^\/?docs\//;

export const HTML_ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtml(value: string): string {
    return value.replace(HTML_ESCAPE_PATTERN, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

function escapeAttribute(value: string): string {
    return value.replace(ATTRIBUTE_ESCAPE_PATTERN, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

function createParagraphAccumulator(): ParagraphAccumulator {
    let plainBuffer = '';
    let htmlBuffer = '';
    const paragraphs: CommentParagraph[] = [];

    const push = (): void => {
        if (!plainBuffer && !htmlBuffer) {
            return;
        }

        const plain = plainBuffer.replace(/\s+/g, ' ').trim();
        const html = htmlBuffer.trim();

        if (plain || html) {
            paragraphs.push({ plain, html });
        }

        plainBuffer = '';
        htmlBuffer = '';
    };

    return {
        append(plain, html) {
            if (plain) {
                if (plainBuffer && !/\s$/.test(plainBuffer) && !/^\s/.test(plain)) {
                    plainBuffer += ' ';
                }
                plainBuffer += plain;
            }
            if (html) {
                if (htmlBuffer && !/\s$/.test(htmlBuffer) && !/^\s/.test(html)) {
                    htmlBuffer += ' ';
                }
                htmlBuffer += html;
            }
        },
        breakParagraph() {
            push();
        },
        toParagraphs() {
            push();
            return paragraphs.slice();
        }
    } satisfies ParagraphAccumulator;
}

function convertSingleNewlines(segment: string): { plain: string; html: string } {
    if (!segment) {
        return { plain: '', html: '' };
    }

    const plain = segment.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    const html = escapeHtml(segment).replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

    return { plain, html };
}

function normalizeInlineCode(value: string): string {
    return value.replace(INLINE_CODE_TRIM, '').trim();
}

function sanitizeInternalHref(href: string): string {
    try {
        if (INTERNAL_DOC_PATH.test(href)) {
            return decodeURI(href);
        }
    } catch {
        return href;
    }

    return href;
}

function listPackageCandidates(engine: DocsEngine, currentPackage: string): string[] {
    const ordered = new Set<string>();

    if (currentPackage) {
        ordered.add(currentPackage);
    }

    for (const pkgName of engine.listPackages()) {
        ordered.add(pkgName);
    }

    return Array.from(ordered);
}

function resolveNodeById(engine: DocsEngine, id: number, currentPackage: string): DocNode | null {
    for (const pkgName of listPackageCandidates(engine, currentPackage)) {
        const pkg = engine.getPackage(pkgName);
        const node = pkg?.nodes.get(id);
        if (node) {
            return node;
        }
    }

    return null;
}

function resolveInlineHref(part: InlineTagPart, context: FormatContext): string | null {
    if (typeof part.target === 'number') {
        const node = resolveNodeById(context.engine, part.target, context.manifestPackage);
        if (node) {
            const reference: DocReference = {
                targetKey: node.key,
                name: node.name,
                packageName: node.packageName
            };

            return resolveReferenceHref(reference, {
                engine: context.engine,
                currentPackage: context.manifestPackage
            });
        }
    }

    if (typeof part.target === 'string') {
        const normalized = part.target.trim();
        if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
            return normalized;
        }
    }

    if (typeof part.url === 'string' && part.url.length > 0) {
        return part.url;
    }

    const rawLabel = typeof part.text === 'string' ? part.text : '';
    const trimmedLabel = rawLabel.trim();

    if (trimmedLabel) {
        const [candidate] = context.engine.search(trimmedLabel, context.manifestPackage);
        if (candidate) {
            const node =
                context.engine.getNodeByGlobalSlug(candidate.packageName, candidate.slug) ??
                context.engine.getNodeBySlug(candidate.packageName, candidate.slug);

            if (node) {
                const reference: DocReference = {
                    targetKey: node.key,
                    name: node.name,
                    packageName: node.packageName
                };

                return resolveReferenceHref(reference, {
                    engine: context.engine,
                    currentPackage: context.manifestPackage
                });
            }
        }
    }

    return null;
}

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

async function appendPart(
    part: CommentDisplayPart,
    accumulator: ParagraphAccumulator,
    context: FormatContext
): Promise<void> {
    switch (part.kind) {
        case 'text': {
            const textPart = part as TextPart;
            const text = typeof textPart.text === 'string' ? textPart.text : '';
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
            const codePart = part as CodePart;
            const raw = normalizeInlineCode(typeof codePart.text === 'string' ? codePart.text : '');
            if (!raw) return;

            const highlighted =
                (await highlightInlineToHtml(raw, DEFAULT_INLINE_LANG)) ?? `<code>${escapeHtml(raw)}</code>`;
            accumulator.append(raw, highlighted);
            return;
        }
        case 'inline-tag': {
            const rendered = renderInlineTag(part as InlineTagPart, context);
            accumulator.append(rendered.plain, rendered.html);
            return;
        }
        default: {
            const fallback = (part as { text?: string }).text ?? '';
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

function collectSummaryParts(comment: DocComment): CommentDisplayPart[] {
    if (Array.isArray(comment.summaryParts) && comment.summaryParts.length) {
        return comment.summaryParts;
    }

    if (typeof comment.summary === 'string' && comment.summary.length) {
        return [{ kind: 'text', text: comment.summary } as CommentDisplayPart];
    }

    return [];
}

const FENCE_PREFIX_LENGTH = 3;
const FENCE_SUFFIX = '\n```';

function extractExample(example: DocCommentExample): { code: string; language: string } {
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

async function renderExamples(comment: DocComment): Promise<CommentExample[]> {
    if (!Array.isArray(comment.examples) || comment.examples.length === 0) {
        return [];
    }

    const examples: CommentExample[] = [];

    for (const example of comment.examples) {
        const { code, language } = extractExample(example);
        if (!code) {
            continue;
        }

        const representation = await highlightCode(code, language);
        const entry: CommentExample = {
            code: representation
        };

        if (example.caption) {
            entry.caption = example.caption;
        }

        examples.push(entry);
    }

    return examples;
}

async function renderParagraphs(comment: DocComment, context: FormatContext): Promise<CommentParagraph[]> {
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

export function createPlainParagraph(text: string): CommentParagraph {
    const normalized = text.trim();
    return { plain: normalized, html: escapeHtml(normalized) } satisfies CommentParagraph;
}
