import { createServer } from 'http';

import chalk from 'chalk';

import { ShutdownPhase } from './CoordinatedShutdown';
import { LogService } from './LogService';
import { Globals } from '../library/globals/Globals';

import type { Core } from '../library/interfaces/Core';
import type { IncomingMessage, Server, ServerResponse } from 'http';

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;

interface HealthCheckOptions {
  /** Port to listen on (default: from Globals.healthCheckPort) */
  port?: number;
  /** Path for the health check endpoint (default: from Globals.healthCheckPath) */
  path?: string;
}

export class HealthCheck {
  private readonly logger = new LogService('HealthCheck');
  private readonly port: number;
  private readonly path: string;
  private server?: Server;

  constructor(
    private readonly core: Core,
    options: HealthCheckOptions = {}
  ) {
    this.port = options.port ?? Globals.healthCheckPort;
    this.path = options.path ?? Globals.healthCheckPath;

    // Register shutdown task
    this.core.shutdown.addTask(ShutdownPhase.StopServices, 'stop-healthcheck-server', async () => await this.stop());
  }

  /**
   * Starts the health check server.
   * @returns Promise that resolves when the server is listening
   */
  public async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'GET' && req.url === this.path) {
          res.writeHead(HTTP_OK, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
        } else {
          res.writeHead(HTTP_NOT_FOUND, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'not found' }));
        }
      });

      this.server.on('error', reject);

      this.server.listen(this.port, () => {
        this.logger.info(
          `${chalk.green.bold('✓')} Health check server listening on ${chalk.cyan(`http://localhost:${this.port}${this.path}`)}`
        );
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((shutdownResolve) => {
      this.server?.close(() => {
        this.logger.info(chalk.bold.red('Health check server stopped'));
        shutdownResolve();
      });
    });
  }
}
