import Icon from '@components/ui/icon';
import { ENTITY_KIND_ICONS, ENTITY_TONE_STYLES } from '@lib/entity-metadata';
import { cn } from '@lib/utils';

import { SidebarItem } from './sidebar-item';

import type { SidebarVariantData } from './types';
import type { ReactElement } from 'react';

interface SidebarCategoryListProps {
    categories: readonly SidebarVariantData[];
}

export function SidebarCategoryList({ categories }: SidebarCategoryListProps): ReactElement {
    return (
        <div className="flex flex-col gap-6 pb-2 pr-1">
            {categories.map((category) => (
                <SidebarCategory key={`${category.title}-${category.tone}`} category={category} />
            ))}
        </div>
    );
}

interface SidebarCategoryProps {
    category: SidebarVariantData;
}

function SidebarCategory({ category }: SidebarCategoryProps): ReactElement {
    const toneStyles = ENTITY_TONE_STYLES[category.tone];
    const ToneIcon = ENTITY_KIND_ICONS[category.tone];

    return (
        <div className="space-y-3">
            <div
                className={cn(
                    'flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide',
                    toneStyles.heading
                )}
            >
                <Icon icon={ToneIcon} size={16} />
                <p>{category.title}</p>
            </div>
            <div className="flex flex-col gap-1">
                {category.items.map((item) => (
                    <SidebarItem key={`${category.title}-${item}`} label={item} tone={category.tone} />
                ))}
            </div>
        </div>
    );
}

export default SidebarCategoryList;
