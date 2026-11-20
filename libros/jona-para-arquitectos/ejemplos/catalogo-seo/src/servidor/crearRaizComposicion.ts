// Raíz de composición del servidor, la misma para los dos modos de entrega: el servidor SSR la
// arma una vez por proceso, y el generador del sitio estático una vez por compilación. Exporta
// una fábrica, no una instancia (regla 4 de test/architecture).
import type { Producto } from '../dominio/Producto';
import type { InterSitio } from '../seo/InterMetadatosPagina';
import { crearRepositorioMemoria } from './adaptadores/crearRepositorioMemoria';
import type { InterProductoRepositorio } from './InterProductoRepositorio';

/** Variables del servidor y de la compilación, no VITE_*: no se compilan en el cliente. */
export interface EntornoServidor {
  /** URL pública del sitio: la base de las canónicas, del sitemap y de robots.txt. */
  SITIO_URL?: string;
}

export interface RaizComposicion {
  sitio: InterSitio;
  /** El repositorio para una petición (SSR) o para la compilación (estático). */
  repositorioPara(): InterProductoRepositorio;
}

/** `.example` está reservado para ejemplos (RFC 2606): nunca apunta a un sitio real. */
export const SITIO_URL_POR_DEFECTO = 'https://catalogo.example';

/** La URL pública, validada: absoluta, http o https, sin ruta, sin barra final. */
export function crearSitio(url = SITIO_URL_POR_DEFECTO): InterSitio {
  let analizada: URL;
  try {
    analizada = new URL(url);
  } catch {
    throw new Error(`SITIO_URL no es una URL absoluta: ${url}`);
  }
  if (!['http:', 'https:'].includes(analizada.protocol) || analizada.pathname !== '/' || analizada.search || analizada.hash) {
    throw new Error(`SITIO_URL debe ser el origen del sitio, como https://tienda.pe: ${url}`);
  }
  return { url: analizada.origin, nombre: 'Tienda JONA', idioma: 'es-PE' };
}

export const PRODUCTOS_DE_EJEMPLO: readonly Producto[] = [
  {
    sku: 'TEC-001',
    nombre: 'Teclado mecánico',
    descripcion: 'Teclado mecánico de 87 teclas con interruptores táctiles y conexión USB-C.',
    precio: 120,
    stock: 8,
    imagen: { src: '/img/productos/TEC-001.svg', ancho: 640, alto: 480, alt: 'Teclado mecánico de 87 teclas visto desde arriba' },
  },
  {
    sku: 'MOU-002',
    nombre: 'Mouse inalámbrico',
    descripcion: 'Mouse inalámbrico de seis botones con receptor USB y batería recargable.',
    precio: 45.5,
    stock: 20,
    imagen: { src: '/img/productos/MOU-002.svg', ancho: 640, alto: 480, alt: 'Mouse inalámbrico gris de seis botones' },
  },
  {
    sku: 'MON-003',
    nombre: 'Monitor de 24 pulgadas',
    descripcion: 'Monitor IPS de 24 pulgadas con resolución Full HD y entrada HDMI.',
    precio: 699,
    stock: 0,
    imagen: { src: '/img/productos/MON-003.svg', ancho: 640, alto: 480, alt: 'Monitor de 24 pulgadas de marco delgado' },
  },
];

export function crearRaizComposicion(entorno: EntornoServidor, productos: readonly Producto[] = PRODUCTOS_DE_EJEMPLO): RaizComposicion {
  const sitio = crearSitio(entorno.SITIO_URL || undefined);
  // Solo lectura: las peticiones pueden compartir el almacén. Lo crea la fábrica, no el módulo.
  const almacen = crearRepositorioMemoria(productos);
  return { sitio, repositorioPara: () => almacen };
}
