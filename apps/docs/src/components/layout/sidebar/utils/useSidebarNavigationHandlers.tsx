'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { buildVersionPath } from './buildVersionPath';

import type { PackageCatalogEntry, PackageVersionCatalog } from '@lib/docs/types';

export const useSidebarNavigationHandlers = (
    catalog: readonly PackageCatalogEntry[],
    versionOptions: readonly PackageVersionCatalog[],
    restSegments: readonly string[]
): {
    handlePackageChange: (value: string) => void;
    handleVersionChange: (value: string) => void;
} => {
    const router = useRouter();
    const handlePackageChange = useCallback(
        (value: string) => {
            const targetPackage = catalog.find((entry) => entry.id === value);
            if (!targetPackage) {
                return;
            }

            const targetVersion = targetPackage.versions[0];
            if (!targetVersion) {
                return;
            }

            router.push(targetVersion.basePath);
        },
        [catalog, router]
    );

    const handleVersionChange = useCallback(
        (value: string) => {
            const targetVersion = versionOptions.find((version) => version.id === value) ?? versionOptions[0];
            if (!targetVersion) {
                return;
            }

            router.push(buildVersionPath(targetVersion, restSegments));
        },
        [restSegments, router, versionOptions]
    );

    return {
        handlePackageChange,
        handleVersionChange
    };
};
