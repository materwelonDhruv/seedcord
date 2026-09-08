import { REST } from '@discordjs/rest';
import { MemoryRateLimiter } from '@seedcord/rate-limiter';
import { describe, it, expect, afterEach } from 'vitest';

import { CoordinatedShutdown } from '#node/Lifecycle/CoordinatedShutdown';
import { CoordinatedStartup } from '#node/Lifecycle/CoordinatedStartup';
import { Pluggable } from '#node/Pluggable';
import { Plugin } from '#src/plugin/Plugin';
import { Bus } from '#subscribers/Bus';

import type { CoreBase } from '#interfaces/CoreBase';
import type { Config, IRateLimiter } from '@seedcord/types';

const INIT_TIMEOUT_MS = 10;
const CONNECT_MS = 40;
const SETTLE_MS = 90;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// stands in for the pool or socket a real plugin opens in init()
class SlowConnect extends Plugin {
    public connectionOpen = false;
    public disposeCalls = 0;

    constructor(core: CoreBase) {
        super(core, { init: { timeout: INIT_TIMEOUT_MS } });
    }

    public async init(): Promise<void> {
        await delay(CONNECT_MS);
        this.connectionOpen = true;
    }

    public override dispose(): Promise<void> {
        this.disposeCalls++;
        this.connectionOpen = false;
        return Promise.resolve();
    }
}

class TestHost extends Pluggable<'gateway', 'server'> {
    public readonly config = {} as Config;
    public readonly rest = new REST();
    public readonly applicationId = 'app-1';
    public readonly rateLimiter: IRateLimiter = new MemoryRateLimiter();
    public readonly bus: Bus;

    constructor(shutdown: CoordinatedShutdown, startup: CoordinatedStartup) {
        super(shutdown, startup);
        this.bus = new Bus(this);
    }

    public run(): Promise<this> {
        return this.init();
    }

    public static resetHost(): void {
        Pluggable.reset();
    }
}

function makeHost(): TestHost {
    return new TestHost(new CoordinatedShutdown(), new CoordinatedStartup());
}

describe('a plugin whose init outlasts its timeout', () => {
    afterEach(() => {
        TestHost.resetHost();
    });

    it('disposes what init opened once init resolves', async () => {
        const host = makeHost();
        const plugin = host.attach('db', SlowConnect).db;

        await expect(host.run()).rejects.toThrow();
        await delay(SETTLE_MS);

        expect(plugin.disposeCalls).toBe(1);
        expect(plugin.connectionOpen).toBe(false);
    });

    it('disposes once when a shutdown follows', async () => {
        const shutdown = new CoordinatedShutdown();
        const host = new TestHost(shutdown, new CoordinatedStartup());
        const plugin = host.attach('db', SlowConnect).db;

        await expect(host.run()).rejects.toThrow();
        await delay(SETTLE_MS);
        await shutdown.run(1, false);

        expect(plugin.disposeCalls).toBe(1);
    });
});
