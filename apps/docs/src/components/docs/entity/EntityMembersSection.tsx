'use client';

import { useMemo, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import MemberAccessControls from '@/components/docs/entity/member/MemberAccessControls';

import { useUIStore, type UIStore } from '@store/ui';

import { MemberDetailGroup } from './member/MemberDetailGroup';
import { MemberList } from './member/MemberList';
import { renderMemberOverview } from './utils/renderers/renderMemberOverview';
import { shouldIncludeMember } from './utils/shouldIncludeMember';
import { useMemberNavigation } from './utils/useMemberNavigation';

import type { EntityMemberSummary } from './types';

export interface EntityMembersSectionProps {
    properties: readonly EntityMemberSummary[];
    methods: readonly EntityMemberSummary[];
    constructors: readonly EntityMemberSummary[];
    typeParameters?: readonly EntityMemberSummary[];
    showAccessControls?: boolean;
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
