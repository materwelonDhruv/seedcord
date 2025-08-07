import 'reflect-metadata';

import { CoreBot } from './src/core/CoreBot';

async function main(): Promise<void> {
  await CoreBot.instance.start();
}

await main().catch(void 0);
