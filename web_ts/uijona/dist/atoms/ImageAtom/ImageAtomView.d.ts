import React from 'react';
import { InterImageAtom } from './InterImageAtom';
type ImageAtomViewProps = Omit<InterImageAtom, 'fallbackSrc' | 'onImageError'>;
export declare const ImageAtomView: React.ForwardRefExoticComponent<ImageAtomViewProps & React.RefAttributes<HTMLImageElement>>;
export {};
