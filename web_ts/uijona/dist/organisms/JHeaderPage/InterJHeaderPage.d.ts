import { ReactNode } from 'react';
export interface InterJHeaderPage {
    /** App title or logo node */
    title?: ReactNode;
    /** Navigation slot (links, menu, etc.) */
    nav?: ReactNode;
    /** Right-side actions slot (user avatar, buttons, etc.) */
    actions?: ReactNode;
    /** Extra CSS classes */
    className?: string;
}
export declare const JHEADER_PAGE_DEFAULTS: Required<Pick<InterJHeaderPage, 'title'>>;
