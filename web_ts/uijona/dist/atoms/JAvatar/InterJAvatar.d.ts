import React from 'react';
export type JAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JAvatarShape = 'circle' | 'square';
export declare const JAVATAR_SIZES: readonly JAvatarSize[];
export declare const JAVATAR_SHAPES: readonly JAvatarShape[];
export interface InterJAvatar {
    src?: string;
    alt?: string;
    initials?: string;
    size?: JAvatarSize;
    shape?: JAvatarShape;
    className?: string;
    style?: React.CSSProperties;
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
export declare const JAVATAR_DEFAULTS: {
    readonly alt: "";
    readonly size: "md";
    readonly shape: "circle";
};
