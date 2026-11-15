import { JText } from '../../atomos/jtext/index.js';
import { FG, INLINE, PAD, STACK, SURFACE, clases } from '../../tema/clasesToken.js';
import type { InterJPageLayout } from './InterJPageLayout.js';

/** Vista: la disposición de una página con encabezado y contenido; render puro. */
export function JPageLayoutView({ title, actions, children }: InterJPageLayout) {
  return (
    <div className={clases(SURFACE, FG, PAD, STACK)}>
      <header className={INLINE}>
        <JText as="h1">{title}</JText>
        {actions && <div className={INLINE}>{actions}</div>}
      </header>
      <main className={STACK}>{children}</main>
    </div>
  );
}
