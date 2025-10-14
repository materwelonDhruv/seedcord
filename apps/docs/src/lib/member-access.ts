export const MEMBER_ACCESS_LEVELS = ['public', 'protected', 'private'] as const;

export type MemberAccessLevel = (typeof MEMBER_ACCESS_LEVELS)[number];

export function formatMemberAccessLabel(value: MemberAccessLevel): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const MEMBER_ACCESS_RANK: Record<MemberAccessLevel, number> = {
    public: 0,
    protected: 1,
    private: 2
};
