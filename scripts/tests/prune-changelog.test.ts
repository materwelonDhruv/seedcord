import { describe, expect, it } from 'vitest';

import { collapseUpdatedDependencies, pruneSupersededPrereleases } from '../release/prune-changelog';

describe('pruneSupersededPrereleases', () => {
    it('drops a -next section once its stable version is present', () => {
        const input = [
            '# @seedcord/core',
            '',
            '## 0.2.0',
            '',
            '### Minor Changes',
            '',
            '- feat: a thing',
            '',
            '## 0.2.0-next.0',
            '',
            '### Minor Changes',
            '',
            '- feat: a thing',
            ''
        ].join('\n');
        const out = pruneSupersededPrereleases(input);
        expect(out).not.toContain('0.2.0-next.0');
        expect(out).toContain('## 0.2.0\n');
    });

    it('keeps a -next section that has no stable counterpart yet', () => {
        const input = ['# @seedcord/core', '', '## 0.3.0-next.0', '', '- a pending change', ''].join('\n');
        expect(pruneSupersededPrereleases(input)).toContain('0.3.0-next.0');
    });

    it('keeps prereleases of a restarted version line whose matching stable is older history below', () => {
        const input = [
            '# @seedcord/gateway',
            '',
            '## 0.1.0-next.1',
            '',
            '- new line pre1',
            '',
            '## 0.1.0-next.0',
            '',
            '- new line pre0',
            '',
            '## 0.1.0',
            '',
            '- ancient stable from before the rename',
            ''
        ].join('\n');
        const out = pruneSupersededPrereleases(input);
        expect(out).toContain('## 0.1.0-next.1');
        expect(out).toContain('## 0.1.0-next.0');
        expect(out).toContain('## 0.1.0\n');
    });

    it('keeps a trailing --- note block when its section is pruned', () => {
        const input = [
            '# @seedcord/gateway',
            '',
            '## 0.1.0',
            '',
            '- stable release',
            '',
            '## 0.1.0-next.0',
            '',
            '- pre',
            '',
            '---',
            '',
            '#### Versions below were published as `seedcord`.',
            '',
            '---',
            '',
            '## 0.16.0-next.4',
            '',
            '- old line entry',
            ''
        ].join('\n');
        const out = pruneSupersededPrereleases(input);
        expect(out).not.toContain('## 0.1.0-next.0');
        expect(out).toContain('#### Versions below were published as `seedcord`.');
        expect(out).toContain('## 0.16.0-next.4');
    });

    it('ends with a single newline when the pruned section was the last in the file', () => {
        const input = [
            '# @seedcord/tsconfig',
            '',
            '## 1.0.1',
            '',
            '- stable',
            '',
            '## 1.0.1-alpha.0',
            '',
            '- superseded',
            ''
        ].join('\n');
        const out = pruneSupersededPrereleases(input);
        expect(out.endsWith('\n')).toBe(true);
        expect(out.endsWith('\n\n')).toBe(false);
    });

    it('drops every -next.N once the stable version exists and is idempotent', () => {
        const input = [
            '# @seedcord/core',
            '',
            '## 0.2.0',
            '',
            '- stable',
            '',
            '## 0.2.0-next.1',
            '',
            '- pre1',
            '',
            '## 0.2.0-next.0',
            '',
            '- pre0',
            '',
            '## 0.1.0',
            '',
            '- older stable',
            ''
        ].join('\n');
        const once = pruneSupersededPrereleases(input);
        expect(once).not.toContain('-next.');
        expect(once).toContain('## 0.2.0\n');
        expect(once).toContain('## 0.1.0\n');
        expect(pruneSupersededPrereleases(once)).toBe(once);
    });
});

describe('collapseUpdatedDependencies', () => {
    it('folds a run into one line, keeping each commit once in order', () => {
        const input = [
            '### Patch Changes',
            '',
            '- Updated dependencies [78377fa]',
            '- Updated dependencies [c3613bd]',
            '- Updated dependencies [0a19719]',
            '- Updated dependencies [78377fa]',
            '- Updated dependencies [78377fa]',
            '    - @seedcord/errors@0.6.0',
            ''
        ].join('\n');

        expect(collapseUpdatedDependencies(input)).toBe(
            [
                '### Patch Changes',
                '',
                '- Updated dependencies [78377fa, c3613bd, 0a19719]',
                '    - @seedcord/errors@0.6.0',
                ''
            ].join('\n')
        );
    });

    it('leaves a single line alone', () => {
        const input = ['- Updated dependencies [78377fa]', '    - @seedcord/errors@0.6.0', ''].join('\n');
        expect(collapseUpdatedDependencies(input)).toBe(input);
    });

    it('collapses each run on its own', () => {
        const input = [
            '## 0.5.0',
            '',
            '- Updated dependencies [aaa1111]',
            '- Updated dependencies [aaa1111]',
            '    - @seedcord/types@0.11.0',
            '',
            '## 0.4.0',
            '',
            '- Updated dependencies [bbb2222]',
            '- Updated dependencies [ccc3333]',
            '    - @seedcord/types@0.10.0',
            ''
        ].join('\n');
        const out = collapseUpdatedDependencies(input);

        expect(out).toContain('- Updated dependencies [aaa1111]\n');
        expect(out).toContain('- Updated dependencies [bbb2222, ccc3333]\n');
    });

    it('runs clean a second time', () => {
        const input = [
            '- Updated dependencies [78377fa]',
            '- Updated dependencies [c3613bd]',
            '    - @seedcord/errors@0.6.0',
            ''
        ].join('\n');
        const once = collapseUpdatedDependencies(input);

        expect(collapseUpdatedDependencies(once)).toBe(once);
    });
});
