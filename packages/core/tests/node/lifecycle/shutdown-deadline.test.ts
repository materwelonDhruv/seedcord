import { SeedcordErrorCode } from '@seedcord/errors';
import { Logger } from '@seedcord/logger';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { CoordinatedShutdown } from '#node/Lifecycle/CoordinatedShutdown';
import { ShutdownPhase } from '#src/lifecycle/phases';

import type { SeedcordError } from '@seedcord/errors/internal';

const DEADLINE_MS = 60;
const TASK_TIMEOUT_MS = 10_000;
// outlives the deadline, so the loop reaches the next phase only after run() has returned
const HUNG_TASK_TIMEOUT_MS = 150;

const never = (): Promise<void> => new Promise<void>(() => undefined);
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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

        // the deadline runs off a setTimeout, so measuring on the wall clock can read short
        const startedAt = performance.now();
        await shutdown.run(1, false);
        const elapsed = performance.now() - startedAt;

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

    // the hung task gives up after the deadline, which is when the loop would reach Disconnect
    it('leaves the phases after the deadline alone once the hung task gives up', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);

        const ran: string[] = [];
        const record = (name: string) => () => {
            ran.push(name);
            return Promise.resolve();
        };
        shutdown.addTask(ShutdownPhase.Unbind, 'unbind', record('unbind'), TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Drain, 'hangs', never, HUNG_TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Disconnect, 'disconnect', record('disconnect'), TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Logout, 'logout', record('logout'), TASK_TIMEOUT_MS);

        await shutdown.run(1, false);
        await delay(HUNG_TASK_TIMEOUT_MS * 3);

        expect(ran).toEqual(['unbind']);
    });

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('refuses a deadline of %s', (deadline) => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();

        let code: SeedcordErrorCode | undefined;
        try {
            shutdown.setDeadline(deadline);
        } catch (error) {
            code = (error as SeedcordError).code; // fixture cast, setDeadline only throws a SeedcordRangeError
        }

        expect(code).toBe(SeedcordErrorCode.LifecycleInvalidShutdownDeadline);
    });

    it('reports a failure it collected before the deadline passed', async () => {
        const errors = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);

        shutdown.addTask(
            ShutdownPhase.Unbind,
            'unbind',
            () => Promise.reject(new Error('close failed')),
            TASK_TIMEOUT_MS
        );
        shutdown.addTask(ShutdownPhase.Drain, 'hangs', never, TASK_TIMEOUT_MS);

        await shutdown.run(1, false);

        const reported = errors.mock.calls.some((call) => call.some((arg) => String(arg).includes('shutdown failed')));
        expect(reported).toBe(true);
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

    it('withholds the success line when the deadline cut the phases short', async () => {
        vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const info = vi.spyOn(Logger.prototype, 'info').mockImplementation(() => undefined);
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);
        shutdown.addTask(ShutdownPhase.Drain, 'hangs', never, TASK_TIMEOUT_MS);

        await shutdown.run(1, false);

        const claimedSuccess = info.mock.calls.some((call) => call.some((arg) => String(arg).includes('completed')));
        expect(claimedSuccess).toBe(false);
    });
});
