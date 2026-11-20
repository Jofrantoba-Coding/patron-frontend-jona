import { JHeading } from '../../atomos/jheading/index.js';
import { FG, INLINE, PAD, STACK, SURFACE, clases } from '../../tema/clasesToken.js';
import type { InterJPageLayout } from './InterJPageLayout.js';

/**
 * Vista: la disposición de una página; render puro. Dos puntos de referencia, <header> con el
 * único <h1> y <main> con el contenido: un lector de pantalla salta de uno a otro, y el título de
 * la página es el primer título del documento.
 */
export function JPageLayoutView({ title, actions, children }: InterJPageLayout) {
  return (
    <div className={clases(SURFACE, FG, PAD, STACK)}>
      <header className={INLINE}>
        <JHeading level={1}>{title}</JHeading>
        {actions && <div className={INLINE}>{actions}</div>}
      </header>
      <main className={STACK}>{children}</main>
    </div>
  );
}
