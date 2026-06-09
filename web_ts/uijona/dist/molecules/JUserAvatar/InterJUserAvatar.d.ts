export type JUserAvatarSize = 'sm' | 'md' | 'lg';
export interface InterJUserAvatar {
    name: string;
    email?: string;
    size?: JUserAvatarSize;
    className?: string;
}
export declare const JUSERAVATAR_DEFAULTS: Required<Pick<InterJUserAvatar, 'size'>>;
