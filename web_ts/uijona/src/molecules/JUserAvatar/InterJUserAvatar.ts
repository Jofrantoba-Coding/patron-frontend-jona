// InterJUserAvatar.ts — JONA Interface
export type JUserAvatarSize = 'sm' | 'md' | 'lg';

export interface InterJUserAvatar {
  name:       string;
  email?:     string;
  size?:      JUserAvatarSize;
  className?: string;
}

export const JUSERAVATAR_DEFAULTS: Required<Pick<InterJUserAvatar, 'size'>> = {
  size: 'md',
};
