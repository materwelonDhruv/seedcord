import { Slugger } from '../slugger';
import { CommentTransformer } from './comment-transformer';

import type { DocManifestPackage, DocNode } from '../types';

export interface TransformContextOptions {
    slugger?: Slugger;
    commentTransformer?: CommentTransformer;
}

export interface TransformContext {
    manifest: DocManifestPackage;
    slugger: Slugger;
    commentTransformer: CommentTransformer;
    nodes: Map<number, DocNode>;
}

export const createTransformContext = (
    manifest: DocManifestPackage,
    options: TransformContextOptions = {}
): TransformContext => {
    return {
        manifest,
        slugger: options.slugger ?? new Slugger(),
        commentTransformer: options.commentTransformer ?? new CommentTransformer(),
        nodes: new Map()
    };
};

export const registerNode = (context: TransformContext, node: DocNode): void => {
    context.nodes.set(node.id, node);
};
