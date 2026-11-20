// Incrustación segura: un nombre de producto hostil no puede salir del <script> de datos ni del
// texto de la tabla. El documento se analiza con el parser HTML de jsdom, como lo haría el navegador.
import { describe, expect, it } from 'vitest';
import { ID_DATOS, leerDatosIncrustados, serializarParaHtml } from '../compartido/datosIncrustados';
import type { DatosUiCatalogo } from '../ui/catalogo';
import { componerPagina, MARCAS, renderizarCatalogo } from './renderizarPagina';

const HOSTIL = '</script><script>window.atacado = true</script><!-- $& $\' \u2028';
const DATOS: DatosUiCatalogo = {
  termino: '',
  productos: [{ id: 'p-1', sku: 'TEC-001', nombre: HOSTIL, precio: 'S/ 1.00', stock: 1 }],
};
const PLANTILLA = `<!doctype html><html><body><div id="raiz">${MARCAS.html}</div>${MARCAS.datos}<script type="module" src="/assets/cliente.js"></script></body></html>`;

const analizar = (html: string) => new DOMParser().parseFromString(html, 'text/html');

describe('datos incrustados en el HTML', () => {
  it('serializarParaHtml no deja <, >, & ni separadores de línea, y JSON.parse devuelve lo original', () => {
    const texto = serializarParaHtml(DATOS);

    expect(texto).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(texto)).toEqual(DATOS);
  });

  it('un nombre con </script> y <!-- no rompe la página: un solo script de datos, intacto', () => {
    const documento = analizar(componerPagina(PLANTILLA, DATOS));

    expect([...documento.querySelectorAll('script')].map((s) => s.id || s.getAttribute('src'))).toEqual([ID_DATOS, '/assets/cliente.js']);
    expect(leerDatosIncrustados<DatosUiCatalogo>(documento)).toEqual(DATOS);
  });

  it('en la tabla, el nombre es texto: React lo escapa', () => {
    const documento = analizar(componerPagina(PLANTILLA, DATOS));

    expect(documento.querySelector('#raiz td:nth-child(2)')?.textContent).toBe(HOSTIL);
    expect(documento.querySelectorAll('#raiz script')).toHaveLength(0);
  });

  it('la prueba no es vacía: con JSON.stringify a secas, el mismo nombre inyecta un script y se come el resto', () => {
    const ingenua = PLANTILLA.replace(MARCAS.datos, () => `<script id="${ID_DATOS}" type="application/json">${JSON.stringify(DATOS)}</script>`);
    const scripts = [...analizar(ingenua).querySelectorAll('script')];

    // El </script> del nombre cierra los datos, el siguiente <script> se ejecutaría, y el <!-- deja
    // dentro de un comentario el script del cliente.
    expect(scripts.map((s) => s.textContent)).toContain('window.atacado = true');
    expect(scripts.some((s) => s.getAttribute('src') === '/assets/cliente.js')).toBe(false);
  });

  it('la prueba no es vacía: con un texto como reemplazo, el $& del nombre se convierte en la marca', () => {
    const ingenua = PLANTILLA.replace(MARCAS.html, renderizarCatalogo(DATOS));

    expect(analizar(ingenua).querySelector('#raiz td:nth-child(2)')?.textContent).not.toBe(HOSTIL);
  });
});
