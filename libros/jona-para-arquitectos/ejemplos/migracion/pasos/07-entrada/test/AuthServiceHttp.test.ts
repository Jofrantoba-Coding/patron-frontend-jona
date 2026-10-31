import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { esperarReaccion, instalarBackend, type OpcionesBackend } from '../../../comun/backendFalso.js';
import { crearAuthServiceHttp } from '../src/servicios/AuthServiceHttp.js';

// El adaptador traduce el cable del backend al contrato de servicio, incluido lo que antes
// hacía la pantalla a mano: el límite de tiempo y los nombres de campo del backend.

let desinstalar: (() => void) | undefined;
afterEach(() => {
  desinstalar?.();
  mock.timers.reset();
});

function backend(opciones: OpcionesBackend = {}) {
  const b = instalarBackend({ retener: false, ...opciones });
  desinstalar = b.desinstalar;
  return b;
}

describe('AuthServiceHttp', () => {
  it('envía usuario y clave, y devuelve la sesión', async () => {
    const b = backend();
    const resultado = await crearAuthServiceHttp().iniciarSesion('ana@ejemplo.com', 'secreta123');
    assert.deepEqual(b.peticiones, [{ usuario: 'ana@ejemplo.com', clave: 'secreta123' }]);
    assert.deepEqual(resultado, {
      tipo: 'ok', sesion: { token: 'token-1', usuario: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } },
    });
  });

  it('traduce el 422 con los nombres de campo del contrato (usuario -> correo)', async () => {
    backend();
    assert.deepEqual(await crearAuthServiceHttp().iniciarSesion('', ''), {
      tipo: 'error', codigo: 'VALIDATION_ERROR',
      detalles: [{ campo: 'correo', mensaje: 'Es obligatorio.' }, { campo: 'clave', mensaje: 'Es obligatorio.' }],
    });
  });

  it('un error del servidor conserva su código', async () => {
    backend({ escenario: 'errorServidor' });
    assert.deepEqual(await crearAuthServiceHttp().iniciarSesion('ana@ejemplo.com', 'secreta123'),
      { tipo: 'error', codigo: 'INTERNAL_ERROR', detalles: [] });
  });

  it('sin red devuelve SIN_RED', async () => {
    backend({ escenario: 'sinRed' });
    assert.deepEqual(await crearAuthServiceHttp().iniciarSesion('ana@ejemplo.com', 'secreta123'),
      { tipo: 'error', codigo: 'SIN_RED', detalles: [] });
  });

  it('si el backend no contesta a tiempo, aborta y devuelve TIEMPO_AGOTADO', async () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    backend({ escenario: 'sinRespuesta' });
    const promesa = crearAuthServiceHttp({ limiteMs: 500 }).iniciarSesion('ana@ejemplo.com', 'secreta123');
    mock.timers.tick(500);
    await esperarReaccion();
    assert.deepEqual(await promesa, { tipo: 'error', codigo: 'TIEMPO_AGOTADO', detalles: [] });
  });
});
