// @vitest-environment node
// El adaptador de búsqueda del cliente contra el índice que publica el servidor SSR (el sitio
// estático publica el mismo archivo).
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MARCAS } from '../servidor/componerDocumento';
import { crearRaizComposicion } from '../servidor/crearRaizComposicion';
import { crearServidorSsr } from '../servidor/crearServidorSsr';
import { crearServicioBusquedaFetch } from './crearServicioBusquedaFetch';

const servidor = crearServidorSsr({ raiz: crearRaizComposicion({}), plantilla: `${MARCAS.cabeza}${MARCAS.html}${MARCAS.datos}` });
afterEach(async () => {
  vi.restoreAllMocks();
  await new Promise((listo) => servidor.close(listo));
});

async function base() {
  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  return `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
}

describe('crearServicioBusquedaFetch', () => {
  it('filtra el índice con la misma coincidencia que el servidor, y lo descarga una sola vez', async () => {
    const servicio = crearServicioBusquedaFetch(await base());
    const descargas = vi.spyOn(globalThis, 'fetch');

    expect((await servicio.buscar('INALAMBRICO')).map((f) => f.sku)).toEqual(['MOU-002']);
    expect((await servicio.buscar('tec-')).map((f) => f.sku)).toEqual(['TEC-001']);
    expect(await servicio.buscar('nada que coincida')).toEqual([]);
    expect(descargas).toHaveBeenCalledOnce();
  });
});
