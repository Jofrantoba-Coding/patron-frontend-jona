import React from 'react';
import { InterAvatarAtom } from './InterAvatarAtom';
interface AvatarAtomViewProps extends InterAvatarAtom {
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
export declare const AvatarAtomView: React.FC<AvatarAtomViewProps>;
export {};
