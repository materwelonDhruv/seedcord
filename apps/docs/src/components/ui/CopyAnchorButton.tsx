'use client';

import { Check, Hash } from 'lucide-react';
import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@lib/utils';

import { Icon } from './Icon';

const COPY_FEEDBACK_DURATION_MS = 1600;

export function CopyAnchorButton({
    anchorId,
    label,
    className
}: {
    anchorId: string;
    label: string;
    className?: string;
}): ReactElement {
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (copyTimerRef.current !== null) {
                window.clearTimeout(copyTimerRef.current);
            }
        };
    }, []);

    const handleCopyLink = useCallback(() => {
        try {
            const url = new URL(window.location.href);
            url.hash = anchorId;

            if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
                void navigator.clipboard
                    .writeText(url.toString())
                    .then(() => {
                        setCopied(true);
                        if (copyTimerRef.current !== null) {
                            window.clearTimeout(copyTimerRef.current);
                        }
                        copyTimerRef.current = window.setTimeout(() => {
                            setCopied(false);
                            copyTimerRef.current = null;
                        }, COPY_FEEDBACK_DURATION_MS);
                    })
                    .catch(() => {});
            }
        } catch {
            /* swallow clipboard errors */
        }
    }, [anchorId]);

    return (
        <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-subtle transition duration-150 hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--accent-b)_55%,var(--text))]',
                copied ? 'text-[color-mix(in_srgb,var(--accent-b)_68%,var(--text))]' : undefined,
                className
            )}
            aria-label={copied ? `Copied link to ${label}` : `Copy link to ${label}`}
        >
            <Icon icon={copied ? Check : Hash} size={16} />
            <span className="sr-only" aria-live="polite">
                {copied ? 'Link copied to clipboard' : ''}
            </span>
        </button>
    );
}
