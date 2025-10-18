import { AlertTriangle } from 'lucide-react';

import type { DeprecationStatus } from '@/lib/docs/types';

import { Icon } from '@ui/Icon';

import { CommentParagraphs } from './comments/CommentParagraphs';

import type { ReactNode, ReactElement } from 'react';

export default function DecoratedEntity({
    deprecationStatus = { isDeprecated: false },
    children
}: {
    deprecationStatus?: DeprecationStatus;
    children: ReactNode;
}): ReactElement {
    if (!deprecationStatus.isDeprecated) return <>{children}</>;

    return (
        <div className="relative">
            <div className="deprecated-card rounded-2xl p-4 shadow-soft sm:p-5">
                {deprecationStatus.deprecationMessage ? (
                    <div className="mb-3 flex items-start gap-3 text-sm text-subtle">
                        <div className="mt-0.5 flex-shrink-0 text-[var(--deprecated-dark)]">
                            <Icon icon={AlertTriangle} size={16} />
                        </div>
                        <div className="min-w-0 text-sm leading-relaxed text-subtle">
                            <CommentParagraphs paragraphs={deprecationStatus.deprecationMessage} />
                        </div>
                    </div>
                ) : null}

                {children}
            </div>
            <span className="deprecated-label">Deprecated</span>
        </div>
    );
}
