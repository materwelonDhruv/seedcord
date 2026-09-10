import 'reflect-metadata';

import { SeedcordErrorCode } from '@seedcord/errors';
import { describe, expect, it } from 'vitest';

import { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import { SlashHandler } from '#handlers/interaction/SlashHandler';

import { readyEngine } from './harness';
import { manifestWith } from '../../helpers/fixtures';

class Undecorated extends SlashHandler<never> {
    async execute(): Promise<void> {
        await Promise.resolve();
    }
}

class Unregistered extends InteractionMiddleware {
    public async execute(): Promise<void> {
        await Promise.resolve();
    }
}

describe('the manifest boundary', () => {
    it('reports a handler that declares no route', async () => {
        await expect(readyEngine(manifestWith({ handlers: [Undecorated] }))).rejects.toMatchObject({
            code: SeedcordErrorCode.ManifestEntryNoRoutes
        });
    });

    it('reports a middleware carrying no decorator', async () => {
        await expect(readyEngine(manifestWith({ middleware: [Unregistered] }))).rejects.toMatchObject({
            code: SeedcordErrorCode.ManifestEntryNoRoutes
        });
    });
});
