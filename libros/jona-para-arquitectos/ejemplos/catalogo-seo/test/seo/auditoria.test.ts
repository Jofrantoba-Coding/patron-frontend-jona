// @vitest-environment node
// La auditoría misma: lo válido pasa, y cada regla señala su árbol de violación con un mensaje que
// se entiende. Una regla que nunca falla no prueba nada.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { auditarSeo, auditarSitio, REGLAS_PAGINA, type ContextoPagina, type PaginaAuditada, type ReglaPagina, type ReglaSitio } from './auditarSeo';

const leer = (archivo: string) => readFileSync(new URL(`../fixtures/seo/${archivo}`, import.meta.url), 'utf8');

const BASE = 'https://catalogo.example';
const TECLADO = `${BASE}/productos/TEC-001`;
const MOUSE = `${BASE}/productos/MOU-002`;
const FICHA: ContextoPagina = { indexable: true, tipoJsonLd: 'Product' };

describe('auditarSeo: una página', () => {
  it('una ficha válida y una búsqueda válida no tienen hallazgos', () => {
    expect(auditarSeo(leer('pagina-valida.html'), TECLADO, FICHA)).toEqual([]);
    expect(auditarSeo(leer('busqueda-valida.html'), `${BASE}/buscar`, { indexable: false })).toEqual([]);
  });

  /** [árbol, regla, parte del mensaje]. Todos son la ficha válida con un solo cambio. */
  const CASOS: Array<[string, ReglaPagina, string]> = [
    ['titulo-vacio.html', 'titulo', 'el <title> está vacío'],
    ['sin-descripcion.html', 'descripcion', 'exactamente una meta description, hay 0'],
    ['sin-canonica.html', 'canonica', 'declara exactamente una canónica, y esta declara 0'],
    ['canonica-relativa.html', 'canonica', 'la canónica debe ser absoluta: «/productos/TEC-001»'],
    ['indexable-con-noindex.html', 'robots', 'debe indexarse y declara noindex'],
    ['sin-idioma.html', 'idioma', '<html> no declara lang'],
    ['dos-h1.html', 'h1', 'exactamente un <h1>, hay 2'],
    ['nivel-saltado.html', 'niveles', 'saltan de h1 a h3, sin h2'],
    ['div-como-enlace.html', 'enlaces', '<div onclick> «Volver al catálogo» hace de enlace'],
    ['enlace-a-ninguna-parte.html', 'enlaces', 'href="#", que no lleva a ningún lado'],
    ['imagen-sin-alt.html', 'imagenes', 'no tiene alt'],
    ['jsonld-roto.html', 'jsonld', 'no es JSON válido'],
  ];

  it('toda regla de página tiene al menos un árbol de violación', () => {
    expect(new Set(CASOS.map(([, regla]) => regla))).toEqual(new Set(Object.keys(REGLAS_PAGINA)));
  });

  it.each(CASOS)('%s: solo la regla %s lo señala, con «%s»', (archivo, regla, mensaje) => {
    const hallazgos = auditarSeo(leer(archivo), TECLADO, FICHA);

    expect(new Set(hallazgos.map((h) => h.regla))).toEqual(new Set([regla]));
    expect(hallazgos.map((h) => h.mensaje).join('\n')).toContain(mensaje);
  });

  it('una página noindex no declara canónica, y una búsqueda sin noindex se señala', () => {
    const conCanonica = leer('busqueda-valida.html').replace('</head>', `<link rel="canonical" href="${BASE}/buscar" /></head>`);
    const sinNoindex = leer('busqueda-valida.html').replace('noindex, follow', 'index, follow');

    expect(auditarSeo(conCanonica, `${BASE}/buscar`, { indexable: false }).map((h) => h.regla)).toEqual(['canonica']);
    expect(auditarSeo(sinNoindex, `${BASE}/buscar`, { indexable: false }).map((h) => h.regla)).toEqual(['robots']);
  });
});

describe('auditarSitio: entre páginas', () => {
  const pagina = (archivo: string, url: string, indexable = true): PaginaAuditada => ({ url, html: leer(archivo), indexable });
  const VALIDAS = [pagina('pagina-valida.html', TECLADO), pagina('otra-pagina-valida.html', MOUSE), pagina('busqueda-valida.html', `${BASE}/buscar`, false)];
  const sitio = (cambios: Partial<Parameters<typeof auditarSitio>[0]> = {}) =>
    auditarSitio({ base: BASE, paginas: VALIDAS, sitemap: leer('sitemap-valido.xml'), robots: leer('robots-valido.txt'), ...cambios });

  it('un sitio válido no tiene hallazgos', () => {
    expect(sitio()).toEqual([]);
  });

  const CASOS: Array<[string, () => ReturnType<typeof auditarSitio>, ReglaSitio, string]> = [
    ['dos fichas con el mismo título', () => sitio({ paginas: [VALIDAS[0], pagina('otra-pagina-mismo-titulo.html', MOUSE), VALIDAS[2]] }), 'titulos-unicos',
      `el título «Teclado mecánico (TEC-001) | Tienda JONA» se repite en ${TECLADO} y ${MOUSE}`],
    ['dos fichas con la misma descripción', () => sitio({ paginas: [VALIDAS[0], pagina('otra-pagina-misma-descripcion.html', MOUSE), VALIDAS[2]] }), 'descripciones-unicas',
      'se repite en'],
    ['el sitemap lista una página noindex', () => sitio({ sitemap: leer('sitemap-con-noindex.xml') }), 'sitemap', `el sitemap lista ${BASE}/buscar, que no se indexa`],
    ['al sitemap le falta una página indexable', () => sitio({ sitemap: leer('sitemap-valido.xml').replace(/.*MOU-002.*\n/, '') }), 'sitemap', `falta en el sitemap ${MOUSE}`],
    ['robots.txt no apunta al sitemap', () => sitio({ robots: leer('robots-sin-sitemap.txt') }), 'robots-txt', `robots.txt no apunta a ${BASE}/sitemap.xml`],
  ];

  it('toda regla del sitio tiene al menos un caso de violación', () => {
    expect(new Set(CASOS.map(([, , regla]) => regla))).toEqual(new Set(['titulos-unicos', 'descripciones-unicas', 'sitemap', 'robots-txt']));
  });

  it.each(CASOS)('%s: la regla %s lo señala', (_nombre, auditar, regla, mensaje) => {
    const hallazgos = auditar();

    expect(hallazgos).toHaveLength(1);
    expect(hallazgos[0]).toMatchObject({ regla });
    expect(hallazgos[0].mensaje).toContain(mensaje);
  });
});

describe('contraejemplo: una aplicación solo de cliente (CSR), auditada como se sirve', () => {
  const cascara = leer('csr/index.html');

  it('la misma cáscara para cada ruta: sin h1, sin descripción, sin canónica', () => {
    const reglas = auditarSeo(cascara, TECLADO, FICHA).map((h) => h.regla);

    expect(reglas).toEqual(['descripcion', 'canonica', 'h1', 'jsonld']);
  });

  it('entre páginas, el título genérico se repite en todas las rutas', () => {
    const paginas = [TECLADO, MOUSE].map((url) => ({ url, html: cascara, indexable: true }));

    const hallazgos = auditarSitio({ base: BASE, paginas, sitemap: leer('sitemap-valido.xml'), robots: leer('robots-valido.txt') });

    expect(hallazgos.map((h) => h.regla)).toEqual(['titulos-unicos']);
    expect(hallazgos[0].mensaje).toContain('«Tienda JONA»');
  });
});
