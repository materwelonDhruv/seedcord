'use client';

import { CommandPaletteDialog } from './command-palette-dialog';
import { useCommandPaletteController } from './use-command-palette-controller';

import type { ReactElement } from 'react';

export function CommandPalette(): ReactElement | null {
    const controller = useCommandPaletteController();

    if (!controller.mounted) {
        return null;
    }

    return <CommandPaletteDialog controller={controller} />;
}

export default CommandPalette;
