import { cookies } from 'next/headers';

import DocsUIProvider from '@components/docs/DocsUIContext';
import Sidebar from '@components/layout/sidebar/Sidebar';
import Container from '@components/layout/sidebar/utils/container/Container';
import { findCatalogEntry, findCatalogVersion, loadDocsCatalog } from '@lib/docs/catalog';

import type { DocsCatalog, PackageCatalogEntry, PackageVersionCatalog } from '@lib/docs/types';
import type { MemberAccessLevel } from '@lib/memberAccess';
import type { ReactNode } from 'react';

interface DocsLayoutParams {
    packageId?: string;
    versionId?: string;
    entitySegments?: string[];
    [key: string]: string | string[] | undefined;
}

interface DocsLayoutProps {
    children: ReactNode;
    params: Promise<DocsLayoutParams>;
}

const decodeParam = (value?: string): string | undefined => {
    if (!value) {
        return undefined;
    }

    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const resolveActiveSelection = (
    catalog: DocsCatalog,
    params: DocsLayoutParams
): {
    activePackage: PackageCatalogEntry | null;
    activeVersion: PackageVersionCatalog | null;
} => {
    if (!catalog.length) {
        return { activePackage: null, activeVersion: null };
    }

    const decodedPackageId = decodeParam(params.packageId);
    const candidatePackage = decodedPackageId ? findCatalogEntry(catalog, decodedPackageId) : null;
    const activePackage = candidatePackage ?? catalog[0] ?? null;

    if (!activePackage) {
        return { activePackage: null, activeVersion: null };
    }

    const decodedVersionId = decodeParam(params.versionId);
    const candidateVersion = decodedVersionId ? findCatalogVersion(activePackage, decodedVersionId) : null;
    const activeVersion = candidateVersion ?? activePackage.versions[0] ?? null;

    return {
        activePackage,
        activeVersion
    };
};

export default async function DocsLayout({ children, params }: DocsLayoutProps): Promise<ReactNode> {
    const catalog = await loadDocsCatalog();
    const resolvedParams = await params;
    const ck = await cookies();
    const get = (name: string): string | undefined => {
        try {
            const c = ck.get(name);
            return c?.value ?? undefined;
        } catch {
            return undefined;
        }
    };

    const snapshot = {
        selectedPackage: get('docs.selectedPackage'),
        selectedVersion: get('docs.selectedVersion'),
        memberAccessLevel: get('docs.memberAccessLevel') as unknown as MemberAccessLevel
    };

    const effectiveParams: DocsLayoutParams = { ...resolvedParams };
    if (!resolvedParams.packageId && snapshot.selectedPackage) {
        effectiveParams.packageId = snapshot.selectedPackage;
    }
    if (!resolvedParams.versionId && snapshot.selectedVersion) {
        effectiveParams.versionId = snapshot.selectedVersion;
    }

    const { activePackage, activeVersion } = resolveActiveSelection(catalog, effectiveParams);

    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: `window.__DOCS_UI__ = ${JSON.stringify(snapshot)};` }} />

            <DocsUIProvider value={snapshot}>
                <Container
                    sidebar={
                        <Sidebar
                            catalog={catalog}
                            activePackageId={activePackage?.id ?? ''}
                            activeVersionId={activeVersion?.id ?? ''}
                        />
                    }
                >
                    <main id="main-content" className="min-w-0">
                        {children}
                    </main>
                </Container>
            </DocsUIProvider>
        </>
    );
}
