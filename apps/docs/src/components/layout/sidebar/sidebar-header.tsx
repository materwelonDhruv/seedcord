import { SidebarSelect } from './sidebar-select';

import type { PackageCatalogEntry, PackageVersion } from './types';
import type { ReactElement } from 'react';

interface SidebarHeaderProps {
    packageOptions: readonly PackageCatalogEntry[];
    versionOptions: readonly PackageVersion[];
    activePackage: PackageCatalogEntry;
    activeVersion: PackageVersion;
    onPackageChange: (value: string) => void;
    onVersionChange: (value: string) => void;
}

export function SidebarHeader({
    packageOptions,
    versionOptions,
    activePackage,
    activeVersion,
    onPackageChange,
    onVersionChange
}: SidebarHeaderProps): ReactElement {
    return (
        <div className="space-y-3">
            <SidebarSelect
                id="docs-package-picker"
                label="Package"
                value={activePackage.id}
                options={packageOptions.map((option) => ({ id: option.id, label: option.label }))}
                onChange={onPackageChange}
            />
            <SidebarSelect
                id="docs-version-picker"
                label="Version"
                value={activeVersion.id}
                options={versionOptions.map((option) => ({ id: option.id, label: option.label }))}
                onChange={onVersionChange}
            />
        </div>
    );
}

export default SidebarHeader;
