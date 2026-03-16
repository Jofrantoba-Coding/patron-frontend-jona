export type UserAvatarSize = 'sm' | 'md' | 'lg';
export interface InterUserAvatarMolecule {
    name: string;
    email?: string;
    size?: UserAvatarSize;
    className?: string;
}
export declare const USER_AVATAR_MOLECULE_DEFAULTS: Required<Pick<InterUserAvatarMolecule, 'size'>>;
