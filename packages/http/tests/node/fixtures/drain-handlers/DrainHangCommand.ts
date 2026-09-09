import { SlashRoute } from '@seedcord/core';

import { SlashHandler } from '#handlers/interaction/SlashHandler';

declare module '@seedcord/core' {
    interface SlashRegistry {
        drainhang: { options: Record<never, never>; cache: 'cached' };
    }
}

@SlashRoute('drainhang')
export class DrainHangCommand extends SlashHandler<'drainhang'> {
    async execute(): Promise<void> {
        await new Promise(() => undefined);
    }
}
