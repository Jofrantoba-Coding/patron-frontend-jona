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
    const pantalla = crearUiLogin({ servicio: crearAuthServiceFake(), alAutenticar: () => {} });
    assert.deepEqual([pantalla.titulo.text, pantalla.boton.label], ['Iniciar sesión', 'Ingresar']);
  });

  it('con el servicio inyectado, la persona entra sin red', async () => {
    const sesiones: Sesion[] = [];
    const pantalla = crearUiLogin({ servicio: crearAuthServiceFake(), alAutenticar: (s) => sesiones.push(s) });
    pantalla.correo.type('ana@ejemplo.com');
    pantalla.clave.type('secreta123');
    pantalla.boton.click();
    await new Promise<void>((resolver) => setImmediate(resolver));
    assert.deepEqual(sesiones.map((s) => s.usuario.nombre), ['Ana Torres']);
  });
});
