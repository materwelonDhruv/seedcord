import { AlertTriangle } from 'lucide-react';

import type { WithDeprecationStatus } from '@/lib/docs/types';

import Icon from '@ui/Icon';

import CommentParagraphs from './comments/CommentParagraphs';

import type { ReactElement, ReactNode } from 'react';

interface DeprecatedEntityProps extends WithDeprecationStatus {
    children: ReactNode;
}

function DeprecatedEntity({
    deprecationStatus = { isDeprecated: false },
    children
}: DeprecatedEntityProps): ReactElement {
    if (!deprecationStatus.isDeprecated) return <>{children}</>;

    return (
        <div className="relative">
            <div className="deprecated-card rounded-2xl p-4 shadow-soft sm:p-5">
                {deprecationStatus.deprecationMessage ? (
                    <div className="mb-3 flex items-start gap-3 text-sm text-subtle">
                        <div className="mt-0.5 shrink-0 text-(--deprecated-dark)">
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

export default DeprecatedEntity;
