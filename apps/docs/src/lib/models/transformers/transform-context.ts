import { Slugger } from '../slugger';
import { CommentTransformer } from './comment-transformer';

import type { DocManifestPackage, DocNode, DocSearchEntry } from '../types';
import type { ReflectionKind } from 'typedoc';

export interface TransformContextOptions {
    slugger?: Slugger;
    commentTransformer?: CommentTransformer;
}

export interface TransformContext {
    manifest: DocManifestPackage;
    slugger: Slugger;
    commentTransformer: CommentTransformer;
    nodes: Map<number, DocNode>;
    byFullName: Map<string, DocNode>;
    bySlug: Map<string, DocNode>;
    byKind: Map<ReflectionKind, DocNode[]>;
    search: DocSearchEntry[];
}

export const createTransformContext = (
    manifest: DocManifestPackage,
    options: TransformContextOptions = {}
): TransformContext => {
    return {
        manifest,
        slugger:
            options.slugger ??
            new Slugger(typeof manifest.name === 'string' && manifest.name.length > 0 ? [manifest.name] : []),
        commentTransformer: options.commentTransformer ?? new CommentTransformer(),
        nodes: new Map(),
        byFullName: new Map(),
        bySlug: new Map(),
        byKind: new Map(),
        search: []
    };
};

export const registerNode = (context: TransformContext, node: DocNode): void => {
    context.nodes.set(node.id, node);
    context.byFullName.set(node.fullName, node);
    context.bySlug.set(node.slug, node);

    const bucket = context.byKind.get(node.kind.id) ?? [];
    bucket.push(node);
    context.byKind.set(node.kind.id, bucket);
};
