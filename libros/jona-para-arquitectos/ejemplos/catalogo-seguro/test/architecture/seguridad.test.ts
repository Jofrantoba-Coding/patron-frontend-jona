// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { archivosDelCliente, revisarSeguridad, type Regla } from './reglas';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Reglas de seguridad del cliente', () => {
  it('analiza el código que puede llegar al navegador (la prueba no pasa por no encontrar archivos)', () => {
    expect(archivosDelCliente(SRC)).toEqual([
      'cliente/crearServicioFetch.ts',
      'cliente/entradaCliente.tsx',
      'cliente/leerRespuestas.ts',
      'cliente/servicioFalso.ts',
      'compartido/UrlSegura.ts',
      'compartido/protocolo.ts',
      'dominio/Producto.ts',
      'dominio/SesionUsuario.ts',
      'ui/aplicacion/UiAplicacion.tsx',
      'ui/aplicacion/index.ts',
      'ui/catalogo/InterServicioCatalogo.ts',
      'ui/catalogo/InterUiCatalogo.ts',
      'ui/catalogo/UiCatalogo.tsx',
      'ui/catalogo/UiCatalogoImpl.ts',
      'ui/catalogo/UiCatalogoView.tsx',
      'ui/catalogo/index.ts',
      'ui/sesion/InterServicioSesion.ts',
      'ui/sesion/InterUiSesion.ts',
      'ui/sesion/UiSesion.tsx',
      'ui/sesion/UiSesionImpl.ts',
      'ui/sesion/UiSesionView.tsx',
      'ui/sesion/index.ts',
    ]);
  });

  it('src/ cumple las cinco reglas', () => {
    expect(revisarSeguridad(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
const CASOS: Array<[string, Regla, string]> = [
  ['vista-con-html-crudo', 1, 'ui/catalogo/UiCatalogoView.tsx'],
  ['impl-con-innerhtml', 1, 'ui/catalogo/UiCatalogoImpl.ts'],
  ['token-en-localstorage', 2, 'cliente/crearServicioFetch.ts'],
  ['secreto-en-vite', 3, 'cliente/crearServicioFetch.ts'],
  ['falso-importado', 4, 'cliente/entradaCliente.tsx'],
  ['falso-sin-condicion', 4, 'cliente/entradaCliente.tsx'],
  ['defaults-con-credenciales', 5, 'ui/sesion/InterUiSesion.ts'],
];

describe('Cada regla detecta lo que dice detectar', () => {
  it.each(CASOS)('%s: la regla %i señala %s', (nombre, regla, archivo) => {
    const violaciones = revisarSeguridad(fixture(nombre));

    expect(violaciones).toHaveLength(1);
    expect(violaciones[0]).toMatchObject({ regla, archivo });
    expect(violaciones[0].mensaje).not.toBe('');
  });
});
