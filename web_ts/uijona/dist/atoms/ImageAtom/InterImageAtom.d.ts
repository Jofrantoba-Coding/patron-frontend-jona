import { default as React } from '../../../node_modules/react';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ImageAspectRatio = 'auto' | 'square' | 'video' | 'wide' | 'portrait';
export interface InterImageAtom extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
    src: string;
    alt: string;
    fit?: ImageFit;
    radius?: ImageRadius;
    aspectRatio?: ImageAspectRatio;
    block?: boolean;
    fallbackSrc?: string;
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
export declare const IMAGE_ATOM_DEFAULTS: Required<Pick<InterImageAtom, 'fit' | 'radius' | 'aspectRatio' | 'block' | 'loading' | 'decoding'>>;
