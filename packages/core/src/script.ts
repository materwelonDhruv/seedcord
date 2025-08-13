/**
 * Testing smth
 */

import { resolve } from 'node:path';

import { Globals } from './library/Globals';

Globals.envPaths = resolve(import.meta.dirname, '../../../.env');
// eslint-disable-next-line no-console
console.log(Globals.botToken);
