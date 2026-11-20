// Los dos backends de negocio simulados, cada uno con su formato propio. Estas pruebas fijan lo que
// el BFF tiene que traducir: céntimos y no soles, `titulo` y no `nombre`, un 422 con `falla.tipo`
// en lugar de un 409, y un inventario que solo sabe de SKU y unidades.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { crearServidorCatalogo, type ArticuloCatalogo } from './catalogo/servidorCatalogo.js';
import { escuchar, type Escuchando } from './http.js';
import { crearServidorInventario } from './inventario/servidorInventario.js';

const json = { 'Content-Type': 'application/json' };

describe('backend catalogo', () => {
  let catalogo: Escuchando;
  beforeAll(async () => {
    catalogo = await escuchar(crearServidorCatalogo(), 0);
  });
  afterAll(() => catalogo.cerrar());
  beforeEach(() => fetch(`${catalogo.url}/__pruebas/reiniciar`, { method: 'POST' }));

  const alta = (cuerpo: unknown) => fetch(`${catalogo.url}/articulos`, { method: 'POST', headers: json, body: JSON.stringify(cuerpo) });

  it('guarda el precio en céntimos y el nombre como título, con un código propio', async () => {
    const respuesta = await alta({ sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 });

    expect(respuesta.status).toBe(201);
    expect(await respuesta.json()).toEqual({ codigoArticulo: expect.stringMatching(/^ART-\d{4}$/), sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 });
  });

  it('la unicidad del SKU es su regla: responde 422 con su propio formato de falla', async () => {
    await alta({ sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 });

    const respuesta = await alta({ sku: 'TEC-001', titulo: 'Otro', precioCentimos: 100 });

    expect(respuesta.status).toBe(422);
    expect(await respuesta.json()).toEqual({ falla: { tipo: 'SKU_DUPLICADO', detalle: 'El SKU TEC-001 ya está registrado' } });
  });

  it('lista en un sobre { datos, total }, y la baja responde 200 con lo eliminado', async () => {
    const { codigoArticulo } = (await (await alta({ sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 })).json()) as ArticuloCatalogo;

    expect(await (await fetch(`${catalogo.url}/articulos?texto=tecl`)).json()).toMatchObject({ total: 1 });
    const baja = await fetch(`${catalogo.url}/articulos/${codigoArticulo}`, { method: 'DELETE' });
    expect([baja.status, await baja.json()]).toEqual([200, { eliminado: codigoArticulo }]);
  });

  it('la ruta de solo prueba lo vacía', async () => {
    await alta({ sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 });

    await fetch(`${catalogo.url}/__pruebas/reiniciar`, { method: 'POST' });

    expect(await (await fetch(`${catalogo.url}/articulos`)).json()).toEqual({ datos: [], total: 0 });
  });
});

describe('backend inventario', () => {
  let inventario: Escuchando;
  beforeAll(async () => {
    inventario = await escuchar(crearServidorInventario(), 0);
  });
  afterAll(() => inventario.cerrar());
  beforeEach(() => fetch(`${inventario.url}/__pruebas/reiniciar`, { method: 'POST' }));

  const fijar = (sku: string, cuerpo: unknown) => fetch(`${inventario.url}/existencias/${sku}`, { method: 'PUT', headers: json, body: JSON.stringify(cuerpo) });

  it('guarda unidades por SKU y las consulta en lote', async () => {
    await fijar('TEC-001', { unidades: 8 });
    await fijar('MOU-002', { unidades: 20 });

    const respuesta = await fetch(`${inventario.url}/existencias?sku=TEC-001&sku=AUD-004`);

    expect(await respuesta.json()).toEqual({ existencias: [{ sku: 'TEC-001', unidades: 8 }] });
  });

  it('sus errores tienen otro formato: { codigo, mensaje }', async () => {
    const invalida = await fijar('TEC-001', { unidades: -1 });
    const inexistente = await fetch(`${inventario.url}/existencias/NADA-000`, { method: 'DELETE' });

    expect([invalida.status, await invalida.json()]).toEqual([400, { codigo: 'UNIDADES_INVALIDAS', mensaje: expect.any(String) }]);
    expect([inexistente.status, await inexistente.json()]).toEqual([404, { codigo: 'SIN_EXISTENCIA', mensaje: expect.any(String) }]);
  });
});
