import 'reflect-metadata';

import { CoreBot } from './src/core/CoreBot';

async function main(): Promise<void> {
  await new CoreBot().start();
}

await main().catch(void 0);
