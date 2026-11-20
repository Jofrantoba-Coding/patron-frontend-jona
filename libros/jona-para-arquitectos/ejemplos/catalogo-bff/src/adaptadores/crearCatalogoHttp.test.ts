// El adaptador HTTP de catalogo contra el backend simulado: la misma suite que el falso.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearServidorCatalogo } from '../../backends/catalogo/servidorCatalogo.js';
import { escuchar, type Escuchando } from '../../backends/http.js';
import { contratoCatalogo, tipoDeError } from '../../test/contratos/contratoCatalogo.js';
import { crearCatalogoHttp } from './crearCatalogoHttp.js';

let backend: Escuchando;
beforeAll(async () => {
  backend = await escuchar(crearServidorCatalogo(), 0);
});
afterAll(() => backend.cerrar());

contratoCatalogo('adaptador HTTP contra el backend catalogo', async () => {
  await fetch(`${backend.url}/__pruebas/reiniciar`, { method: 'POST' });
  return crearCatalogoHttp({ baseUrl: backend.url });
});

describe('adaptador HTTP de catalogo: lo que no cubre la suite de contrato', () => {
  it('sin conexión, o si catalogo tarda demasiado, el error es no-disponible', async () => {
    const caido = crearCatalogoHttp({ baseUrl: 'http://127.0.0.1:9', fetch: () => Promise.reject(new TypeError('fetch failed')) });
    const lento = crearCatalogoHttp({
      baseUrl: '',
      tiempoLimiteMs: 10,
      fetch: (_url, init) => new Promise((_ok, falla) => init?.signal?.addEventListener('abort', () => falla(init.signal?.reason))),
    });

    expect(await tipoDeError(caido.buscar(''))).toBe('no-disponible');
    expect(await tipoDeError(lento.buscar(''))).toBe('no-disponible');
  });

  it('un 422 que no es SKU_DUPLICADO no es un conflicto: no se inventa una regla', async () => {
    const catalogo = crearCatalogoHttp({
      baseUrl: '',
      fetch: async () => new Response(JSON.stringify({ falla: { tipo: 'PRECIO_FUERA_DE_RANGO' } }), { status: 422 }),
    });

    expect(await tipoDeError(catalogo.crear({ sku: 'TEC-001', titulo: 'Teclado', precioCentimos: 1 }))).toBe('no-disponible');
  });
});
