// El renderizador de la cabeza: del contrato de metadatos a <title>, <meta>, <link> y JSON-LD.
// El HTML se analiza con el parser de jsdom, como lo haría un navegador o un rastreador.
import { describe, expect, it } from 'vitest';
import type { InterMetadatosPagina } from './InterMetadatosPagina';
import { renderizarCabeza } from './renderizarCabeza';

const HOSTIL = 'Teclado </script><script>window.atacado = true</script><!-- "comillas" & más';

const PRODUCTO: InterMetadatosPagina = {
  titulo: 'Teclado mecánico (TEC-001) | Tienda JONA',
  descripcion: 'Teclado de 87 teclas con interruptores táctiles.',
  canonica: 'https://catalogo.example/productos/TEC-001',
  robots: 'index, follow',
  openGraph: { tipo: 'product', imagen: 'https://catalogo.example/img/productos/TEC-001.svg' },
  jsonLd: { '@context': 'https://schema.org', '@type': 'Product', name: HOSTIL, sku: 'TEC-001' },
};

const cabeza = (html: string) => new DOMParser().parseFromString(`<!doctype html><html><head>${html}</head><body></body></html>`, 'text/html');
const meta = (documento: Document, selector: string) => documento.querySelector(selector)?.getAttribute('content');

describe('renderizarCabeza', () => {
  it('dibuja título, descripción, robots, canónica y Open Graph derivado del contrato', () => {
    const documento = cabeza(renderizarCabeza(PRODUCTO));

    expect(documento.title).toBe(PRODUCTO.titulo);
    expect(meta(documento, 'meta[name="description"]')).toBe(PRODUCTO.descripcion);
    expect(meta(documento, 'meta[name="robots"]')).toBe('index, follow');
    expect(documento.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(PRODUCTO.canonica);
    expect(['og:type', 'og:title', 'og:description', 'og:url', 'og:image'].map((p) => meta(documento, `meta[property="${p}"]`))).toEqual([
      'product', PRODUCTO.titulo, PRODUCTO.descripcion, PRODUCTO.canonica, PRODUCTO.openGraph.imagen,
    ]);
  });

  it('una página que no se indexa no lleva canónica ni og:url', () => {
    const documento = cabeza(renderizarCabeza({ titulo: 'Buscar | Tienda JONA', descripcion: 'Resultados.', robots: 'noindex, follow', openGraph: { tipo: 'website' } }));

    expect(meta(documento, 'meta[name="robots"]')).toBe('noindex, follow');
    expect(documento.querySelector('link[rel="canonical"], meta[property="og:url"], script')).toBeNull();
  });

  it('los textos se escapan: comillas y < en el título no cierran ni abren etiquetas', () => {
    const documento = cabeza(renderizarCabeza({ ...PRODUCTO, titulo: HOSTIL, descripcion: HOSTIL }));

    expect(documento.title).toBe(HOSTIL);
    expect(meta(documento, 'meta[name="description"]')).toBe(HOSTIL);
    expect(documento.querySelectorAll('script')).toHaveLength(1);
  });

  it('un nombre con </script> no rompe el JSON-LD: un solo script, y JSON.parse devuelve el objeto', () => {
    const scripts = [...cabeza(renderizarCabeza(PRODUCTO)).querySelectorAll('script')];

    expect(scripts.map((s) => s.getAttribute('type'))).toEqual(['application/ld+json']);
    expect(JSON.parse(scripts[0].textContent!)).toEqual(PRODUCTO.jsonLd);
  });

  it('la prueba no es vacía: con JSON.stringify a secas, el mismo nombre parte el JSON-LD e inyecta un script', () => {
    const ingenua = renderizarCabeza({ ...PRODUCTO, jsonLd: undefined }) + `<script type="application/ld+json">${JSON.stringify(PRODUCTO.jsonLd)}</script>`;
    const scripts = [...cabeza(ingenua).querySelectorAll('script')];

    expect(scripts.map((s) => s.textContent)).toContain('window.atacado = true');
    expect(() => JSON.parse(scripts[0].textContent!)).toThrow();
  });
});
