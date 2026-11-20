import { FG, HEADING_LG, HEADING_MD, HEADING_SM, HEADING_XL, clases } from '../../tema/clasesToken.js';
import type { InterJHeading } from './InterJHeading.js';

const TAMANOS = { xl: HEADING_XL, lg: HEADING_LG, md: HEADING_MD, sm: HEADING_SM } as const;
const TAMANO_DEL_NIVEL = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'sm', 5: 'sm', 6: 'sm' } as const;

/** Vista: render puro. La única del sistema de diseño que dibuja <h1>…<h6> (regla 5). */
export function JHeadingView({ children, id, level, size = TAMANO_DEL_NIVEL[level] }: InterJHeading) {
  const Elemento = `h${level}` as const;
  return (
    <Elemento id={id} className={clases(FG, TAMANOS[size])}>
      {children}
    </Elemento>
  );
}
