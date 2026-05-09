import { ReactNode } from '../../../node_modules/react';

export interface InterHeaderPageOrganism {
    /** App title or logo node */
    title?: ReactNode;
    /** Navigation slot (links, menu, etc.) */
    nav?: ReactNode;
    /** Right-side actions slot (user avatar, buttons, etc.) */
    actions?: ReactNode;
    /** Extra CSS classes */
    className?: string;
}
export declare const HEADER_PAGE_ORGANISM_DEFAULTS: Required<Pick<InterHeaderPageOrganism, 'title'>>;
