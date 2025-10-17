'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import MemberAccessControls from '@components/header/member-access-controls';
import { formatMemberAccessLabel, MEMBER_ACCESS_RANK, type MemberAccessLevel } from '@lib/member-access';
import { cn } from '@lib/utils';
import { useUIStore, type UIStore } from '@store/ui';
import { Icon } from '@ui/icon';

import { MemberDetailGroup, MemberList } from './entity-member-components';

import type { EntityMemberSummary } from './member-types';

interface EntityMembersSectionProps {
    properties: readonly EntityMemberSummary[];
    methods: readonly EntityMemberSummary[];
    constructors: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
    showAccessControls?: boolean;
}

function shouldIncludeMember(member: EntityMemberSummary, threshold: MemberAccessLevel): boolean {
    const access = member.access ?? 'public';
    return MEMBER_ACCESS_RANK[access] <= MEMBER_ACCESS_RANK[threshold];
}

function useMemberNavigation(): (anchorId: string) => void {
    const openMemberSection = useCallback((anchorId: string) => {
        if (!anchorId || typeof document === 'undefined') {
            return;
        }

        const targetElement = document.getElementById(anchorId);

        if (targetElement) {
            window.requestAnimationFrame(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }, []);

    useEffect(() => {
        const handleHashNavigation = (): void => {
            if (typeof window === 'undefined') {
                return;
            }

            const targetId = window.location.hash.replace(/^#/, '');
            if (targetId) {
                openMemberSection(targetId);
            }
        };

        handleHashNavigation();
        window.addEventListener('hashchange', handleHashNavigation);

        return () => {
            window.removeEventListener('hashchange', handleHashNavigation);
        };
    }, [openMemberSection]);

    return openMemberSection;
}

function renderMemberOverview(columns: ReactElement[], memberAccessLevel: MemberAccessLevel): ReactElement | null {
    if (!columns.length) {
        return null;
    }

    const quickPanelGridColumns = columns.length === 2 ? 'lg:grid-cols-2' : undefined;

    return (
        <details
            open
            className="group min-w-0 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] p-4 shadow-soft md:p-5"
        >
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-left text-[var(--text)]">
                <span className="text-lg font-semibold">Member overview</span>
                <Icon icon={ChevronDown} size={18} className="text-subtle transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-4">
                <p className="text-xs text-subtle">
                    Showing members with{' '}
                    <span className="font-semibold text-[var(--text)]">
                        {formatMemberAccessLabel(memberAccessLevel)}
                    </span>{' '}
                    visibility and higher.
                </p>
                <div className={cn('grid min-w-0 gap-3', quickPanelGridColumns)}>{columns}</div>
            </div>
        </details>
    );
}

export default function EntityMembersSection({
    properties,
    methods,
    constructors,
    typeParameters = [],
    showAccessControls = false
}: EntityMembersSectionProps): ReactElement {
    const memberAccessLevel = useUIStore(useShallow((state: UIStore) => state.memberAccessLevel));
    const openMemberSection = useMemberNavigation();

    const filteredProperties = useMemo(
        () => properties.filter((member) => shouldIncludeMember(member, memberAccessLevel)),
        [properties, memberAccessLevel]
    );
    const filteredMethods = useMemo(
        () => methods.filter((member) => shouldIncludeMember(member, memberAccessLevel)),
        [methods, memberAccessLevel]
    );
    const filteredConstructors = useMemo(
        () => constructors.filter((member) => shouldIncludeMember(member, memberAccessLevel)),
        [constructors, memberAccessLevel]
    );

    const quickPanelColumns: ReactElement[] = [];

    if (filteredConstructors.length) {
        quickPanelColumns.push(
            <MemberList
                key="constructors"
                items={filteredConstructors}
                prefix="constructor"
                onNavigate={openMemberSection}
            />
        );
    }
    if (filteredProperties.length) {
        quickPanelColumns.push(
            <MemberList key="properties" items={filteredProperties} prefix="property" onNavigate={openMemberSection} />
        );
    }

    if (filteredMethods.length) {
        quickPanelColumns.push(
            <MemberList key="methods" items={filteredMethods} prefix="method" onNavigate={openMemberSection} />
        );
    }

    return (
        <section className="min-w-0 space-y-8">
            {showAccessControls ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">
                            Member visibility
                        </p>
                        <p className="text-xs text-subtle/80">Filter class members by access level.</p>
                    </div>
                    <MemberAccessControls orientation="horizontal" showLegend={false} className="flex-shrink-0" />
                </div>
            ) : null}
            {filteredConstructors.length ? (
                <MemberDetailGroup items={filteredConstructors} prefix="constructor" />
            ) : null}
            {renderMemberOverview(quickPanelColumns, memberAccessLevel)}

            <div className="min-w-0 space-y-8">
                <MemberDetailGroup items={typeParameters} prefix="typeParameter" />
                <MemberDetailGroup items={filteredProperties} prefix="property" />
                <MemberDetailGroup items={filteredMethods} prefix="method" />
            </div>
        </section>
    );
}
