// La raíz de composición con los backends simulados de verdad: el BFF completo, de la ruta HTTP
// al backend, sin falsos.
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { crearServidorCatalogo } from '../../backends/catalogo/servidorCatalogo.js';
import { escuchar, type Escuchando } from '../../backends/http.js';
import { crearServidorInventario } from '../../backends/inventario/servidorInventario.js';
import { crearBff, URLS_POR_DEFECTO } from './crearBff.js';

let catalogo: Escuchando;
let inventario: Escuchando;
let bff: Escuchando | undefined;
beforeAll(async () => {
  catalogo = await escuchar(crearServidorCatalogo(), 0);
  inventario = await escuchar(crearServidorInventario(), 0);
});
afterAll(async () => {
  await catalogo.cerrar();
  await inventario.cerrar();
});
afterEach(async () => {
  await bff?.cerrar();
  await Promise.all([catalogo, inventario].map((b) => fetch(`${b.url}/__pruebas/reiniciar`, { method: 'POST' })));
});

const alta = (url: string) =>
  fetch(`${url}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 }),
  });

describe('raíz de composición del BFF', () => {
  it('CATALOGO_URL e INVENTARIO_URL eligen los backends; cada uno recibe su propio formato', async () => {
    bff = await escuchar(crearBff({ CATALOGO_URL: catalogo.url, INVENTARIO_URL: inventario.url }), 0);

    expect((await alta(bff.url)).status).toBe(201);

    expect(await (await fetch(`${catalogo.url}/articulos`)).json()).toMatchObject({ datos: [{ sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 }] });
    expect(await (await fetch(`${inventario.url}/existencias?sku=TEC-001`)).json()).toEqual({ existencias: [{ sku: 'TEC-001', unidades: 8 }] });
    expect(await (await fetch(`${bff.url}/productos`)).json()).toEqual([{ id: expect.any(String), sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 }]);
  });

  it('compensación de punta a punta: con inventario caído, el alta falla con 502 y catalogo queda como estaba', async () => {
    bff = await escuchar(crearBff({ CATALOGO_URL: catalogo.url, INVENTARIO_URL: 'http://127.0.0.1:9' }), 0);

    const respuesta = await alta(bff.url);

    expect(respuesta.status).toBe(502);
    expect(await (await fetch(`${catalogo.url}/articulos`)).json()).toEqual({ datos: [], total: 0 });
  });

  it('sin variables de entorno, los puertos fijos de npm start', () => {
    expect(URLS_POR_DEFECTO).toEqual({ catalogo: 'http://127.0.0.1:4021', inventario: 'http://127.0.0.1:4022' });
  });
});
