import { Trash2 } from 'lucide-react';

import Button from '@/components/ui/AButton';
import { Icon } from '@/components/ui/AnIcon';

import { clearDocsHistory } from '@lib/settings/clearHistory';

import SettingsRow from './SettingsRow';

import type { ReactElement } from 'react';

export function ClearHistoryRow(): ReactElement {
    const handleClear = (): void => {
        clearDocsHistory();
    };

    return (
        <SettingsRow title="Clear history" subtitle="Delete cached site navigation settings">
            <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Clear history">
                <Icon icon={Trash2} size={16} />
            </Button>
        </SettingsRow>
    );
}

export default ClearHistoryRow;
