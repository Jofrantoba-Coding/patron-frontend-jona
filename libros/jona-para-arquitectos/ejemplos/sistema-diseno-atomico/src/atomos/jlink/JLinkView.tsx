import { FOCUS_RING, LINK, clases } from '../../tema/clasesToken.js';
import type { InterJLink } from './InterJLink.js';

/** Vista: render puro. Siempre un <a href> (regla 6). */
export function JLinkView({ children, href, rel, 'aria-current': ariaCurrent, 'aria-label': ariaLabel }: InterJLink) {
  return (
    <a href={href} rel={rel} aria-current={ariaCurrent} aria-label={ariaLabel} className={clases(LINK, FOCUS_RING)}>
      {children}
    </a>
  );
}
