export type JUserAvatarSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JUserAvatar. */
export interface InterJUserAvatar {
  name: string;
  email?: string;
  size?: JUserAvatarSize;
}
