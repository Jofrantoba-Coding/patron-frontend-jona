// Hidratación sin diferencias (la técnica del capítulo 15): el documento que produce
// componerDocumento, el mismo para el servidor SSR y para el sitio estático, hidratado con los
// datos que viajaron en él. Cero errores recuperables y cero avisos; después, la ficha responde.
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { leerDatosIncrustados } from '../compartido/datosIncrustados';
import { crearRepositorioMemoria } from '../servidor/adaptadores/crearRepositorioMemoria';
import { componerDocumento, MARCAS } from '../servidor/componerDocumento';
import { crearSitio, PRODUCTOS_DE_EJEMPLO } from '../servidor/crearRaizComposicion';
import { resolverPagina } from '../servidor/resolverPagina';
import { Pagina, type DatosPagina, type ServiciosCliente } from './index';

const PLANTILLA = `<!doctype html><html lang="es-PE"><head>${MARCAS.cabeza}</head><body><div id="raiz">${MARCAS.html}</div>${MARCAS.datos}</body></html>`;
const SITIO = crearSitio();

/** Lo que recibe el navegador: el documento analizado, y la página que viajó en él. */
async function documentoDe(ruta: string) {
  const { pagina } = await resolverPagina(new URL(ruta, SITIO.url), crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO));
  const documento = new DOMParser().parseFromString(componerDocumento(PLANTILLA, pagina, SITIO), 'text/html');
  return { documento, recibida: leerDatosIncrustados<DatosPagina>(documento) };
}

async function hidratar(htmlDelServidor: string, pagina: DatosPagina, servicios?: ServiciosCliente) {
  const contenedor = document.createElement('div');
  contenedor.innerHTML = htmlDelServidor;
  document.body.append(contenedor);
  const recuperables = vi.fn();
  const consola = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const avisos = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const raiz = await act(async () => hydrateRoot(contenedor, <Pagina pagina={pagina} servicios={servicios} />, { onRecoverableError: recuperables }));
  const errores = () => recuperables.mock.calls.length + consola.mock.calls.length + avisos.mock.calls.length;
  return {
    contenedor,
    errores,
    desmontar: () => {
      act(() => raiz.unmount());
      consola.mockRestore();
      avisos.mockRestore();
      contenedor.remove();
    },
  };
}

describe('hidratación de la ficha de producto', () => {
  it('hidrata sin diferencias con los datos que viajaron en el HTML, y después el botón responde', async () => {
    const { documento, recibida } = await documentoDe('/productos/TEC-001');
    const h = await hidratar(documento.getElementById('raiz')!.innerHTML, recibida);
    try {
      expect(h.errores()).toBe(0);

      await act(async () => h.contenedor.querySelector('button')!.click());

      expect(h.contenedor.querySelector('[role="status"]')?.textContent).toBe('En el carrito: 1');
      expect(h.errores()).toBe(0);
    } finally {
      h.desmontar();
    }
  });

  it('la imagen principal sale del servidor con prioridad, y React la precarga', async () => {
    const { documento } = await documentoDe('/productos/TEC-001');
    const imagen = documento.querySelector('#raiz main img')!;

    expect([imagen.getAttribute('loading'), imagen.getAttribute('fetchpriority')]).toEqual(['eager', 'high']);
    expect(documento.querySelector('link[rel="preload"][as="image"]')?.getAttribute('href')).toBe('/img/productos/TEC-001.svg');
  });

  it('la prueba no es vacía: datos distintos entre el servidor y el cliente no hidratan igual', async () => {
    const { documento, recibida } = await documentoDe('/productos/TEC-001');
    const otra = { ...recibida, datos: { ...recibida.datos, nombre: 'Otro nombre' } } as DatosPagina;
    const h = await hidratar(documento.getElementById('raiz')!.innerHTML, otra);
    try {
      expect(h.errores()).toBeGreaterThan(0);
    } finally {
      h.desmontar();
    }
  });
});

describe('la búsqueda del sitio estático, después de hidratar', () => {
  it('el archivo prerenderizado no trae término: hidrata igual y luego busca el de la URL con el servicio', async () => {
    const { documento, recibida } = await documentoDe('/buscar');
    const buscar = vi.fn(async () => [{ sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 'S/ 120.00', disponible: true, imagen: PRODUCTOS_DE_EJEMPLO[0].imagen }]);
    const h = await hidratar(documento.getElementById('raiz')!.innerHTML, recibida, { busqueda: { buscar }, terminoUrl: 'teclado' });
    try {
      await act(async () => undefined);

      expect(h.errores()).toBe(0);
      expect(buscar).toHaveBeenCalledWith('teclado');
      expect([...h.contenedor.querySelectorAll('li a')].map((a) => a.getAttribute('href'))).toEqual(['/productos/TEC-001']);
      expect(h.contenedor.querySelector('input')?.value).toBe('teclado');
    } finally {
      h.desmontar();
    }
  });

  it('con el servidor SSR la búsqueda ya viene resuelta: no vuelve a buscar', async () => {
    const { documento, recibida } = await documentoDe('/buscar?q=mouse');
    const buscar = vi.fn(async () => []);
    const h = await hidratar(documento.getElementById('raiz')!.innerHTML, recibida, { busqueda: { buscar }, terminoUrl: 'mouse' });
    try {
      expect(h.errores()).toBe(0);
      expect(buscar).not.toHaveBeenCalled();
      expect(h.contenedor.querySelectorAll('li')).toHaveLength(1);
    } finally {
      h.desmontar();
    }
  });

  it('el catálogo no busca nunca, aunque la URL traiga q', async () => {
    const { documento, recibida } = await documentoDe('/');
    const buscar = vi.fn(async () => []);
    const h = await hidratar(documento.getElementById('raiz')!.innerHTML, recibida, { busqueda: { buscar }, terminoUrl: 'mouse' });
    try {
      expect(buscar).not.toHaveBeenCalled();
      expect(h.contenedor.querySelectorAll('li')).toHaveLength(3);
    } finally {
      h.desmontar();
    }
  });
});
