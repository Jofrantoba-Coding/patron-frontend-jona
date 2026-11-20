// La capa HTTP del BFF con manejadores sobre los falsos: rutas de la API de productos y
// normalización de errores al formato que mapea el adaptador de la SPA (404, 409 y cualquier otro).
import type { Server } from 'node:http';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { escuchar, type Escuchando } from '../../backends/http.js';
import { crearCatalogoFalso } from '../../test/falsos/crearCatalogoFalso.js';
import { crearInventarioFalso } from '../../test/falsos/crearInventarioFalso.js';
import type { InterApiProductos, Producto } from '../api/InterApiProductos.js';
import { crearManejadoresProductos, type PuertosBff } from '../manejadores/crearManejadoresProductos.js';
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import { crearServidorBff } from './crearServidorBff.js';

const ARTICULO = { codigoArticulo: 'ART-0001', sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 };
const json = { 'Content-Type': 'application/json' };

let bff: Escuchando | undefined;
afterEach(() => bff?.cerrar());

/** Arranca el BFF sobre los falsos; `preparar` puede espiarlos para provocar fallas. */
async function arrancar(preparar?: (puertos: PuertosBff) => void, crear: (api: InterApiProductos) => Server = crearServidorBff) {
  const puertos: PuertosBff = { catalogo: crearCatalogoFalso([ARTICULO]), inventario: crearInventarioFalso([{ sku: 'TEC-001', unidades: 8 }]) };
  preparar?.(puertos);
  bff = await escuchar(crear(crearManejadoresProductos(puertos)), 0);
  return bff.url;
}

describe('servidor del BFF: la API REST de productos', () => {
  it('GET /productos?q= devuelve los productos compuestos, en JSON', async () => {
    const url = await arrancar();

    const respuesta = await fetch(`${url}/productos?q=tecl`);

    expect(respuesta.status).toBe(200);
    expect(await respuesta.json()).toEqual([{ id: 'ART-0001', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 }]);
  });

  it('POST responde 201 con el producto; DELETE, 204 sin cuerpo', async () => {
    const url = await arrancar();

    const alta = await fetch(`${url}/productos`, { method: 'POST', headers: json, body: JSON.stringify({ sku: 'MOU-002', nombre: 'Mouse', precio: 45.5, stock: 20 }) });
    const { id } = (await alta.json()) as Producto;
    const baja = await fetch(`${url}/productos/${id}`, { method: 'DELETE' });

    expect(alta.status).toBe(201);
    expect([baja.status, await baja.text()]).toEqual([204, '']);
  });

  it('normaliza los errores: no-encontrado es 404, conflicto es 409, no-disponible es 502', async () => {
    const url = await arrancar(({ inventario }) => {
      vi.spyOn(inventario, 'fijar').mockRejectedValue(new ErrorBackend('no-disponible'));
    });
    const alta = (sku: string) => fetch(`${url}/productos`, { method: 'POST', headers: json, body: JSON.stringify({ sku, nombre: 'Otro', precio: 1, stock: 1 }) });

    const inexistente = await fetch(`${url}/productos/no-existe`);
    const conflicto = await alta('TEC-001');
    const caido = await alta('AUD-004');

    expect([inexistente.status, conflicto.status, caido.status]).toEqual([404, 409, 502]);
    expect(await conflicto.json()).toEqual({ error: 'conflicto', mensaje: 'El SKU TEC-001 ya está registrado' });
  });

  it('un error inesperado es 500 y no expone su mensaje', async () => {
    const registro = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    onTestFinished(() => registro.mockRestore());
    const url = await arrancar(({ catalogo }) => {
      vi.spyOn(catalogo, 'buscar').mockRejectedValue(new Error('detalle interno del servidor'));
    });

    const respuesta = await fetch(`${url}/productos`);

    expect(respuesta.status).toBe(500);
    expect(await respuesta.text()).not.toContain('detalle interno');
  });

  it('un cuerpo que no es JSON es 400; una ruta desconocida, 404', async () => {
    const url = await arrancar();

    const invalido = await fetch(`${url}/productos`, { method: 'POST', headers: json, body: '{no es json' });
    const desconocida = await fetch(`${url}/clientes`);

    expect([invalido.status, desconocida.status]).toEqual([400, 404]);
  });

  it('responde la verificación previa de CORS, para la SPA servida desde otro origen en desarrollo', async () => {
    const url = await arrancar(undefined, (manejadores) => crearServidorBff(manejadores, { origenPermitido: 'http://localhost:5173' }));

    const respuesta = await fetch(`${url}/productos`, { method: 'OPTIONS' });

    expect(respuesta.status).toBe(204);
    expect(respuesta.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
    expect(respuesta.headers.get('access-control-allow-methods')).toContain('DELETE');
  });

  it('no expone rutas de solo prueba: el reinicio es de los backends, no del BFF', async () => {
    const url = await arrancar();

    expect((await fetch(`${url}/__pruebas/reiniciar`, { method: 'POST' })).status).toBe(404);
  });
});
