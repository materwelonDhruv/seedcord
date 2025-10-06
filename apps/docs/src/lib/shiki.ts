import { getSingletonHighlighter, type BundledLanguage, type BundledTheme, type Highlighter } from 'shiki';

const THEMES = {
    dark: 'github-dark-default',
    light: 'github-light-default'
} as const satisfies Record<'dark' | 'light', BundledTheme>;

const COMMON_LANGS: BundledLanguage[] = ['ts', 'tsx', 'js', 'jsx', 'json'];

async function ensureHighlighter(langs: BundledLanguage[]): Promise<Highlighter> {
    const uniqueLangs = Array.from(new Set<BundledLanguage>([...COMMON_LANGS, ...langs]));

    return getSingletonHighlighter({
        themes: [THEMES.dark, THEMES.light],
        langs: uniqueLangs
    });
}

function decorateBlock(html: string, variant: keyof typeof THEMES): string {
    return html.replace(/<pre class="shiki/g, `<pre class="shiki shiki-${variant}`);
}

function extractCode(html: string): string | null {
    const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    return match?.[1] ?? null;
}

export async function highlightToHtml(code: string, lang: BundledLanguage = 'ts'): Promise<string | null> {
    if (!code) {
        return '';
    }

    try {
        const highlighter = await ensureHighlighter([lang]);
        const darkHtml = decorateBlock(highlighter.codeToHtml(code, { lang, theme: THEMES.dark }), 'dark');
        const lightHtml = decorateBlock(highlighter.codeToHtml(code, { lang, theme: THEMES.light }), 'light');

        return `<div class="shiki-theme-group">${darkHtml}${lightHtml}</div>`;
    } catch {
        return null;
    }
}

export async function highlightInlineToHtml(code: string, lang: BundledLanguage = 'ts'): Promise<string | null> {
    if (!code) {
        return '';
    }

    try {
        const highlighter = await ensureHighlighter([lang]);
        const darkHtml = highlighter.codeToHtml(code, { lang, theme: THEMES.dark });
        const lightHtml = highlighter.codeToHtml(code, { lang, theme: THEMES.light });

        const darkCode = extractCode(darkHtml);
        const lightCode = extractCode(lightHtml);

        if (!darkCode || !lightCode) {
            return null;
        }

        return `\
<span class="shiki-inline-group">\
<code class="shiki-inline shiki-dark" data-variant="dark">${darkCode}</code>\
<code class="shiki-inline shiki-light" data-variant="light">${lightCode}</code>\
</span>`;
    } catch {
        return null;
    }
}
