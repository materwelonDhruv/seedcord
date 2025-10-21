import Pill from './Pill';

import type { ReactElement } from 'react';

function TagPills({ tags }: { tags: readonly string[] }): ReactElement | null {
    if (!tags.length) return null;

    return (
        <>
            {tags.includes('internal') ? (
                <Pill className="border-border/80 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] text-subtle">
                    Internal
                </Pill>
            ) : null}

            {tags.includes('decorator') ? (
                <Pill className="border-border/80 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] text-subtle">
                    Decorator
                </Pill>
            ) : null}
        </>
    );
}

export default TagPills;
