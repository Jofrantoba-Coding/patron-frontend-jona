// Servidor de productos para las pruebas del adaptador HTTP (copia del capítulo 14): la API REST
// que implementaría el backend, o el BFF de ../catalogo-bff.
import { createServer, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';

interface ProductoGuardado {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  stock: number;
}

export interface ServidorProductos {
  url: string;
  vaciar: () => void;
  cerrar: () => Promise<void>;
}

const leerCuerpo = async (peticion: IncomingMessage) => {
  let texto = '';
  for await (const parte of peticion) texto += parte;
  return JSON.parse(texto) as Omit<ProductoGuardado, 'id'>;
};

export async function arrancarServidorProductos(): Promise<ServidorProductos> {
  const productos = new Map<string, ProductoGuardado>();
  let siguiente = 1;

  const servidor = createServer(async (peticion, respuesta) => {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    const [, recurso, id] = url.pathname.split('/');
    const responder = (estado: number, cuerpo?: unknown) => {
      respuesta.writeHead(estado, cuerpo === undefined ? {} : { 'Content-Type': 'application/json' });
      respuesta.end(cuerpo === undefined ? undefined : JSON.stringify(cuerpo));
    };
    const skuOcupado = (sku: string, salvo?: string) => [...productos.values()].some((p) => p.sku === sku && p.id !== salvo);

    if (recurso !== 'productos') return responder(404);
    if (peticion.method === 'GET' && id === undefined) {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const lista = [...productos.values()]
        .filter((p) => p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
        .sort((a, b) => a.sku.localeCompare(b.sku));
      return responder(200, lista);
    }
    if (peticion.method === 'POST' && id === undefined) {
      const datos = await leerCuerpo(peticion);
      if (skuOcupado(datos.sku)) return responder(409, { error: 'sku-duplicado' });
      const producto = { ...datos, id: `srv-${siguiente++}` };
      productos.set(producto.id, producto);
      return responder(201, producto);
    }
    const existente = id === undefined ? undefined : productos.get(id);
    if (!existente) return responder(404);
    if (peticion.method === 'GET') return responder(200, existente);
    if (peticion.method === 'PUT') {
      const datos = await leerCuerpo(peticion);
      if (skuOcupado(datos.sku, existente.id)) return responder(409, { error: 'sku-duplicado' });
      const producto = { ...datos, id: existente.id };
      productos.set(existente.id, producto);
      return responder(200, producto);
    }
    if (peticion.method === 'DELETE') {
      productos.delete(existente.id);
      return responder(204);
    }
    return responder(405);
  });

  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  const { port } = servidor.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    vaciar: () => productos.clear(),
    cerrar: () => new Promise((listo) => servidor.close(() => listo())),
  };
}
