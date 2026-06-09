import React from 'react';
export type JImagenFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type JImagenRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type JImagenAspectRatio = 'auto' | 'square' | 'video' | 'wide' | 'portrait';
export declare const JIMAGEN_FITS: readonly JImagenFit[];
export declare const JIMAGEN_RADII: readonly JImagenRadius[];
export declare const JIMAGEN_ASPECT_RATIOS: readonly JImagenAspectRatio[];
export interface InterJImagen {
    src: string;
    alt: string;
    fit?: JImagenFit;
    radius?: JImagenRadius;
    aspectRatio?: JImagenAspectRatio;
    block?: boolean;
    fallbackSrc?: string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'auto' | 'sync';
    className?: string;
    style?: React.CSSProperties;
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
export declare const JIMAGEN_DEFAULTS: {
    readonly fit: "cover";
    readonly radius: "none";
    readonly aspectRatio: "auto";
    readonly block: false;
    readonly loading: "lazy";
    readonly decoding: "async";
};
