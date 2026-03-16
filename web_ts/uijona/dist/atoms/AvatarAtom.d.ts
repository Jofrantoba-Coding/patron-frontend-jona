import React from 'react';
import { InterEventsAvatarAtom } from './events/InterEventsAvatarAtom';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface AvatarAtomProps extends InterEventsAvatarAtom {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    className?: string;
}
export declare const AvatarAtom: React.FC<AvatarAtomProps>;
export {};
