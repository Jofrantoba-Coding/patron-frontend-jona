// Suite de contrato del consumidor: lo que el BFF necesita de catalogo, escrito por el BFF. Corre
// contra el falso y contra el adaptador HTTP con el backend simulado: si los dos la pasan, las
// pruebas de los manejadores (que usan el falso) dicen la verdad sobre el sistema real.
import { beforeEach, describe, expect, it } from 'vitest';
import { ErrorBackend } from '../../src/puertos/ErrorBackend.js';
import type { DatosArticulo, InterCatalogo } from '../../src/puertos/InterCatalogo.js';

const TECLADO: DatosArticulo = { sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 };
const MOUSE: DatosArticulo = { sku: 'MOU-002', titulo: 'Mouse inalámbrico', precioCentimos: 4550 };

export const tipoDeError = (promesa: Promise<unknown>) =>
  promesa.then(
    () => 'sin error',
    (e: unknown) => (e instanceof ErrorBackend ? e.tipo : `otro error: ${String(e)}`),
  );

/** `crear` entrega un catalogo vacío para cada prueba. */
export function contratoCatalogo(nombre: string, crear: () => Promise<InterCatalogo> | InterCatalogo) {
  describe(`contrato de InterCatalogo: ${nombre}`, () => {
    let catalogo: InterCatalogo;
    beforeEach(async () => {
      catalogo = await crear();
    });

    it('crear asigna un código, y buscar devuelve los artículos ordenados por SKU', async () => {
      const teclado = await catalogo.crear(TECLADO);
      await catalogo.crear(MOUSE);

      expect(teclado).toEqual({ ...TECLADO, codigoArticulo: expect.any(String) });
      expect((await catalogo.buscar('')).map((a) => a.sku)).toEqual(['MOU-002', 'TEC-001']);
    });

    it('buscar filtra por título o por SKU, sin distinguir mayúsculas', async () => {
      await catalogo.crear(TECLADO);
      await catalogo.crear(MOUSE);

      expect((await catalogo.buscar('INALÁM')).map((a) => a.sku)).toEqual(['MOU-002']);
      expect((await catalogo.buscar('tec-')).map((a) => a.sku)).toEqual(['TEC-001']);
    });

    it('obtener devuelve el artículo, o undefined si no existe', async () => {
      const teclado = await catalogo.crear(TECLADO);

      expect(await catalogo.obtener(teclado.codigoArticulo)).toEqual(teclado);
      expect(await catalogo.obtener('no-existe')).toBeUndefined();
    });

    it('crear con un SKU que ya existe es un conflicto: lo decide catalogo', async () => {
      await catalogo.crear(TECLADO);

      expect(await tipoDeError(catalogo.crear({ ...MOUSE, sku: 'TEC-001' }))).toBe('conflicto');
    });

    it('actualizar conserva el código; con el SKU de otro artículo es un conflicto', async () => {
      const teclado = await catalogo.crear(TECLADO);
      await catalogo.crear(MOUSE);

      expect(await catalogo.actualizar(teclado.codigoArticulo, { ...TECLADO, precioCentimos: 9990 }))
        .toEqual({ ...TECLADO, precioCentimos: 9990, codigoArticulo: teclado.codigoArticulo });
      expect(await tipoDeError(catalogo.actualizar(teclado.codigoArticulo, { ...TECLADO, sku: 'MOU-002' }))).toBe('conflicto');
    });

    it('actualizar o eliminar un código que no existe es no-encontrado', async () => {
      expect(await tipoDeError(catalogo.actualizar('no-existe', TECLADO))).toBe('no-encontrado');
      expect(await tipoDeError(catalogo.eliminar('no-existe'))).toBe('no-encontrado');
    });

    it('eliminar quita el artículo', async () => {
      const teclado = await catalogo.crear(TECLADO);

      await catalogo.eliminar(teclado.codigoArticulo);

      expect(await catalogo.buscar('')).toEqual([]);
    });

    it('el precio viaja en céntimos enteros, sin pérdida', async () => {
      const mouse = await catalogo.crear(MOUSE);

      expect((await catalogo.obtener(mouse.codigoArticulo))?.precioCentimos).toBe(4550);
    });
  });
}
