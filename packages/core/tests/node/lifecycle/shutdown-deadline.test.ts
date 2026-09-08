import { SeedcordErrorCode } from '@seedcord/errors';
import { Logger } from '@seedcord/logger';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { CoordinatedShutdown } from '#node/Lifecycle/CoordinatedShutdown';
import { ShutdownPhase } from '#src/lifecycle/phases';

import type { SeedcordError } from '@seedcord/errors/internal';

const DEADLINE_MS = 60;
const TASK_TIMEOUT_MS = 10_000;
const SETTLE_MS = 200;

const never = (): Promise<void> => new Promise<void>(() => undefined);
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// an unrestored spy carries the previous test's calls into this one
afterEach(() => {
    vi.restoreAllMocks();
});

// run(_, false) leaves the process alive (dev mode)
describe('CoordinatedShutdown deadline', () => {
    it('returns near the deadline with a task still hanging', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);
        shutdown.addTask(ShutdownPhase.Unbind, 'hangs', never, TASK_TIMEOUT_MS);

        const startedAt = Date.now();
        await shutdown.run(1, false);
        const elapsed = Date.now() - startedAt;

        expect(elapsed).toBeGreaterThanOrEqual(DEADLINE_MS);
        expect(elapsed).toBeLessThan(DEADLINE_MS * 10);
    });

    it('gives a task its whole declared timeout when the deadline is generous', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(TASK_TIMEOUT_MS);

        let closed = false;
        shutdown.addTask(
            ShutdownPhase.Disconnect,
            'close',
            async () => {
                await delay(50);
                closed = true;
            },
            TASK_TIMEOUT_MS
        );

        await shutdown.run(1, false);

        expect(closed).toBe(true);
    });

    it('stops at the phase the deadline caught, keeping the later ones in order', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);

        const ran: string[] = [];
        const record = (name: string) => () => {
            ran.push(name);
            return Promise.resolve();
        };
        shutdown.addTask(ShutdownPhase.Unbind, 'unbind', record('unbind'), TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Drain, 'hangs', never, TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Disconnect, 'disconnect', record('disconnect'), TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Logout, 'logout', record('logout'), TASK_TIMEOUT_MS);

        await shutdown.run(1, false);
        await delay(SETTLE_MS);

        expect(ran).toEqual(['unbind']);
    });

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('refuses a deadline of %s', (deadline) => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();

        let code: SeedcordErrorCode | undefined;
        try {
            shutdown.setDeadline(deadline);
        } catch (error) {
            code = (error as SeedcordError).code; // fixture cast, read the code off whatever was thrown
        }

        expect(code).toBe(SeedcordErrorCode.LifecycleInvalidShutdownDeadline);
    });

    it('names the phase that was running when the deadline passed', async () => {
        const errors = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);
        shutdown.addTask(ShutdownPhase.Drain, 'hangs', never, TASK_TIMEOUT_MS);

        await shutdown.run(1, false);

        const named = errors.mock.calls.some((call) =>
            call.some((arg) => String(arg).includes('deadline') && String(arg).includes('Drain'))
        );
        expect(named).toBe(true);
    });
});
