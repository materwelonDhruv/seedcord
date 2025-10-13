/* eslint-disable max-lines */
/* eslint-disable max-statements */

import path from 'node:path';
import { performance } from 'node:perf_hooks';

import { ReflectionKind } from 'typedoc';

import { resolveGeneratedDir } from './constants';
import { DocsEngine } from './engine';

import type {
    DocManifestPackage,
    DocNode,
    DocPackageModel,
    DocReference,
    DocSearchEntry,
    InlineType,
    RenderedSignature,
    SigPart
} from './types';

const DIVIDER_WIDTH = 48;
const HELP_TEXT = `Usage: tsx smoke.ts [generated-root]

- generated-root: optional absolute or relative path to the directory that contains the manifest.json file.
    Defaults to the docs generated directory resolved by \`resolveGeneratedDir\`.
`;

const KEY_SAMPLE_LIMIT = 15;
const SUMMARY_SNIPPET_LIMIT = 160;

const formatEntryPoints = (pkg: DocManifestPackage): string => {
    if (!Array.isArray(pkg.entryPoints) || pkg.entryPoints.length === 0) {
        return 'n/a';
    }

    return pkg.entryPoints.join(', ');
};

const logPackageSummary = (pkg: DocManifestPackage, index: number): void => {
    const version = pkg.version ? `@${pkg.version}` : '';
    console.log(`\n[${index + 1}] ${pkg.name}${version}`);
    console.log(`  entry points: ${formatEntryPoints(pkg)}`);
    console.log(`  output: ${pkg.output ?? 'n/a'}`);
    console.log(`  succeeded: ${pkg.succeeded}`);
    console.log(`  warnings: ${pkg.warningCount} | errors: ${pkg.errorCount}`);
};

const logDivider = (): void => {
    console.log(`\n${'-'.repeat(DIVIDER_WIDTH)}`);
};

const resolveGeneratedRoot = (arg?: string): string | undefined => {
    if (!arg) {
        return undefined;
    }

    return path.resolve(process.cwd(), arg);
};

const printManifestSummary = (manifestPackages: DocManifestPackage[]): void => {
    console.log('Packages found:', manifestPackages.length);
    manifestPackages.forEach((pkg, index) => logPackageSummary(pkg, index));
};

const logEngineSummary = (engine: DocsEngine): void => {
    const packages = engine.listPackages();
    logDivider();
    console.log('Packages:', packages.join(', '));

    packages.forEach((name, index) => {
        const model = engine.getPackage(name);
        if (!model) {
            console.log(`\n[${index + 1}] ${name} — unable to resolve package in engine.`);
            return;
        }

        logPackageDiagnostics(engine, model, index);
    });
};

const logPackageDiagnostics = (engine: DocsEngine, pkg: DocPackageModel, index: number): void => {
    const versionLabel = pkg.manifest.version ? `@${pkg.manifest.version}` : '';
    console.log(`\n[${index + 1}] Package diagnostics for ${pkg.manifest.name}${versionLabel}`);

    const nodes = Array.from(pkg.indexes.byId.values());
    console.log(`  total nodes: ${nodes.length}`);
    console.log(`  search entries: ${pkg.indexes.search.length}`);
    console.log(`  root: ${pkg.root.name} (${pkg.root.kindLabel})`);
    console.log(`  root slug: ${pkg.root.slug}`);
    console.log(`  root children: ${pkg.root.children.length}`);

    if (pkg.root.children.length > 0) {
        const childNames = pkg.root.children
            .slice(0, 5)
            .map((child) => child.name)
            .join(', ');
        console.log(`  sample children: ${childNames}`);
    }

    inspectGlobalLookups(engine, pkg, nodes);
    inspectGroups(engine, pkg);
    inspectReferences(engine, pkg, nodes);
    inspectSearch(engine, pkg);
};

const inspectGlobalLookups = (engine: DocsEngine, pkg: DocPackageModel, nodes: DocNode[]): void => {
    if (nodes.length === 0) {
        console.log('  global-id coverage: 0/0');
        return;
    }

    const resolvedCount = nodes.reduce((count, node) => count + (engine.getNodeByKey(node.key) ? 1 : 0), 0);
    console.log(`  global-id coverage: ${resolvedCount}/${nodes.length}`);

    const sample =
        nodes.find((node) => typeof node.sourceUrl === 'string') ??
        nodes.find((node) => node.groups.length > 0) ??
        nodes[0];
    if (!sample) {
        return;
    }

    const byKey = engine.getNodeByKey(sample.key);
    const bySlug = engine.getNodeByGlobalSlug(pkg.manifest.name, sample.slug);
    console.log(`  sample node: ${sample.qualifiedName}`);
    console.log(`    key lookup ok: ${Boolean(byKey)}`);
    console.log(`    global slug lookup ok: ${Boolean(bySlug)}`);
    console.log(`    source url: ${sample.sourceUrl ?? 'n/a'}`);
};

const inspectGroups = (engine: DocsEngine, pkg: DocPackageModel): void => {
    const group = pkg.root.groups[0];
    if (!group) {
        console.log('  groups: none on root node');
        return;
    }

    const resolved = group.childKeys.map((key) => engine.getNodeByKey(key)).filter(Boolean) as DocNode[];
    console.log(
        `  first group: ${group.title} (${formatKind(group.kind)}) — resolved ${resolved.length}/${group.childKeys.length} child keys`
    );

    if (resolved.length > 0) {
        const [sampleNode] = resolved;
        if (sampleNode) {
            console.log(`    child sample: ${sampleNode.qualifiedName} (${sampleNode.kindLabel})`);
        }
    }
};

const inspectReferences = (engine: DocsEngine, pkg: DocPackageModel, nodes: DocNode[]): void => {
    const referenced = nodes.find((node) => Boolean(node.overwrites ?? node.inheritedFrom ?? node.implementationOf));
    if (!referenced) {
        console.log('  references: none to resolve');
        return;
    }

    const reference = referenced.overwrites ?? referenced.inheritedFrom ?? referenced.implementationOf;
    if (!reference) {
        console.log('  references: none to resolve');
        return;
    }

    const resolution = engine.resolveReference(pkg.manifest.name, reference);
    const descriptor = formatReferenceDescriptor(reference);

    if (resolution.externalUrl) {
        console.log(`  reference resolved: ${descriptor} -> external ${resolution.externalUrl}`);
        return;
    }

    if (resolution.packageName && resolution.slug) {
        console.log(`  reference resolved: ${descriptor} -> ${resolution.packageName}/${resolution.slug}`);
        return;
    }

    console.log(`  reference unresolved: ${descriptor}`);
};

const inspectSearch = (engine: DocsEngine, pkg: DocPackageModel): void => {
    const query = chooseSearchQuery(pkg);
    const results = engine.search(query, pkg.manifest.name).slice(0, 5);
    console.log(`  search: "${query}" -> ${results.length} result(s)`);

    results.forEach((entry, index) => {
        console.log(
            `    [${index + 1}] ${entry.qualifiedName} — slug=${entry.slug} kind=${formatKind(entry.kind)} tokens=${formatTokenSample(entry)}`
        );
        if (entry.aliases?.length) {
            console.log(`        aliases: ${entry.aliases.join(', ')}`);
        }
        if (entry.file) {
            console.log(`        file: ${entry.file}`);
        }
        if (entry.summary) {
            const summaryPreview = entry.summary.slice(0, SUMMARY_SNIPPET_LIMIT);
            const suffix = entry.summary.length > SUMMARY_SNIPPET_LIMIT ? '…' : '';
            console.log(`        summary: ${summaryPreview}${suffix}`);
        }
    });

    const aliasEntry = pkg.indexes.search.find((entry) => Array.isArray(entry.aliases) && entry.aliases.length > 0);
    if (aliasEntry?.aliases && aliasEntry.aliases.length > 0) {
        console.log(`  alias sample: ${aliasEntry.name} -> ${aliasEntry.aliases.join(', ')}`);
    }
};

const chooseSearchQuery = (pkg: DocPackageModel): string => {
    const child = pkg.root.children[0];
    if (child) {
        const token = child.name.split(/[^a-zA-Z0-9]+/u).find((part) => part.length > 0);
        if (token) {
            return token;
        }
    }

    const rootToken = pkg.root.name.split(/[^a-zA-Z0-9]+/u).find((part) => part.length > 0);
    return rootToken ?? pkg.manifest.name;
};

const formatReferenceDescriptor = (reference: DocReference): string => {
    const segments: string[] = [reference.name];
    if (reference.packageName) {
        segments.push(`from ${reference.packageName}`);
    }
    if (reference.qualifiedName) {
        segments.push(`<${reference.qualifiedName}>`);
    }
    return segments.join(' ');
};

const formatTokenSample = (entry: DocSearchEntry): string => {
    if (entry.tokens.length === 0) {
        return '(no tokens)';
    }

    const slice = entry.tokens.slice(0, KEY_SAMPLE_LIMIT);
    const suffix = entry.tokens.length > slice.length ? '…' : '';
    return `${slice.join(', ')}${suffix}`;
};

const formatKind = (kind: ReflectionKind | null): string => {
    if (kind === null) {
        return 'unknown';
    }

    const label = ReflectionKind[kind];
    return typeof label === 'string' ? label : `#${kind}`;
};

const sigPartsToText = (parts: SigPart[]): string => {
    let result = '';
    for (const part of parts) {
        if (part.kind === 'space') {
            if (!result.endsWith(' ')) {
                result += ' ';
            }
            continue;
        }

        result += part.text;
    }

    return result.trim();
};

const inlineTypeToText = (inline?: InlineType): string => (inline ? sigPartsToText(inline.parts) : '');
const formatRenderedSignature = (render?: RenderedSignature): string | null => {
    if (!render) {
        return null;
    }

    const nameText = sigPartsToText(render.name);
    const typeParams =
        render.typeParams && render.typeParams.length > 0
            ? `<${render.typeParams.map((param) => param.name).join(', ')}>`
            : '';
    const parameters = render.parameters
        .map((param) => {
            const optional = param.optional ? '?' : '';
            const typeText = param.type ? `: ${inlineTypeToText(param.type)}` : '';
            const defaultValue = param.defaultValue ? ` = ${param.defaultValue}` : '';
            return `${param.name}${optional}${typeText}${defaultValue}`;
        })
        .join(', ');
    const returnType = render.returnType ? `: ${inlineTypeToText(render.returnType)}` : '';

    return `${nameText}${typeParams}(${parameters})${returnType}`.trim();
};

const logTopSearchResults = (entries: DocSearchEntry[]): void => {
    entries.forEach((entry, index) => {
        console.log(`  [${index + 1}] ${entry.packageName}/${entry.slug}`);
        console.log(`      name: ${entry.qualifiedName}`);
        if (entry.aliases?.length) {
            console.log(`      aliases: ${entry.aliases.join(', ')}`);
        }
        console.log(`      tokens: ${entry.tokens.slice(0, KEY_SAMPLE_LIMIT).join(', ') || '<none>'}`);
    });
};

const logRenderedSignatures = (node: DocNode): string[] => {
    return node.signatures.map((signature, index) => {
        const fallbackLabel = signature.render ? formatRenderedSignature(signature.render) : signature.name;
        const renderText = signature.renderText ?? undefined;
        const label = renderText ?? fallbackLabel;

        console.log(`  [sig ${index + 1}] ${label}`);
        console.log(
            `      kind: ${formatKind(signature.kind)} | anchor: ${signature.anchor} | overload: ${signature.overloadIndex}`
        );
        if (signature.comment?.summary) {
            console.log(`      summary: ${signature.comment.summary}`);
        }
        if (signature.render) {
            console.log('      rendered parts:');
            console.dir(signature.render, { depth: null });
        }
        return label ?? '';
    });
};

const attemptCustomSearch = (query: string, packageName: string | undefined, engine: DocsEngine): void => {
    const results = engine.search(query, packageName);
    if (results.length === 0) {
        console.log(`Custom search: "${query}" returned no results.`);
        return;
    }

    const topResults = results.slice(0, 5);
    console.log(`\nCustom search for "${query}" (${packageName ?? 'all packages'}):`);
    logTopSearchResults(topResults);

    const target = results.find((entry) => entry.name === 'traverseDirectory') ?? results[0];
    if (!target) {
        console.log('Unable to select target result.');
        return;
    }
    const node = engine.getNodeBySlug(target.packageName, target.slug);
    if (!node) {
        console.log('Unable to resolve node for selected result.');
        return;
    }

    console.log(`\nResolved node: ${node.qualifiedName} (${formatKind(node.kind)})`);
    if (node.signatures.length === 0) {
        console.log('  No signatures present on node.');
        return;
    }

    const expectedSignature =
        'traverseDirectory(dir: string, callback: (fullPath: string, relativePath: string, imported: Record<string, unknown>) => Promise<void> | void, logger: Logger): Promise<void>';

    const renderedSignatures = logRenderedSignatures(node);
    const matchesExpected = renderedSignatures.includes(expectedSignature);
    console.log('\nExpected signature:');
    console.log(`  ${expectedSignature}`);
    console.log(`Match found: ${matchesExpected}`);
    if (!matchesExpected) {
        console.log('  Rendered signatures did not match expected declaration.');
    }
};

const main = async (): Promise<void> => {
    const arg = process.argv[2];
    if (arg === '--help' || arg === '-h') {
        console.log(HELP_TEXT);
        return;
    }

    const providedRoot = resolveGeneratedRoot(arg);
    const generatedRoot = providedRoot ?? resolveGeneratedDir();
    const engine = await DocsEngine.create({ generatedRoot });
    const manifest = engine.getManifest();

    const outputDir = manifest.outputDir.trim();
    console.log('Manifest loaded from:', outputDir.length > 0 ? outputDir : '<default>');
    printManifestSummary(manifest.packages);
    logEngineSummary(engine);

    logDivider();

    performance.mark('smoke-start');
    attemptCustomSearch('phase', undefined, engine);
    performance.mark('smoke-end');
    performance.measure('smoke', 'smoke-start', 'smoke-end');

    const measure = performance.getEntriesByName('smoke').pop();
    if (measure) {
        console.log(`\nsmoke test completed in ${Math.round(measure.duration)}ms`);
    } else {
        console.log('\nsmoke test completed');
    }
};

main().catch((error: unknown) => {
    console.error('\n❌ smoke.ts encountered an error:\n');
    console.error(error);
    process.exitCode = 1;
});
