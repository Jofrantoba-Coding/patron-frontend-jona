// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { CABECERAS_API, cabecerasDocumento, generarNonce } from './cabeceras';
import { MARCA_NONCE, componerDocumento } from './documento';

describe('las cabeceras de seguridad', () => {
  it('la CSP del documento es estricta: nonce, strict-dynamic, sin object ni base, sin marcos', () => {
    const csp = cabecerasDocumento('abc123')['Content-Security-Policy'];

    expect(csp.split('; ')).toEqual([
      "script-src 'nonce-abc123' 'strict-dynamic'",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
    ]);
  });

  it('cada respuesta tiene un nonce nuevo de 128 bits', () => {
    const nonces = Array.from({ length: 50 }, generarNonce);

    expect(new Set(nonces).size).toBe(50);
    expect(nonces.every((n) => Buffer.from(n, 'base64').length === 16)).toBe(true);
  });

  it('documento y API: nosniff, Referrer-Policy y COOP, y nada se guarda en caché', () => {
    for (const cabeceras of [cabecerasDocumento('n'), CABECERAS_API]) {
      expect(cabeceras).toMatchObject({
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cache-Control': 'no-store',
      });
    }
  });
});

describe('el documento con su nonce', () => {
  const plantilla = `<meta property="csp-nonce" nonce="${MARCA_NONCE}" /><script type="module" nonce="${MARCA_NONCE}" src="/assets/a.js"></script>`;

  it('reemplaza cada marca por el nonce de esta respuesta', () => {
    const html = componerDocumento(plantilla, 'Zm9v');

    expect(html).not.toContain(MARCA_NONCE);
    expect(html.match(/nonce="Zm9v"/g)).toHaveLength(2);
  });

  it('un nonce que no es base64 no llega al HTML', () => {
    expect(() => componerDocumento(plantilla, '"><script>')).toThrow();
  });
});
