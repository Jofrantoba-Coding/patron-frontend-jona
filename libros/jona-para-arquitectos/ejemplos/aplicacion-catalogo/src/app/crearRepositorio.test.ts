// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { arrancarServidorProductos, type ServidorProductos } from '../../test/servidorProductos';
import { crearRepositorio } from './crearRepositorio';

let servidor: ServidorProductos;
beforeAll(async () => {
  servidor = await arrancarServidorProductos();
});
afterAll(() => servidor.cerrar());

describe('raíz de composición', () => {
  it('por defecto, el adaptador en memoria con los datos de ejemplo', async () => {
    expect((await crearRepositorio({}).listar()).map((p) => p.sku)).toEqual(['MON-003', 'MOU-002', 'TEC-001']);
  });

  it('VITE_REPOSITORIO=http usa la API REST de VITE_API_URL', async () => {
    const repositorio = crearRepositorio({ VITE_REPOSITORIO: 'http', VITE_API_URL: servidor.url });

    await repositorio.crear({ sku: 'TEC-001', nombre: 'Teclado', precio: 120, stock: 8 });

    expect((await repositorio.listar()).map((p) => p.id)).toEqual(['srv-1']);
  });
});
