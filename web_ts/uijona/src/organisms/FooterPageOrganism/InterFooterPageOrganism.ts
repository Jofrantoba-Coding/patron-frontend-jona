// InterFooterPageOrganism.ts — JONA Interface + defaults
import { ReactNode } from 'react';

export interface InterFooterPageOrganism {
  /** Copyright / main text */
  text?: ReactNode;
  /** Left slot (logo, brand) */
  left?: ReactNode;
  /** Center slot (links, etc.) */
  center?: ReactNode;
  /** Right slot (social icons, version, etc.) */
  right?: ReactNode;
  /** Extra CSS classes */
  className?: string;
}

export const FOOTER_PAGE_ORGANISM_DEFAULTS: Required<Pick<InterFooterPageOrganism, 'text'>> = {
  text: '© 2026 JONA UI',
};
