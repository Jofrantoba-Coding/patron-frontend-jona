// InterHeaderPageOrganism.ts — JONA Interface + defaults
import { ReactNode } from 'react';

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

export const HEADER_PAGE_ORGANISM_DEFAULTS: Required<Pick<InterHeaderPageOrganism, 'title'>> = {
  title: 'JONA UI',
};
