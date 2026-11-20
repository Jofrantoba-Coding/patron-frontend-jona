import type { JLinkHref } from '@jona-libro/ds-atomico';
import { describe, expect, it } from 'vitest';
import { aUrlSegura, type UrlSegura } from './UrlSegura';

describe('UrlSegura', () => {
  it('acepta http y https, normalizadas por el analizador de URL', () => {
    expect(aUrlSegura('https://fabricante.example/teclados')).toBe('https://fabricante.example/teclados');
    expect(aUrlSegura('HTTP://Fabricante.example')).toBe('http://fabricante.example/');
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '/una/ruta/relativa',
    'no es una URL',
    '',
  ])('rechaza %j', (texto) => {
    expect(aUrlSegura(texto)).toBeUndefined();
  });

  it('un texto no es una UrlSegura sin pasar por aUrlSegura, y una UrlSegura sirve de href para JLink', () => {
    const texto: string = 'https://fabricante.example';
    // @ts-expect-error un string cualquiera no compila donde el contrato pide una UrlSegura.
    const sinValidar: UrlSegura = texto;
    const href: JLinkHref | undefined = aUrlSegura(texto);

    expect([sinValidar, href]).toEqual([texto, 'https://fabricante.example/']);
  });
});
