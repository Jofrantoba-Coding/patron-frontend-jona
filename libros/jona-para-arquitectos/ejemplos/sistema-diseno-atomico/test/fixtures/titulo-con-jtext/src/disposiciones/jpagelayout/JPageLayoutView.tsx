// Violación de la regla 5: la versión 1.0.0 de la disposición. El <h1> sale de un átomo de texto,
// que no separa el nivel del tamaño: para que un título se vea más pequeño hay que bajarle el nivel.
import { JText } from '../../atomos/jtext/index.js';
import { INLINE, STACK } from '../../tema/clasesToken.js';

export function JPageLayoutView({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={STACK}>
      <header className={INLINE}>
        <JText as="h1">{title}</JText>
      </header>
      <main className={STACK}>{children}</main>
    </div>
  );
}
