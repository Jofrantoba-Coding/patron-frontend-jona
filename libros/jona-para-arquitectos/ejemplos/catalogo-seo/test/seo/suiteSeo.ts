// Suite SEO de dos fuentes, como las suites de contrato del libro: las mismas pruebas contra cada
// modo de entrega. Una fuente responde una ruta con su estado y su HTML; no importa si lo leyó
// de un archivo prerenderizado o lo dibujó en la petición.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PRODUCTOS_DE_EJEMPLO, SITIO_URL_POR_DEFECTO } from '../../src/servidor/crearRaizComposicion';
import { auditarSeo, auditarSitio, type ContextoPagina } from './auditarSeo';

export interface Respuesta {
  estado: number;
  tipo: string | null;
  cuerpo: string;
}

export interface FuenteSitio {
  obtener(ruta: string): Promise<Respuesta>;
  cerrar(): Promise<void>;
}

const BASE = SITIO_URL_POR_DEFECTO;

/** Las páginas que se auditan: la URL pública (sin consulta) y lo que se espera de cada una. */
export const PAGINAS: Array<{ ruta: string; url: string } & ContextoPagina> = [
  { ruta: '/', url: `${BASE}/`, indexable: true, tipoJsonLd: 'ItemList' },
  ...PRODUCTOS_DE_EJEMPLO.map((p) => ({ ruta: `/productos/${p.sku}`, url: `${BASE}/productos/${p.sku}`, indexable: true, tipoJsonLd: 'Product' })),
  { ruta: '/buscar?q=teclado', url: `${BASE}/buscar`, indexable: false },
];

/** Rutas que no existen: ninguna puede responder 200. */
export const DESCONOCIDAS = ['/productos/NO-EXISTE', '/productos/tec-001', '/productos/TEC-001/extra', '/no-existe'];

export function suiteSeo(nombre: string, crear: () => Promise<FuenteSitio>) {
  describe(`auditoría SEO: ${nombre}`, () => {
    let fuente: FuenteSitio;
    beforeAll(async () => {
      fuente = await crear();
    });
    afterAll(() => fuente?.cerrar());

    it.each(PAGINAS)('$ruta responde 200 y pasa la auditoría de página', async ({ ruta, url, ...contexto }) => {
      const { estado, tipo, cuerpo } = await fuente.obtener(ruta);

      expect([estado, tipo]).toEqual([200, 'text/html; charset=utf-8']);
      expect(auditarSeo(cuerpo, url, contexto)).toEqual([]);
    });

    it.each(DESCONOCIDAS)('%s responde 404 con la página no encontrada, que no se indexa (nunca 200)', async (ruta) => {
      const { estado, cuerpo } = await fuente.obtener(ruta);

      expect(estado).toBe(404);
      expect(auditarSeo(cuerpo, `${BASE}${ruta}`, { indexable: false })).toEqual([]);
      expect(cuerpo).toContain('<h1 class="ds-fg ds-heading-xl">Página no encontrada</h1>');
    });

    it('el sitio: títulos y descripciones únicos, el sitemap lista exactamente las indexables, robots.txt apunta al sitemap', async () => {
      const paginas = await Promise.all(PAGINAS.map(async ({ ruta, url, indexable }) => ({ url, indexable, html: (await fuente.obtener(ruta)).cuerpo })));
      const [sitemap, robots] = await Promise.all([fuente.obtener('/sitemap.xml'), fuente.obtener('/robots.txt')]);

      expect([sitemap.estado, robots.estado]).toEqual([200, 200]);
      expect(auditarSitio({ base: BASE, paginas, sitemap: sitemap.cuerpo, robots: robots.cuerpo })).toEqual([]);
    });
  });
}
