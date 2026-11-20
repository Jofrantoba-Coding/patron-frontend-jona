// Hidratación sin diferencias: el mismo árbol, dibujado con renderToString (sin servicio, como
// en el servidor) y luego hidratado con hydrateRoot (con servicio, como en el navegador).
// Cero errores recuperables y cero avisos en la consola.
import { act, type ReactElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { crearServicioEnMemoria } from '../../../test/servicioEnMemoria';
import { serializarParaHtml } from '../../compartido/datosIncrustados';
import { cargarUiCatalogo } from './indexServidor';
import { UiCatalogo, type DatosUiCatalogo } from './index';

const PRODUCTOS = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse <inalámbrico> & "rápido"', precio: 45.5, stock: 20 },
];

async function hidratar(enServidor: ReactElement, enCliente: ReactElement) {
  const contenedor = document.createElement('div');
  contenedor.innerHTML = renderToString(enServidor);
  document.body.append(contenedor);
  const recuperables = vi.fn();
  const consola = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const avisos = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  try {
    const raiz = await act(async () => hydrateRoot(contenedor, enCliente, { onRecoverableError: recuperables }));
    const resultado = { recuperables: recuperables.mock.calls.length, consola: consola.mock.calls.length + avisos.mock.calls.length, html: contenedor.innerHTML };
    act(() => raiz.unmount());
    return resultado;
  } finally {
    consola.mockRestore();
    avisos.mockRestore();
    contenedor.remove();
  }
}

describe('hidratación', () => {
  it('la entrada hidrata sin errores recuperables ni avisos, con los datos que viajaron en el HTML', async () => {
    const { servicio, repositorio } = crearServicioEnMemoria(PRODUCTOS);
    const datos = await cargarUiCatalogo(repositorio, { termino: '' });
    // Lo que recibe el cliente es lo que sobrevivió al HTML, no el objeto del servidor.
    const recibidos = JSON.parse(serializarParaHtml(datos)) as DatosUiCatalogo;

    const r = await hidratar(<UiCatalogo datos={datos} />, <UiCatalogo datos={recibidos} servicio={servicio} />);

    expect(r).toMatchObject({ recuperables: 0, consola: 0 });
    expect(r.html).toContain('Mouse &lt;inalámbrico&gt; &amp; "rápido"');
  });

  it('la prueba no es vacía: un componente que lee el reloj no hidrata igual', async () => {
    let ahora = 1_000;
    const Reloj = () => <p>Generado a las {ahora++}</p>;

    const r = await hidratar(<Reloj />, <Reloj />);

    expect(r.recuperables).toBeGreaterThan(0);
  });

  it('la prueba no es vacía: datos distintos entre servidor y cliente tampoco hidratan igual', async () => {
    const { repositorio } = crearServicioEnMemoria(PRODUCTOS);
    const datos = await cargarUiCatalogo(repositorio, { termino: '' });

    const r = await hidratar(<UiCatalogo datos={datos} />, <UiCatalogo datos={{ ...datos, productos: datos.productos.slice(1) }} />);

    expect(r.recuperables + r.consola).toBeGreaterThan(0);
  });
});
