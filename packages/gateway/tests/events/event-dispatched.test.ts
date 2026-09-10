import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { eventsOf } from '#bot/Bot';
import { Seedcord } from '#src/Seedcord';

import { seedcordPath } from '../utils/source-path';
import { testConfig } from '../utils/test-config';
import { TestEnvironment } from '../utils/test-env';

import type { SubscriptionData } from '@seedcord/core';

import '../utils/mock-env';

interface PrivateEventDispatcher {
    init(): Promise<void>;
    processEvent(eventName: string, args: unknown[]): Promise<void>;
}

// justified: processEvent is private on the dispatcher
function dispatcherOf(instance: Seedcord): PrivateEventDispatcher {
    return eventsOf(instance.bot) as unknown as PrivateEventDispatcher;
}

const EVENTS_DIR = 'events';
const MIDDLEWARES_DIR = 'event-mw';

const OK = `
    import { EventHandler, RegisterEvent } from '${seedcordPath}';
    import { Events } from 'discord.js';

    @RegisterEvent(['messageCreate'])
    export class Ok extends EventHandler<Events.MessageCreate> {
        public async execute() {
            await Promise.resolve();
        }
    }
`;

const BOOM = `
    import { EventHandler, RegisterEvent } from '${seedcordPath}';
    import { Events } from 'discord.js';

    @RegisterEvent(['messageCreate'])
    export class Boom extends EventHandler<Events.MessageCreate> {
        public async execute() {
            await Promise.resolve();
            throw new Error('handler exploded');
        }
    }
`;

const STOPS = `
    import { RegisterEventMiddleware, EventMiddleware, Silence } from '${seedcordPath}';

    @RegisterEventMiddleware()
    export class Stops extends EventMiddleware {
        public async execute() {
            await Promise.resolve();
            throw new Silence('dropped');
        }
    }
`;

describe('eventDispatched', () => {
    let testEnv: TestEnvironment;
    let seedcord: Seedcord;

    async function fireMessageCreate(middlewares?: string): Promise<SubscriptionData<'eventDispatched'>[]> {
        seedcord = new Seedcord(
            testConfig({
                events: testEnv.resolvePath(EVENTS_DIR),
                ...(middlewares && { eventMiddlewares: testEnv.resolvePath(middlewares) })
            })
        );
        const events = dispatcherOf(seedcord);
        await events.init();

        const published: SubscriptionData<'eventDispatched'>[] = [];
        seedcord.bus.on('eventDispatched', (payload) => published.push(payload));

        await events.processEvent('messageCreate', [{ reply: vi.fn() }]);
        return published;
    }

    beforeEach(async () => {
        // @ts-expect-error the reset hook is private
        Seedcord.reset();
        testEnv = new TestEnvironment('event-dispatched-');
        await testEnv.setup();
    });

    afterEach(async () => {
        await testEnv.teardown();
        vi.restoreAllMocks();
    });

    it('publishes once per fire, naming every handler that ran and how it ended', async () => {
        await testEnv.createFile(`${EVENTS_DIR}/Ok.ts`, OK);
        await testEnv.createFile(`${EVENTS_DIR}/Boom.ts`, BOOM);

        const published = await fireMessageCreate();

        expect(published).toHaveLength(1);
        expect(published[0]?.name).toBe('messageCreate');
        expect(published[0]?.outcome).toBe('handled');
        expect(published[0]?.handlers.map((entry) => `${entry.handler}:${entry.outcome}`).toSorted()).toEqual([
            'Boom:failed',
            'Ok:handled'
        ]);
    });

    it('reports a refusal from the middleware chain with no handlers', async () => {
        await testEnv.createFile(`${EVENTS_DIR}/Ok.ts`, OK);
        await testEnv.createFile(`${MIDDLEWARES_DIR}/Stops.ts`, STOPS);

        const published = await fireMessageCreate(MIDDLEWARES_DIR);

        expect(published).toHaveLength(1);
        expect(published[0]?.outcome).toBe('refused');
        expect(published[0]?.handlers).toEqual([]);
    });

    it('stays quiet for an event no handler registered', async () => {
        await testEnv.createFile(`${EVENTS_DIR}/Ok.ts`, OK);

        seedcord = new Seedcord(testConfig({ events: testEnv.resolvePath(EVENTS_DIR) }));
        const events = dispatcherOf(seedcord);
        await events.init();

        const published: SubscriptionData<'eventDispatched'>[] = [];
        seedcord.bus.on('eventDispatched', (payload) => published.push(payload));

        await events.processEvent('guildCreate', [{}]);

        expect(published).toEqual([]);
    });
});
