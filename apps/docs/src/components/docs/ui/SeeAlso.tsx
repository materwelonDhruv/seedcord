import type { ReactElement } from 'react';

export default function SeeAlso({
    entries
}: {
    entries?: readonly { name: string; href?: string }[] | undefined;
}): ReactElement | null {
    if (!entries || entries.length === 0) return null;

    return (
        <p className="flex flex-wrap items-baseline gap-2 text-subtle">
            <span className="font-semibold text-(--text)">See also:</span>
            <span className="min-w-0">
                {entries.map((s, i) => (
                    <span key={i} className="inline">
                        {s.href ? (
                            <a href={s.href} className="link underline">
                                {s.name}
                            </a>
                        ) : (
                            <span>{s.name}</span>
                        )}
                        {i < entries.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </span>
        </p>
    );
}
