import React from 'react';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export interface InterAvatarAtom {
    src?: string;
    alt?: string;
    initials?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    className?: string;
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
export declare const AVATAR_ATOM_DEFAULTS: Required<Pick<InterAvatarAtom, 'alt' | 'size' | 'shape'>>;
