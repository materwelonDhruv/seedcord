import { useCallback, useEffect, useMemo } from 'react';

import { log } from '@lib/logger';
import useUIStore from '@store/ui';

import { PACKAGE_CATALOG } from './data';

import type { CatalogSelection, PackageCatalogEntry, PackageVersion } from './types';

function resolvePackage(
    packages: readonly PackageCatalogEntry[],
    selectedPackage: string | undefined
): PackageCatalogEntry | undefined {
    if (packages.length === 0) {
        return undefined;
    }

    return packages.find((pkg) => pkg.id === selectedPackage) ?? packages[0];
}

function resolveVersion(
    versions: readonly PackageVersion[],
    selectedVersion: string | undefined
): PackageVersion | undefined {
    if (versions.length === 0) {
        return undefined;
    }

    return versions.find((version) => version.id === selectedVersion) ?? versions[0];
}

export function useCatalogSelection(): CatalogSelection | null {
    const packageOptions = PACKAGE_CATALOG;
    const selectedPackage = useUIStore((state) => state.selectedPackage);
    const selectedVersion = useUIStore((state) => state.selectedVersion);
    const setSelectedPackage = useUIStore((state) => state.setSelectedPackage);
    const setSelectedVersion = useUIStore((state) => state.setSelectedVersion);

    const activePackage = useMemo(
        () => resolvePackage(packageOptions, selectedPackage),
        [packageOptions, selectedPackage]
    );

    const versionOptions = activePackage?.versions ?? [];

    const activeVersion = useMemo(
        () => resolveVersion(versionOptions, selectedVersion),
        [selectedVersion, versionOptions]
    );

    useEffect(() => {
        if (versionOptions.length === 0) {
            return;
        }

        const isValid = versionOptions.some((option) => option.id === selectedVersion);

        if (!isValid) {
            const fallback = versionOptions[0];

            if (fallback) {
                setSelectedVersion(fallback.id);
            }
        }
    }, [selectedVersion, setSelectedVersion, versionOptions]);

    const onPackageChange = useCallback(
        (value: string) => {
            setSelectedPackage(value);

            const nextPackage = packageOptions.find((pkg) => pkg.id === value);
            const fallback = nextPackage?.versions[0];

            if (fallback) {
                setSelectedVersion(fallback.id);
            }

            log('Sidebar package changed', { value });
        },
        [packageOptions, setSelectedPackage, setSelectedVersion]
    );

    const onVersionChange = useCallback(
        (value: string) => {
            setSelectedVersion(value);
            log('Sidebar version changed', { value });
        },
        [setSelectedVersion]
    );

    if (!activePackage || !activeVersion) {
        return null;
    }

    return {
        packageOptions,
        versionOptions,
        activePackage,
        activeVersion,
        onPackageChange,
        onVersionChange
    };
}

export default useCatalogSelection;
