// Auditoría SEO del HTML tal como se sirve, antes de que corra JavaScript: jsdom lo analiza y no
// ejecuta sus scripts. Comprueba lo que se puede comprobar en el HTML; lo que depende de dibujar
// la página (Core Web Vitals, el diseño, lo que agrega JavaScript) queda fuera: eso exige un
// navegador real.
import { JSDOM } from 'jsdom';

export type ReglaPagina = 'titulo' | 'descripcion' | 'canonica' | 'robots' | 'idioma' | 'h1' | 'niveles' | 'enlaces' | 'imagenes' | 'jsonld';
export type ReglaSitio = 'titulos-unicos' | 'descripciones-unicas' | 'sitemap' | 'robots-txt';

export interface Hallazgo<R extends string = ReglaPagina | ReglaSitio> {
  regla: R;
  mensaje: string;
}

export interface ContextoPagina {
  /** Si la página debe indexarse. Las que no, deben decirlo con noindex. */
  indexable: boolean;
  /** El @type de schema.org que el JSON-LD de la página debe declarar. */
  tipoJsonLd?: string;
}

type Regla = (documento: Document, url: string, contexto: ContextoPagina) => string[];

const texto = (elemento: Element | null | undefined) => elemento?.textContent?.trim() ?? '';
const contenido = (documento: Document, selector: string) => [...documento.querySelectorAll(selector)].map((e) => e.getAttribute('content') ?? '');
const robotsDe = (documento: Document) => contenido(documento, 'meta[name="robots"]').join(', ');

export const REGLAS_PAGINA: Record<ReglaPagina, Regla> = {
  titulo: (documento) => {
    const titulos = [...documento.querySelectorAll('title')];
    if (titulos.length !== 1) return [`debe haber exactamente un <title>, hay ${titulos.length}`];
    return texto(titulos[0]) === '' ? ['el <title> está vacío'] : [];
  },

  descripcion: (documento) => {
    const descripciones = contenido(documento, 'meta[name="description"]');
    if (descripciones.length !== 1) return [`debe haber exactamente una meta description, hay ${descripciones.length}`];
    return descripciones[0].trim() === '' ? ['la meta description está vacía'] : [];
  },

  canonica: (documento, url, { indexable }) => {
    const canonicas = [...documento.querySelectorAll('link[rel="canonical"]')].map((l) => l.getAttribute('href') ?? '');
    if (!indexable) return canonicas.length > 0 ? [`una página noindex no declara canónica, y esta declara ${canonicas.join(', ')}`] : [];
    if (canonicas.length !== 1) return [`una página indexable declara exactamente una canónica, y esta declara ${canonicas.length}`];
    if (!/^https?:\/\//.test(canonicas[0])) return [`la canónica debe ser absoluta: «${canonicas[0]}»`];
    return canonicas[0] === url ? [] : [`la canónica es ${canonicas[0]}, y la URL de la página es ${url}`];
  },

  robots: (documento, _url, { indexable }) => {
    const noindex = /\bnoindex\b/i.test(robotsDe(documento));
    if (indexable && noindex) return ['la página debe indexarse y declara noindex'];
    if (!indexable && !noindex) return ['la página no debe indexarse y no declara noindex'];
    return [];
  },

  idioma: (documento) => (documento.documentElement.getAttribute('lang')?.trim() ? [] : ['<html> no declara lang']),

  h1: (documento) => {
    const h1 = [...documento.querySelectorAll('h1')];
    if (h1.length !== 1) return [`debe haber exactamente un <h1>, hay ${h1.length}`];
    return texto(h1[0]) === '' ? ['el <h1> está vacío'] : [];
  },

  niveles: (documento) => {
    const niveles = [...documento.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1]));
    return niveles.flatMap((nivel, i) =>
      i > 0 && nivel > niveles[i - 1] + 1 ? [`los títulos saltan de h${niveles[i - 1]} a h${nivel}, sin h${niveles[i - 1] + 1}`] : [],
    );
  },

  enlaces: (documento) => [
    ...[...documento.querySelectorAll('a')].flatMap((a) => {
      const href = a.getAttribute('href');
      if (href === null) return [`el enlace «${texto(a)}» no tiene href`];
      return /^(#|javascript:)/i.test(href.trim()) ? [`el enlace «${texto(a)}» tiene href="${href}", que no lleva a ningún lado`] : [];
    }),
    ...[...documento.querySelectorAll('[onclick]')]
      .filter((e) => !['A', 'BUTTON'].includes(e.tagName))
      .map((e) => `<${e.tagName.toLowerCase()} onclick> «${texto(e)}» hace de enlace o de botón sin serlo: no tiene href que seguir`),
  ],

  imagenes: (documento) =>
    [...documento.querySelectorAll('img')].flatMap((img) => {
      const faltan = ['alt', 'width', 'height'].filter((atributo) => !img.hasAttribute(atributo));
      return faltan.length > 0 ? [`la imagen ${img.getAttribute('src')} no tiene ${faltan.join(', ')}`] : [];
    }),

  jsonld: (documento, _url, { tipoJsonLd }) => {
    const scripts = [...documento.querySelectorAll('script[type="application/ld+json"]')];
    const tipos: unknown[] = [];
    const mensajes = scripts.flatMap((script, i) => {
      try {
        tipos.push((JSON.parse(script.textContent ?? '') as { '@type'?: unknown })['@type']);
        return [];
      } catch {
        return [`el JSON-LD n.º ${i + 1} no es JSON válido: un texto cerró el <script> antes de tiempo, o se escribió mal`];
      }
    });
    if (tipoJsonLd && !tipos.includes(tipoJsonLd)) mensajes.push(`falta el JSON-LD de tipo ${tipoJsonLd}`);
    return mensajes;
  },
};

/** Los hallazgos de una página. `url` es la URL pública (la que debe ser su canónica). */
export function auditarSeo(html: string, url: string, contexto: ContextoPagina): Hallazgo<ReglaPagina>[] {
  const documento = new JSDOM(html).window.document;
  return (Object.entries(REGLAS_PAGINA) as Array<[ReglaPagina, Regla]>).flatMap(([regla, revisar]) =>
    revisar(documento, url, contexto).map((mensaje) => ({ regla, mensaje })),
  );
}

// ---------------------------------------------------------------------------------------------
// Entre páginas: lo que ninguna página puede saber sola.
// ---------------------------------------------------------------------------------------------

export interface PaginaAuditada {
  url: string;
  html: string;
  indexable: boolean;
}

export interface Sitio {
  /** Origen público, sin barra final. */
  base: string;
  paginas: readonly PaginaAuditada[];
  sitemap: string;
  robots: string;
}

/** Valores repetidos entre páginas indexables: [valor, urls]. Un valor vacío ya lo señala la regla de página. */
function repetidos(paginas: readonly PaginaAuditada[], leer: (documento: Document) => string): Array<[string, string[]]> {
  const porValor = new Map<string, string[]>();
  for (const pagina of paginas.filter((p) => p.indexable)) {
    const valor = leer(new JSDOM(pagina.html).window.document).trim();
    if (valor !== '') porValor.set(valor, [...(porValor.get(valor) ?? []), pagina.url]);
  }
  return [...porValor].filter(([, urls]) => urls.length > 1);
}

const desescaparXml = (texto: string) =>
  texto.replace(/&(amp|lt|gt|quot|apos);/g, (_, e: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[e]!);

export function auditarSitio({ base, paginas, sitemap, robots }: Sitio): Hallazgo<ReglaSitio>[] {
  const hallazgos: Hallazgo<ReglaSitio>[] = [];
  for (const [titulo, urls] of repetidos(paginas, (d) => d.title)) {
    hallazgos.push({ regla: 'titulos-unicos', mensaje: `el título «${titulo}» se repite en ${urls.join(' y ')}` });
  }
  for (const [descripcion, urls] of repetidos(paginas, (d) => contenido(d, 'meta[name="description"]').join(' '))) {
    hallazgos.push({ regla: 'descripciones-unicas', mensaje: `la descripción «${descripcion}» se repite en ${urls.join(' y ')}` });
  }

  const listadas = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => desescaparXml(m[1].trim())));
  const indexables = new Set(paginas.filter((p) => p.indexable).map((p) => p.url));
  for (const url of listadas) {
    if (!indexables.has(url)) {
      const pagina = paginas.find((p) => p.url === url);
      hallazgos.push({ regla: 'sitemap', mensaje: pagina ? `el sitemap lista ${url}, que no se indexa` : `el sitemap lista ${url}, que no es una página auditada` });
    }
  }
  for (const url of indexables) {
    if (!listadas.has(url)) hallazgos.push({ regla: 'sitemap', mensaje: `falta en el sitemap ${url}, que se indexa` });
  }

  const esperado = `${base}/sitemap.xml`;
  const declarados = [...robots.matchAll(/^\s*Sitemap:\s*(\S+)\s*$/gim)].map((m) => m[1]);
  if (!declarados.includes(esperado)) {
    hallazgos.push({ regla: 'robots-txt', mensaje: `robots.txt no apunta a ${esperado}${declarados.length ? ` (declara ${declarados.join(', ')})` : ''}` });
  }
  return hallazgos;
}
