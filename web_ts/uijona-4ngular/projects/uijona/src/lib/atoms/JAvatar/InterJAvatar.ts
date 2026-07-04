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

export const JAVATAR_SIZE_CLASSES: Record<JAvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

export const JAVATAR_SHAPE_CLASSES: Record<JAvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};
