import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { instalarAlmacenamiento } from '../../../comun/almacenamientoFalso.js';
import { crearAuthServiceFake } from '../src/servicios/AuthServiceFake.js';
import type { Sesion } from '../src/servicios/InterAuthService.js';
import { crearUiLogin } from '../src/uilogin/UiLogin.js';

// La entrada compone Implementación y Vista con el servicio que recibe. Con el falso, la pantalla entera funciona sin red.

let almacen = instalarAlmacenamiento();
afterEach(() => {
  almacen.desinstalar();
  almacen = instalarAlmacenamiento();
});

describe('UiLogin (entrada)', () => {
  it('aplica los DEFAULTS del contrato al abrir', () => {
    const raiz = crearUiLogin({ servicio: crearAuthServiceFake(), alAutenticar: () => {} });
    assert.deepEqual([raiz.texto('titulo'), raiz.texto('ingresar')], ['Iniciar sesión', 'Ingresar']);
  });

  it('con el servicio inyectado, la persona entra sin red', async () => {
    const sesiones: Sesion[] = [];
    const raiz = crearUiLogin({ servicio: crearAuthServiceFake(), alAutenticar: (s) => sesiones.push(s) });
    raiz.escribir('correo', 'ana@ejemplo.com');
    raiz.escribir('clave', 'secreta123');
    raiz.pulsar('ingresar');
    await new Promise<void>((resolver) => setImmediate(resolver));
    assert.deepEqual(sesiones.map((s) => s.usuario.nombre), ['Ana Torres']);
  });
});
