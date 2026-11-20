// Falso de inventario: un adaptador en memoria del puerto, para las pruebas de los manejadores.
import { ErrorBackend } from '../../src/puertos/ErrorBackend.js';
import type { Existencia, InterInventario } from '../../src/puertos/InterInventario.js';

export function crearInventarioFalso(semilla: readonly Existencia[] = []): InterInventario {
  const unidades = new Map(semilla.map((e) => [e.sku, e.unidades]));

  return {
    async consultar(skus) {
      return skus.filter((sku) => unidades.has(sku)).map((sku) => ({ sku, unidades: unidades.get(sku) as number }));
    },
    async fijar(sku, valor) {
      unidades.set(sku, valor);
      return { sku, unidades: valor };
    },
    async eliminar(sku) {
      if (!unidades.delete(sku)) throw new ErrorBackend('no-encontrado', `No hay existencias de ${sku}`);
    },
  };
}
