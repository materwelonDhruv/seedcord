import type { ReactElement } from 'react';

export default function NotFound(): ReactElement {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="mt-2 text-xl">Not Found</p>
            </div>
        </div>
    );
}
