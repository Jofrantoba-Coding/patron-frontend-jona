// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { revisarOrigen } from './proteccionCsrf';

const ORIGEN = 'http://localhost:4070';
const propia = { 'x-jona-csrf': '1' };

describe('la defensa CSRF del BFF', () => {
  it('acepta una petición del propio cliente: cabecera propia, mismo origen', () => {
    expect(revisarOrigen({ ...propia, origin: ORIGEN, 'sec-fetch-site': 'same-origin' }, ORIGEN)).toEqual({ permitida: true });
  });

  it('acepta la cabecera propia sin Origin ni Sec-Fetch-Site (un cliente que no los envía)', () => {
    expect(revisarOrigen(propia, ORIGEN)).toEqual({ permitida: true });
  });

  it.each([
    ['sin la cabecera propia: un formulario o un enlace de otro sitio', {}],
    ['con la cabecera propia, pero otro valor', { 'x-jona-csrf': 'si' }],
    ['desde otro origen', { ...propia, origin: 'https://atacante.example' }],
    ['desde otro sitio, según Sec-Fetch-Site', { ...propia, 'sec-fetch-site': 'cross-site' }],
    ['desde el mismo sitio pero otro origen (un subdominio)', { ...propia, 'sec-fetch-site': 'same-site' }],
  ])('rechaza: %s', (_caso, cabeceras) => {
    const veredicto = revisarOrigen(cabeceras, ORIGEN);

    expect(veredicto.permitida).toBe(false);
    expect(veredicto.permitida ? '' : veredicto.motivo).not.toBe('');
  });
});
