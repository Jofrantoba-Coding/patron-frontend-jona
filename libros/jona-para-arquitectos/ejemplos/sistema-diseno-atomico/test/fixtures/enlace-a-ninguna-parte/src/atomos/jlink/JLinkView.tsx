// Violación de la regla 6: el href existe, pero es el ancla vacía; la navegación real la hace el manejador.
import { LINK } from '../../tema/clasesToken.js';

export function JLinkView({ children, onNavegar }: { children: React.ReactNode; onNavegar: () => void }) {
  return <a href="#" className={LINK} onClick={onNavegar}>{children}</a>;
}
