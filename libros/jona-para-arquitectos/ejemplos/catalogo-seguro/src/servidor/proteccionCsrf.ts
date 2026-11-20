// La defensa CSRF del BFF, para toda petición a /api. La cookie SameSite=Strict ya no viaja desde
// otro sitio, pero OWASP la trata como defensa en profundidad, no como la defensa. Esta es la
// defensa: la cabecera propia obligatoria, y además el origen, si el navegador lo informa.
import type { IncomingHttpHeaders } from 'node:http';
import { CABECERA_CSRF, VALOR_CSRF } from '../compartido/protocolo';

export type Veredicto = { permitida: true } | { permitida: false; motivo: string };

export function revisarOrigen(cabeceras: IncomingHttpHeaders, origenPropio: string): Veredicto {
  if (cabeceras[CABECERA_CSRF.toLowerCase()] !== VALOR_CSRF) {
    return { permitida: false, motivo: `falta la cabecera ${CABECERA_CSRF}` };
  }
  const sitio = cabeceras['sec-fetch-site'];
  if (sitio !== undefined && sitio !== 'same-origin') {
    return { permitida: false, motivo: `Sec-Fetch-Site es ${sitio}, no same-origin` };
  }
  const origen = cabeceras.origin;
  if (origen !== undefined && origen !== origenPropio) {
    return { permitida: false, motivo: `el origen ${origen} no es ${origenPropio}` };
  }
  return { permitida: true };
}
