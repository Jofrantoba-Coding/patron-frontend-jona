// El adaptador HTTP de inventario contra el backend simulado: la misma suite que el falso.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { escuchar, type Escuchando } from '../../backends/http.js';
import { crearServidorInventario } from '../../backends/inventario/servidorInventario.js';
import { tipoDeError } from '../../test/contratos/contratoCatalogo.js';
import { contratoInventario } from '../../test/contratos/contratoInventario.js';
import { crearInventarioHttp } from './crearInventarioHttp.js';

let backend: Escuchando;
beforeAll(async () => {
  backend = await escuchar(crearServidorInventario(), 0);
});
afterAll(() => backend.cerrar());

contratoInventario('adaptador HTTP contra el backend inventario', async () => {
  await fetch(`${backend.url}/__pruebas/reiniciar`, { method: 'POST' });
  return crearInventarioHttp({ baseUrl: backend.url });
});

describe('adaptador HTTP de inventario: lo que no cubre la suite de contrato', () => {
  it('sin conexión, o con un 500, el error es no-disponible', async () => {
    const caido = crearInventarioHttp({ baseUrl: 'http://127.0.0.1:9', fetch: () => Promise.reject(new TypeError('fetch failed')) });
    const roto = crearInventarioHttp({ baseUrl: '', fetch: async () => new Response(null, { status: 500 }) });

    expect(await tipoDeError(caido.fijar('TEC-001', 1))).toBe('no-disponible');
    expect(await tipoDeError(roto.consultar(['TEC-001']))).toBe('no-disponible');
  });
});
