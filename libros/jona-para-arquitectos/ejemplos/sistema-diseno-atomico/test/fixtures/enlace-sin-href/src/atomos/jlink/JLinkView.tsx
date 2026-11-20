// Violación de la regla 6: un enlace que navega con un manejador y no tiene href.
import { LINK } from '../../tema/clasesToken.js';

export function JLinkView({ children, onNavegar }: { children: React.ReactNode; onNavegar: () => void }) {
  return <a className={LINK} onClick={onNavegar}>{children}</a>;
}
