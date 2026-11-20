// @vitest-environment node
// La Implementación del servidor de la ficha, sin DOM: (datos, sitio) → metadatos es una función pura.
import { describe, expect, it } from 'vitest';
import { crearRepositorioMemoria } from '../../servidor/adaptadores/crearRepositorioMemoria';
import { crearSitio, PRODUCTOS_DE_EJEMPLO } from '../../servidor/crearRaizComposicion';
import type { DatosUiProducto } from './InterUiProducto';
import { cargarUiProducto, metadatosUiProducto } from './UiProductoImplServidor';

const SITIO = crearSitio('https://tienda.example');

const TECLADO: DatosUiProducto = {
  sku: 'TEC-001',
  nombre: 'Teclado mecánico',
  descripcion: 'Teclado de 87 teclas.',
  precio: 120,
  precioTexto: 'S/ 120.00',
  stock: 8,
  imagen: { src: '/img/productos/TEC-001.svg', ancho: 640, alto: 480, alt: 'Teclado visto desde arriba' },
};

describe('cargarUiProducto', () => {
  it('llena la cara de datos con el precio formateado, y sobrevive a JSON intacta', async () => {
    const datos = await cargarUiProducto(crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO), 'MOU-002');

    expect(datos).toMatchObject({ sku: 'MOU-002', precio: 45.5, precioTexto: 'S/ 45.50', stock: 20 });
    expect(JSON.parse(JSON.stringify(datos))).toStrictEqual(datos);
  });

  it('un SKU que no existe devuelve undefined: el 404 lo decide quien responde', async () => {
    expect(await cargarUiProducto(crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO), 'NO-EXISTE')).toBeUndefined();
  });
});

describe('metadatosUiProducto: (datos, sitio) → metadatos', () => {
  it('título, descripción y canónica absoluta con la URL del sitio; se indexa', () => {
    expect(metadatosUiProducto(TECLADO, SITIO)).toMatchObject({
      titulo: 'Teclado mecánico (TEC-001) | Tienda JONA',
      descripcion: 'Teclado de 87 teclas.',
      canonica: 'https://tienda.example/productos/TEC-001',
      robots: 'index, follow',
      openGraph: { tipo: 'product', imagen: 'https://tienda.example/img/productos/TEC-001.svg' },
    });
  });

  it('JSON-LD Product con su oferta en soles; la disponibilidad sale del stock', () => {
    const conStock = metadatosUiProducto(TECLADO, SITIO).jsonLd;
    const agotado = metadatosUiProducto({ ...TECLADO, stock: 0 }, SITIO).jsonLd;

    expect(conStock).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Teclado mecánico',
      sku: 'TEC-001',
      description: 'Teclado de 87 teclas.',
      image: 'https://tienda.example/img/productos/TEC-001.svg',
      url: 'https://tienda.example/productos/TEC-001',
      offers: {
        '@type': 'Offer',
        price: '120.00',
        priceCurrency: 'PEN',
        availability: 'https://schema.org/InStock',
        url: 'https://tienda.example/productos/TEC-001',
      },
    });
    expect(agotado?.offers).toMatchObject({ availability: 'https://schema.org/OutOfStock' });
  });

  it('el SKU va codificado en la canónica', () => {
    expect(metadatosUiProducto({ ...TECLADO, sku: 'A B/1' }, SITIO).canonica).toBe('https://tienda.example/productos/A%20B%2F1');
  });

  it('es pura: los mismos datos dan los mismos metadatos, y no modifica los datos', () => {
    const copia = structuredClone(TECLADO);

    expect(metadatosUiProducto(TECLADO, SITIO)).toEqual(metadatosUiProducto(TECLADO, SITIO));
    expect(TECLADO).toEqual(copia);
  });
});
