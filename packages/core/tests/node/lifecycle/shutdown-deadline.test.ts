import { describe, it, expect, vi } from 'vitest';

import { CoordinatedShutdown } from '#node/Lifecycle/CoordinatedShutdown';
import { ShutdownPhase } from '#src/lifecycle/phases';

const DEADLINE_MS = 60;
const TASK_TIMEOUT_MS = 10_000;

const never = (): Promise<void> => new Promise<void>(() => undefined);

// run(_, false) leaves the process alive (dev mode)
describe('CoordinatedShutdown deadline', () => {
    it('gives up on a hanging task once the deadline passes', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);
        shutdown.addTask(ShutdownPhase.Unbind, 'hangs', never, TASK_TIMEOUT_MS);

        const startedAt = Date.now();
        await shutdown.run(1, false);

        expect(Date.now() - startedAt).toBeLessThan(TASK_TIMEOUT_MS);
    });

    it('still runs a fast teardown after an earlier phase ate the budget', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(DEADLINE_MS);

        const closeResource = vi.fn(() => Promise.resolve());
        shutdown.addTask(ShutdownPhase.Unbind, 'hangs', never, TASK_TIMEOUT_MS);
        shutdown.addTask(ShutdownPhase.Disconnect, 'close', closeResource, TASK_TIMEOUT_MS);

        await shutdown.run(1, false);

        expect(closeResource).toHaveBeenCalledTimes(1);
    });

    it('leaves a task alone when the deadline is generous', async () => {
        const shutdown = new CoordinatedShutdown();
        shutdown.removeSignalHandlers();
        shutdown.setDeadline(TASK_TIMEOUT_MS);

        const close = vi.fn(() => Promise.resolve());
        shutdown.addTask(ShutdownPhase.Disconnect, 'close', close, 50);

        await shutdown.run(1, false);

        expect(close).toHaveBeenCalledTimes(1);
    });
});
