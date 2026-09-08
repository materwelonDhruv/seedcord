import 'reflect-metadata';

import { defineGate, InteractionKind, RegisterInteractionMiddleware } from '@seedcord/core';
import { GatedMetadataKey, MiddlewareRegistry } from '@seedcord/core/internal';
import { Envapter, PortableSource } from 'envapt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InteractionMiddleware } from '#handlers/interaction/InteractionMiddleware';
import { SlashHandler } from '#handlers/interaction/SlashHandler';
import { createCore, dispatchInteraction } from '#src/dispatch/dispatchInteraction';

import { slashPayload } from './harness';
import { nullPathConfig, VALID_TOKEN } from '../../helpers/fixtures';

import type { InteractionMiddlewareConstructor } from '#handlers/constructors';
import type { ValidInteractionTypes } from '#handlers/interactionTypes';

vi.mock('@discordjs/rest', async (importOriginal) => {
    class FakeRest {
        public post = vi.fn().mockResolvedValue({ resource: { message: { id: 'm-1' } } });
        public patch = vi.fn().mockResolvedValue({ id: 'm-1' });

        public setToken(): this {
            return this;
        }
    }
    return { ...(await importOriginal<object>()), REST: FakeRest };
});

// a bot declares its own keys this way. the gate below reads one back through the context
declare module '@seedcord/core' {
    interface DispatchState {
        actor: string;
    }
}

const seen: (string | undefined)[] = [];

@RegisterInteractionMiddleware()
class Tagger extends InteractionMiddleware {
    public execute(): Promise<void> {
        this.dispatch.set('actor', 'from-middleware');
        return Promise.resolve();
    }
}

const ReadsDispatch = defineGate('ReadsDispatch', (ctx) => {
    seen.push(ctx.dispatch.get('actor'));
});

class GuardedHandler extends SlashHandler<never> {
    public async execute(): Promise<void> {
        await this.reply('done');
    }
}
Reflect.defineMetadata(GatedMetadataKey, [ReadsDispatch], GuardedHandler);

async function dispatchThrough(...ctors: InteractionMiddlewareConstructor[]): Promise<void> {
    Envapter.useSource(new PortableSource({}));
    const middlewares = new MiddlewareRegistry<InteractionMiddlewareConstructor>();
    for (const ctor of ctors) middlewares.register(ctor);

    const execute = await dispatchInteraction({
        match: {
            kind: InteractionKind.Slash,
            routeId: 'slash:guarded',
            load: () => Promise.resolve(GuardedHandler)
        },
        payload: slashPayload('guarded') as ValidInteractionTypes,
        core: createCore(nullPathConfig, VALID_TOKEN),
        middlewares
    });
    await execute?.();
}

beforeEach(() => {
    seen.length = 0;
});

describe('the dispatch context on an http gate', () => {
    it('hands a gate the same context the chain wrote to', async () => {
        await dispatchThrough(Tagger);

        expect(seen).toEqual(['from-middleware']);
    });

    it('leaves the key undefined when no middleware wrote it', async () => {
        await dispatchThrough();

        expect(seen).toEqual([undefined]);
    });
});
