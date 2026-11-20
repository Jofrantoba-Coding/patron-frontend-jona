// Suite de contrato del puerto (copia del capítulo 14): las mismas pruebas para cada adaptador.
import { beforeEach, describe, expect, it } from 'vitest';
import { ErrorRepositorio } from '../src/servidor/ErrorRepositorio';
import type { InterProductoRepositorio } from '../src/servidor/InterProductoRepositorio';
import type { DatosProducto } from '../src/dominio/Producto';

const TECLADO: DatosProducto = { sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 };
const MOUSE: DatosProducto = { sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 };

const tipoDeError = (promesa: Promise<unknown>) =>
  promesa.then(
    () => 'sin error',
    (e: unknown) => (e instanceof ErrorRepositorio ? e.tipo : `otro error: ${String(e)}`),
  );

/** `crear` entrega un repositorio vacío para cada prueba. */
export function contratoRepositorio(nombre: string, crear: () => Promise<InterProductoRepositorio> | InterProductoRepositorio) {
  describe(`contrato de InterProductoRepositorio: ${nombre}`, () => {
    let repositorio: InterProductoRepositorio;
    beforeEach(async () => {
      repositorio = await crear();
    });

    it('crear asigna un id, y listar devuelve los productos ordenados por SKU', async () => {
      const teclado = await repositorio.crear(TECLADO);
      await repositorio.crear(MOUSE);

      expect(teclado).toEqual({ ...TECLADO, id: expect.any(String) });
      expect((await repositorio.listar()).map((p) => p.sku)).toEqual(['MOU-002', 'TEC-001']);
    });

    it('listar filtra por nombre o por SKU, sin distinguir mayúsculas', async () => {
      await repositorio.crear(TECLADO);
      await repositorio.crear(MOUSE);

      expect((await repositorio.listar('INALÁM')).map((p) => p.sku)).toEqual(['MOU-002']);
      expect((await repositorio.listar('tec-')).map((p) => p.sku)).toEqual(['TEC-001']);
    });

    it('obtener devuelve el producto, o undefined si no existe', async () => {
      const teclado = await repositorio.crear(TECLADO);

      expect(await repositorio.obtener(teclado.id)).toEqual(teclado);
      expect(await repositorio.obtener('no-existe')).toBeUndefined();
    });

    it('crear con un SKU que ya existe es un conflicto', async () => {
      await repositorio.crear(TECLADO);

      expect(await tipoDeError(repositorio.crear({ ...MOUSE, sku: 'TEC-001' }))).toBe('conflicto');
    });

    it('actualizar cambia los datos y conserva el id', async () => {
      const teclado = await repositorio.crear(TECLADO);

      const actualizado = await repositorio.actualizar(teclado.id, { ...TECLADO, precio: 99.9 });

      expect(actualizado).toEqual({ ...TECLADO, precio: 99.9, id: teclado.id });
      expect(await repositorio.obtener(teclado.id)).toEqual(actualizado);
    });

    it('actualizar con el SKU de otro producto es un conflicto; con el propio, no', async () => {
      const teclado = await repositorio.crear(TECLADO);
      await repositorio.crear(MOUSE);

      expect(await tipoDeError(repositorio.actualizar(teclado.id, { ...TECLADO, sku: 'MOU-002' }))).toBe('conflicto');
      expect(await tipoDeError(repositorio.actualizar(teclado.id, { ...TECLADO, stock: 1 }))).toBe('sin error');
    });

    it('actualizar o eliminar un id que no existe es no-encontrado', async () => {
      expect(await tipoDeError(repositorio.actualizar('no-existe', TECLADO))).toBe('no-encontrado');
      expect(await tipoDeError(repositorio.eliminar('no-existe'))).toBe('no-encontrado');
    });

    it('eliminar quita el producto', async () => {
      const teclado = await repositorio.crear(TECLADO);

      await repositorio.eliminar(teclado.id);

      expect(await repositorio.listar()).toEqual([]);
    });

    it('lo que devuelve es una copia: modificarla no cambia lo guardado', async () => {
      const teclado = await repositorio.crear(TECLADO);
      teclado.stock = 0;

      expect((await repositorio.obtener(teclado.id))?.stock).toBe(8);
    });
  });
}
