import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

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
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (key: string): void => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="flex flex-col gap-6 pb-2 pr-1">
            {categories.map((category) => (
                <SidebarCategory
                    key={`${category.title}-${category.tone}`}
                    categoryKey={`${category.title}-${category.tone}`}
                    category={category}
                    isCollapsed={collapsedCategories[`${category.title}-${category.tone}`] ?? false}
                    onToggle={toggleCategory}
                />
            ))}
        </div>
    );
}

interface SidebarCategoryProps {
    category: SidebarVariantData;
    categoryKey: string;
    isCollapsed: boolean;
    onToggle: (key: string) => void;
}

function SidebarCategory({ category, categoryKey, isCollapsed, onToggle }: SidebarCategoryProps): ReactElement {
    const toneStyles = ENTITY_TONE_STYLES[category.tone];
    const ToneIcon = ENTITY_KIND_ICONS[category.tone];

    return (
        <div className="space-y-3">
            <button
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => onToggle(categoryKey)}
                className={cn(
                    'flex w-full items-center px-1 text-left text-xs font-semibold uppercase tracking-wide',
                    toneStyles.heading
                )}
            >
                <span className="flex items-center gap-2">
                    <Icon icon={ToneIcon} size={16} />
                    <span>{category.title}</span>
                </span>
                <Icon
                    icon={ChevronDown}
                    size={16}
                    className={cn('ml-2 transition-transform', isCollapsed && '-rotate-90')}
                />
            </button>
            <div className={cn('flex flex-col gap-1', isCollapsed && 'hidden')}>
                {category.items.map((item) => (
                    <SidebarItem key={`${category.title}-${item}`} label={item} tone={category.tone} />
                ))}
            </div>
        </div>
    );
}

export default SidebarCategoryList;
