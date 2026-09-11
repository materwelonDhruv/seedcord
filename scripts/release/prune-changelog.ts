import console from 'node:console';
import fs from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const STABLE = /^\d+\.\d+\.\d+$/;
const PRERELEASE = /^(\d+\.\d+\.\d+)-/;
const UPDATED_DEPENDENCIES = /^- Updated dependencies \[([^\]]*)\]$/;
const WORKSPACE_GLOB = /^\s*-\s*([\w-]+)\/\*\s*$/gm;

function sectionVersion(section: string): string | undefined {
    return /^## (\S+)/.exec(section)?.[1];
}

/**
 * Prunes a prerelease section once its stable release exists above it, keeping one changelog entry
 * per released version.
 */
export function pruneSupersededPrereleases(changelog: string): string {
    const sections = changelog.split(/(?=^## )/m);
    // a stable below a prerelease is an older line from before a package rename
    const stableAbove = new Set<string>();
    const kept: string[] = [];
    for (const section of sections) {
        const version = sectionVersion(section);
        if (version && STABLE.test(version)) stableAbove.add(version);
        const base = PRERELEASE.exec(version ?? '')?.[1];
        if (base && stableAbove.has(base)) {
            // a --- block is a hand-authored note, changesets never emits one
            const note = /^---$/m.exec(section);
            if (note) kept.push(section.slice(note.index));
            continue;
        }
        kept.push(section);
    }
    // dropping the last section leaves a blank line at EOF
    return kept.join('').replace(/\n*$/, '\n');
}

/**
 * Folds a run of `- Updated dependencies [sha]` lines into one, keeping each commit once in the order
 * it first appeared. Changesets emits one line per contributing commit, repeats included.
 */
export function collapseUpdatedDependencies(changelog: string): string {
    const lines = changelog.split('\n');
    const out: string[] = [];
    let run: string[] = [];

    function flush(): void {
        if (run.length === 0) return;
        out.push(`- Updated dependencies [${[...new Set(run)].join(', ')}]`);
        run = [];
    }

    for (const line of lines) {
        const shas = UPDATED_DEPENDENCIES.exec(line)?.[1];
        if (shas === undefined) {
            flush();
            out.push(line);
            continue;
        }
        run.push(...shas.split(',').map((sha) => sha.trim()));
    }
    flush();
    return out.join('\n');
}

// reading the globs keeps this from missing a workspace root someone adds later
function workspaceRoots(repoRoot: string): string[] {
    const yaml = fs.readFileSync(resolve(repoRoot, 'pnpm-workspace.yaml'), 'utf8');
    return [...yaml.matchAll(WORKSPACE_GLOB)].map((match) => match[1] ?? '');
}

function pruneAllPackages(): void {
    const repoRoot = resolve(import.meta.dirname, '..', '..');
    let prunedAny = false;
    for (const root of workspaceRoots(repoRoot)) {
        const rootDir = resolve(repoRoot, root);
        if (!fs.existsSync(rootDir)) continue;
        for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const changelogPath = resolve(rootDir, entry.name, 'CHANGELOG.md');
            if (!fs.existsSync(changelogPath)) continue;
            const before = fs.readFileSync(changelogPath, 'utf8');
            const after = collapseUpdatedDependencies(pruneSupersededPrereleases(before));
            if (after === before) continue;
            fs.writeFileSync(changelogPath, after, 'utf8');
            console.log(`Tidied ${changelogPath}`);
            prunedAny = true;
        }
    }
    if (!prunedAny) console.log('Every changelog is already tidy');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    pruneAllPackages();
}
