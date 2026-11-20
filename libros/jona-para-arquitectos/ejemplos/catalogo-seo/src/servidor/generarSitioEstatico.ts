// Modo de entrega 1: el sitio estático, prerenderizado al compilar (SSG). Las mismas funciones que
// el servidor SSR (resolverPagina y componerDocumento), llamadas una vez por ruta: un index.html
// por ruta, 404.html, sitemap.xml, robots.txt, el índice de búsqueda y los estáticos del cliente.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { RUTA_BUSQUEDA, RUTA_INDICE_BUSQUEDA, RUTA_ROBOTS, RUTA_SITEMAP, urlAbsoluta } from '../compartido/rutas';
import { cargarUiCatalogo } from '../ui/catalogo/indexServidor';
import { componerDocumento } from './componerDocumento';
import type { RaizComposicion } from './crearRaizComposicion';
import { resolverPagina } from './resolverPagina';
import { generarRobots, generarSitemap, rutasIndexables } from './sitemap';

export interface OpcionesSitioEstatico {
  raiz: RaizComposicion;
  plantilla: string;
  /** El cliente compilado (dist/client): se copia, menos la plantilla. */
  dirCliente: string;
  /** Se borra y se vuelve a escribir. */
  dirSalida: string;
}

/** El archivo de una ruta: `/` → index.html, `/productos/TEC-001` → productos/TEC-001/index.html. */
export const archivoDeRuta = (ruta: string) => (ruta === '/' ? 'index.html' : `${decodeURIComponent(ruta.slice(1))}/index.html`);

/** Una ruta que no puede existir en el sitio: su página es la de «no encontrado». */
const RUTA_INEXISTENTE = '/404';

/** Escribe el sitio y devuelve los archivos escritos, relativos a dirSalida y con '/'. */
export async function generarSitioEstatico({ raiz, plantilla, dirCliente, dirSalida }: OpcionesSitioEstatico): Promise<string[]> {
  const { sitio } = raiz;
  const repositorio = raiz.repositorioPara();
  const escritos: string[] = [];
  const escribir = async (archivo: string, contenido: string) => {
    await mkdir(dirname(join(dirSalida, archivo)), { recursive: true });
    await writeFile(join(dirSalida, archivo), contenido);
    escritos.push(archivo);
  };

  await rm(dirSalida, { recursive: true, force: true });
  await cp(dirCliente, dirSalida, { recursive: true, filter: (origen) => origen !== join(dirCliente, 'index.html') });

  const indexables = await rutasIndexables(repositorio);
  // La búsqueda se prerenderiza sin término: el navegador busca con el índice JSON (UiCatalogoImplCliente).
  for (const ruta of [...indexables, RUTA_BUSQUEDA]) {
    const { estado, pagina } = await resolverPagina(new URL(urlAbsoluta(sitio.url, ruta)), repositorio);
    if (estado !== 200) throw new Error(`La ruta ${ruta} debía existir y respondió ${estado}`);
    await escribir(archivoDeRuta(ruta), componerDocumento(plantilla, pagina, sitio));
  }
  const noEncontrada = await resolverPagina(new URL(urlAbsoluta(sitio.url, RUTA_INEXISTENTE)), repositorio);
  if (noEncontrada.estado !== 404) throw new Error(`${RUTA_INEXISTENTE} debía responder 404`);
  await escribir('404.html', componerDocumento(plantilla, noEncontrada.pagina, sitio));

  await escribir(RUTA_SITEMAP.slice(1), generarSitemap(sitio, indexables));
  await escribir(RUTA_ROBOTS.slice(1), generarRobots(sitio));
  await escribir(RUTA_INDICE_BUSQUEDA.slice(1), JSON.stringify((await cargarUiCatalogo(repositorio, {})).productos));
  return escritos;
}
