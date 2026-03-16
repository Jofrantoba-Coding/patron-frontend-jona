// InterUserAvatarMolecule.ts — JONA Interface

export type UserAvatarSize = 'sm' | 'md' | 'lg';

export interface InterUserAvatarMolecule {
  name: string;
  email?: string;
  size?: UserAvatarSize;
  className?: string;
}

export const USER_AVATAR_MOLECULE_DEFAULTS: Required<Pick<InterUserAvatarMolecule, 'size'>> = {
  size: 'md',
};
