import { Command } from 'cmdk';

import { CommandListItem } from './list-item';

import type { CommandAction, CommandGroupModel } from './types';
import type { ReactElement } from 'react';

interface CommandListSectionProps {
    group: CommandGroupModel;
    onSelect: (action: CommandAction) => void;
}

export function CommandListSection({ group, onSelect }: CommandListSectionProps): ReactElement {
    return (
        <Command.Group aria-label={group.heading} className="space-y-1 px-2 py-2">
            <p className="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-subtle">{group.heading}</p>
            <div className="mt-1 space-y-1">
                {group.actions.map((action) => (
                    <CommandListItem key={action.id} action={action} onSelect={onSelect} />
                ))}
            </div>
        </Command.Group>
    );
}
