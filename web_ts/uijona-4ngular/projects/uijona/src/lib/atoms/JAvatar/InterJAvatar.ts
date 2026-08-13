export type JAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JAvatarShape = 'circle' | 'square';

export const JAVATAR_SIZES: readonly JAvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
export const JAVATAR_SHAPES: readonly JAvatarShape[] = ['circle', 'square'];

/** Contrato publico de JAvatar. */
export interface InterJAvatar {
  src?: string;
  alt?: string;
  initials?: string;
  size?: JAvatarSize;
  shape?: JAvatarShape;
}

export const JAVATAR_DEFAULTS = {
  alt: '',
  size: 'md',
  shape: 'circle',
} as const satisfies Required<Pick<InterJAvatar, 'alt' | 'size' | 'shape'>>;

