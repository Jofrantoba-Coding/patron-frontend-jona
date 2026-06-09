// InterJFooterPage.ts — JONA Interface + defaults
import { ReactNode } from 'react';

export interface InterJFooterPage {
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

export const JFOOTER_PAGE_DEFAULTS: Required<Pick<InterJFooterPage, 'text'>> = {
  text: '© 2026 JONA UI',
};
