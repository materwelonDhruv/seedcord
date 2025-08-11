import { EventEmitter } from 'node:events';

import chalk from 'chalk';

import { Logger } from './Logger';

import type { TypedExclude, NumberRange } from '../library/types/Miscellaneous';

/**
 * Startup phases for coordinated plugin initialization.
 * Phases execute in the order defined below.
 */
export enum StartupPhase {
  /** Validate environment variables and config files */
  Validation = 1,
  /** Discover plugin constructors via decorators or registry */
  Discovery,
  /** Register plugin metadata and declared dependencies */
  Registration,
  /** Inject and validate plugin-specific configuration */
  Configuration,
  /** Instantiate plugin classes with Core and arguments */
  Instantiation,
  /** Activate plugins by calling their init/setup hooks */
  Activation,
  /** Mark core as ready and start handling interactions */
  Ready
}

/** Maximum phase number for type safety */
const _PHASE_COUNT = 7;

type StartupAction = 'start' | 'complete' | 'error';
type PhaseAction = TypedExclude<StartupAction, 'error'>;
type StartupEvents = `startup:${StartupAction}`;
type PhaseEvents = `phase:${NumberRange<1, typeof _PHASE_COUNT>}:${PhaseAction}`;
type CoordinatedStartupEventKey = StartupEvents | PhaseEvents;

/** Interface for a startup task */
export interface StartupTask {
  name: string;
  task: () => Promise<void>;
  timeout: number; // timeout in milliseconds
}

/** Define the order of phases */
const PHASE_ORDER: StartupPhase[] = [
  StartupPhase.Validation,
  StartupPhase.Discovery,
  StartupPhase.Registration,
  StartupPhase.Configuration,
  StartupPhase.Instantiation,
  StartupPhase.Activation,
  StartupPhase.Ready
];

export class CoordinatedStartup {
  private static _instance: CoordinatedStartup;

  private readonly logger = new Logger('CoordinatedStartup');
  private readonly events = new EventEmitter();
  private readonly tasksMap = new Map<StartupPhase, StartupTask[]>();

  private isStartingUp = false;
  private hasStarted = false;

  private constructor() {
    // Initialize phases
    PHASE_ORDER.forEach((phase) => this.tasksMap.set(phase, []));
  }

  public static get instance(): CoordinatedStartup {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (this._instance ??= new CoordinatedStartup());
  }

  /**
   * Add a task to a specific startup phase
   */
  public addTask(phase: StartupPhase, taskName: string, task: () => Promise<void>, timeoutMs = 10000): void {
    if (this.hasStarted) {
      throw new Error('Cannot add tasks after startup sequence has already completed');
    }

    if (this.isStartingUp) {
      throw new Error('Cannot add tasks while startup sequence is in progress');
    }

    const tasks = this.tasksMap.get(phase);
    if (!tasks) throw new Error(`Unknown startup phase: ${phase}`);

    tasks.push({ name: taskName, task, timeout: timeoutMs });
    this.logger.debug(
      `${chalk.italic('Added')} startup task ${chalk.bold.cyan(taskName)} to phase ${chalk.bold.magenta(StartupPhase[phase])}`
    );
  }

  /**
   * Remove a task by name from a specific phase
   */
  public removeTask(phase: StartupPhase, taskName: string): boolean {
    if (this.isStartingUp) {
      throw new Error('Cannot remove tasks while startup sequence is in progress');
    }

    const tasks = this.tasksMap.get(phase);
    if (!tasks) return false;

    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task) => task.name !== taskName);
    this.tasksMap.set(phase, filteredTasks);

    const removed = initialLength !== filteredTasks.length;
    if (removed) {
      this.logger.debug(
        `${chalk.italic('Removed')} startup task ${chalk.bold.cyan(taskName)} from phase ${chalk.bold.magenta(StartupPhase[phase])}`
      );
    }

    return removed;
  }

  /**
   * Start the coordinated startup sequence
   */
  public async run(): Promise<void> {
    if (this.hasStarted) {
      this.logger.warn('Startup sequence has already completed');
      return;
    }

    if (this.isStartingUp) {
      this.logger.warn('Startup sequence already in progress');
      return;
    }

    this.isStartingUp = true;
    this.logger.info(`${chalk.bold.green('Starting')} coordinated startup sequence`);
    this.emit('startup:start');

    try {
      // Execute each phase in order
      for (const phase of PHASE_ORDER) await this.runPhase(phase);

      this.hasStarted = true;
      this.logger.info(`${chalk.bold.green('Coordinated startup completed')} successfully`);
      this.emit('startup:complete');
    } catch (error) {
      this.logger.error(`${chalk.bold.red('Coordinated startup failed')}`);
      this.emit('startup:error', error);
      throw error;
    } finally {
      this.isStartingUp = false;
    }
  }

  /**
   * Run all tasks in a specific phase
   */
  private async runPhase(phase: StartupPhase): Promise<void> {
    const tasks = this.tasksMap.get(phase) ?? [];
    if (tasks.length === 0) {
      this.logger.warn(`No tasks to run in phase ${chalk.bold.magenta(StartupPhase[phase])}`);
      return;
    }

    this.logger.info(
      `${chalk.bold.yellow('Running')} startup phase ${chalk.bold.magenta(StartupPhase[phase])} with ${chalk.bold.cyan(tasks.length)} tasks`
    );
    this.emit(`phase:${phase}:start`);

    // Execute all tasks in order with timeout
    const results: PromiseSettledResult<void>[] = [];
    for (const task of tasks) {
      results.push(
        await Promise.resolve()
          .then(() => this.runTaskWithTimeout(phase, task))
          .then(
            () => ({ status: 'fulfilled', value: undefined }) satisfies PromiseSettledResult<void>,
            (reason) => ({ status: 'rejected', reason }) satisfies PromiseSettledResult<void>
          )
      );
    }

    // Check results
    const failures = results.filter((r) => r.status === 'rejected').length;
    if (failures > 0) {
      const errorMessage = `Phase ${chalk.bold.magenta(StartupPhase[phase])} completed with ${chalk.bold.red(failures)} failed tasks`;

      throw new Error(errorMessage);
    } else {
      this.logger.info(
        `Phase ${chalk.bold.magenta(StartupPhase[phase])} ${chalk.bold.green('completed successfully')}`
      );
    }

    this.emit(`phase:${phase}:complete`);
  }

  /**
   * Run a single task with timeout
   */
  private async runTaskWithTimeout(phase: StartupPhase, task: StartupTask): Promise<void> {
    this.logger.info(
      `${chalk.italic('Starting')} task ${chalk.bold.cyan(task.name)} in phase ${chalk.bold.magenta(StartupPhase[phase])}`
    );

    try {
      // Create a race between the task and a timeout
      await Promise.race([
        task.task(),
        new Promise<void>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Task '${task.name}' timed out after ${task.timeout}ms`));
          }, task.timeout);
        })
      ]);

      this.logger.info(
        `${chalk.italic('Completed')} task ${chalk.bold.cyan(task.name)} in phase ${chalk.bold.magenta(StartupPhase[phase])}`
      );
    } catch (error) {
      this.logger.error(
        `${chalk.italic('Failed')} task ${chalk.bold.cyan(task.name)} in phase ${chalk.bold.magenta(StartupPhase[phase])}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Subscribe to startup events
   */
  public on(event: CoordinatedStartupEventKey, listener: (...args: unknown[]) => void): void {
    this.events.on(event, listener);
  }

  /**
   * Unsubscribe from startup events
   */
  public off(event: CoordinatedStartupEventKey, listener: (...args: unknown[]) => void): void {
    this.events.off(event, listener);
  }

  /**
   * Check if startup has completed
   */
  public get isReady(): boolean {
    return this.hasStarted;
  }

  /**
   * Check if startup is currently running
   */
  public get isRunning(): boolean {
    return this.isStartingUp;
  }

  private emit(event: CoordinatedStartupEventKey, ...args: unknown[]): boolean {
    return this.events.emit(event, ...args);
  }
}
