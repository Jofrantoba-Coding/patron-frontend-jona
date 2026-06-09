import React from 'react';
import { InterJAvatar } from './InterJAvatar';
interface JAvatarViewProps extends InterJAvatar {
    forwardedRef?: React.Ref<HTMLDivElement>;
}
export declare const JAvatarView: React.FC<JAvatarViewProps>;
export {};
