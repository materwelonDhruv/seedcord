import Container from '../../components/layout/container';
import Sidebar from '../../components/layout/sidebar';

import type { ReactNode } from 'react';

interface DocsLayoutProps {
    children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps): ReactNode {
    return (
        <Container sidebar={<Sidebar />}>
            <main id="main-content" className="min-w-0">
                {children}
            </main>
        </Container>
    );
}
