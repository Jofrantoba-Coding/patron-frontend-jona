// Manejadores del BFF: implementan la API de productos que espera la SPA componiendo dos
// backends. Dependen solo de los puertos (regla 1 de test/architecture) y no deciden ninguna
// regla de negocio (regla 3): agregan, traducen formatos y compensan.
import type { DatosProducto, InterApiProductos, Producto } from '../api/InterApiProductos.js';
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import type { Articulo, DatosArticulo, InterCatalogo } from '../puertos/InterCatalogo.js';
import type { InterInventario } from '../puertos/InterInventario.js';

export interface PuertosBff {
  catalogo: InterCatalogo;
  inventario: InterInventario;
}

// Traducción de modelos: catalogo habla de artículos, títulos y céntimos; la SPA, de productos,
// nombres y soles. El stock llega de otro backend.
const aProducto = (articulo: Articulo, unidades = 0): Producto => ({
  id: articulo.codigoArticulo,
  sku: articulo.sku,
  nombre: articulo.titulo,
  precio: articulo.precioCentimos / 100,
  stock: unidades,
});

const aArticulo = (datos: DatosProducto): DatosArticulo => ({
  sku: datos.sku,
  titulo: datos.nombre,
  precioCentimos: Math.round(datos.precio * 100),
});

const sinCodigo = ({ sku, titulo, precioCentimos }: Articulo): DatosArticulo => ({ sku, titulo, precioCentimos });

export function crearManejadoresProductos({ catalogo, inventario }: PuertosBff): InterApiProductos {
  /** Las unidades de varios SKU con una sola llamada a inventario. Un Map une; no busca. */
  async function unidadesDe(articulos: readonly Articulo[]): Promise<Map<string, number>> {
    const existencias = await inventario.consultar(articulos.map((a) => a.sku));
    return new Map(existencias.map((e) => [e.sku, e.unidades]));
  }

  /** Deshace un paso ya hecho. Si tampoco se puede, el error lo dice: queda un dato a revisar. */
  async function compensar(motivo: string, paso: 'el alta' | 'el cambio', deshacer: () => Promise<unknown>): Promise<never> {
    try {
      await deshacer();
    } catch {
      throw new ErrorBackend('no-disponible', `${motivo}, y ${paso} no se pudo deshacer`);
    }
    throw new ErrorBackend('no-disponible', `${motivo}; ${paso} se deshizo`);
  }

  async function existente(id: string): Promise<Articulo> {
    const articulo = await catalogo.obtener(id);
    if (!articulo) throw new ErrorBackend('no-encontrado', `No existe el producto ${id}`);
    return articulo;
  }

  return {
    async listar(termino = '') {
      // Qué coincide con el término lo decide catalogo, como el orden por SKU.
      const articulos = await catalogo.buscar(termino);
      const unidades = await unidadesDe(articulos);
      return articulos.map((a) => aProducto(a, unidades.get(a.sku)));
    },

    async obtener(id) {
      const articulo = await catalogo.obtener(id);
      if (!articulo) return undefined;
      return aProducto(articulo, (await unidadesDe([articulo])).get(articulo.sku));
    },

    async crear(datos) {
      // Primero catalogo: si el SKU ya existe, catalogo responde el conflicto y aquí termina.
      const articulo = await catalogo.crear(aArticulo(datos));
      try {
        const existencia = await inventario.fijar(articulo.sku, datos.stock);
        return aProducto(articulo, existencia.unidades);
      } catch {
        // Inventario falló: sin compensación quedaría un producto sin stock que la SPA no pidió.
        return compensar('inventario no registró el stock', 'el alta', () => catalogo.eliminar(articulo.codigoArticulo));
      }
    },

    async actualizar(id, datos) {
      const anterior = await existente(id);
      const articulo = await catalogo.actualizar(id, aArticulo(datos));
      let unidades: number;
      try {
        unidades = (await inventario.fijar(articulo.sku, datos.stock)).unidades;
      } catch {
        return compensar('inventario no registró el stock', 'el cambio', () => catalogo.actualizar(id, sinCodigo(anterior)));
      }
      // El registro del SKU anterior ya no corresponde a nada. Si no se puede quitar, queda
      // huérfano: nadie lo lista, porque la lista la manda catalogo.
      if (anterior.sku !== articulo.sku) await inventario.eliminar(anterior.sku).catch(() => undefined);
      return aProducto(articulo, unidades);
    },

    async eliminar(id) {
      const articulo = await existente(id);
      // Primero catalogo: después de este paso el producto ya no existe para la SPA, y lo único
      // que puede fallar (quitar sus unidades) deja un registro huérfano que nadie ve.
      await catalogo.eliminar(id);
      await inventario.eliminar(articulo.sku).catch(() => undefined);
    },
  };
}
