// @vitest-environment node
// La Implementación del servidor del catálogo y de la búsqueda, sin DOM.
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria } from '../../servidor/adaptadores/crearRepositorioMemoria';
import { crearSitio, PRODUCTOS_DE_EJEMPLO } from '../../servidor/crearRaizComposicion';
import { cargarUiCatalogo, metadatosUiCatalogo } from './UiCatalogoImplServidor';

const SITIO = crearSitio('https://tienda.example');
const repositorio = () => crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO);

describe('cargarUiCatalogo', () => {
  it('sin término es el catálogo completo, ordenado por SKU, con el precio formateado', async () => {
    const datos = await cargarUiCatalogo(repositorio(), {});

    expect(datos.termino).toBeUndefined();
    expect(datos.productos.map((p) => [p.sku, p.precio, p.disponible])).toEqual([
      ['MON-003', 'S/ 699.00', false],
      ['MOU-002', 'S/ 45.50', true],
      ['TEC-001', 'S/ 120.00', true],
    ]);
  });

  it('con término es una búsqueda: sin tildes ni mayúsculas, y vacía si el término lo es', async () => {
    expect((await cargarUiCatalogo(repositorio(), { termino: ' INALAMBRICO ' })).productos.map((p) => p.sku)).toEqual(['MOU-002']);
    expect(await cargarUiCatalogo(repositorio(), { termino: '  ' })).toEqual({ termino: '', productos: [] });
  });

  it('si el repositorio falla, la búsqueda sale con un aviso; el catálogo, no: falla', async () => {
    const roto = repositorio();
    vi.spyOn(roto, 'listar').mockRejectedValue(new Error('red'));

    expect(await cargarUiCatalogo(roto, { termino: 'x' })).toEqual({ termino: 'x', productos: [], aviso: 'No se pudo buscar en el catálogo' });
    await expect(cargarUiCatalogo(roto, {})).rejects.toThrow('red');
  });
});

describe('metadatosUiCatalogo: (datos, sitio) → metadatos', () => {
  it('el catálogo se indexa, con canónica en la raíz y un ItemList de enlaces absolutos', async () => {
    const metadatos = metadatosUiCatalogo(await cargarUiCatalogo(repositorio(), {}), SITIO);

    expect(metadatos).toMatchObject({ canonica: 'https://tienda.example/', robots: 'index, follow', titulo: 'Catálogo de productos | Tienda JONA' });
    expect(metadatos.descripcion).toContain('Teclado mecánico');
    expect(metadatos.jsonLd).toMatchObject({ '@type': 'ItemList' });
    expect(metadatos.jsonLd?.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Monitor de 24 pulgadas', url: 'https://tienda.example/productos/MON-003' },
      { '@type': 'ListItem', position: 2, name: 'Mouse inalámbrico', url: 'https://tienda.example/productos/MOU-002' },
      { '@type': 'ListItem', position: 3, name: 'Teclado mecánico', url: 'https://tienda.example/productos/TEC-001' },
    ]);
  });

  it('la búsqueda no se indexa: noindex, sin canónica ni JSON-LD, con o sin término', () => {
    for (const termino of ['teclado', '']) {
      const metadatos = metadatosUiCatalogo({ termino, productos: [] }, SITIO);

      expect(metadatos.robots).toBe('noindex, follow');
      expect(metadatos).not.toHaveProperty('canonica');
      expect(metadatos).not.toHaveProperty('jsonLd');
    }
    expect(metadatosUiCatalogo({ termino: 'teclado', productos: [] }, SITIO).titulo).toBe('Buscar «teclado» | Tienda JONA');
  });
});
