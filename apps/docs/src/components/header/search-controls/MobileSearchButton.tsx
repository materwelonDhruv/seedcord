'use client';

import { Search } from 'lucide-react';

import Button from '@/components/ui/AButton';
import Icon from '@/components/ui/AnIcon';

import { log } from '@lib/logger';
import useUIStore from '@store/ui';

import type { ReactElement } from 'react';

export function MobileSearchButton(): ReactElement {
    const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

    return (
        <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-(--text)"
            onClick={() => {
                log('Mobile search button clicked');
                setCommandPaletteOpen(true);
            }}
            aria-label="Open command palette"
        >
            <Icon icon={Search} size={16} />
        </Button>
    );
}
