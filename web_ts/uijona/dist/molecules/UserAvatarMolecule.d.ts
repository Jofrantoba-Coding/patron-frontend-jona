import React from 'react';
type AvatarSize = 'sm' | 'md' | 'lg';
interface UserAvatarMoleculeProps {
    name: string;
    email?: string;
    size?: AvatarSize;
    className?: string;
}
export declare const UserAvatarMolecule: React.FC<UserAvatarMoleculeProps>;
export {};
