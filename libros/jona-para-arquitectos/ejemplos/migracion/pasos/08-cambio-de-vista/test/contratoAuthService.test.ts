import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { instalarBackend } from '../../../comun/backendFalso.js';
import { crearAuthServiceFake } from '../src/servicios/AuthServiceFake.js';
import { crearAuthServiceHttp } from '../src/servicios/AuthServiceHttp.js';
import type { InterAuthService } from '../src/servicios/InterAuthService.js';

// Una suite de contrato, dos fuentes: el servicio falso y el adaptador HTTP contra el backend falso.
// Si las dos pasan la misma suite, quien use el falso (pruebas, demos, desarrollo sin backend) ve lo mismo que en producción.

let desinstalar: (() => void) | undefined;
afterEach(() => {
  desinstalar?.();
  desinstalar = undefined;
});

const FUENTES: Array<[string, () => InterAuthService]> = [
  ['AuthServiceFake', () => crearAuthServiceFake()],
  ['AuthServiceHttp', () => {
    desinstalar = instalarBackend({ retener: false }).desinstalar;
    return crearAuthServiceHttp();
  }],
];

for (const [nombre, crear] of FUENTES) {
  describe(`Contrato InterAuthService: ${nombre}`, () => {
    it('con credenciales válidas devuelve la sesión', async () => {
      assert.deepEqual(await crear().iniciarSesion('ana@ejemplo.com', 'secreta123'), {
        tipo: 'ok', sesion: { token: 'token-1', usuario: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } },
      });
    });

    it('con una clave incorrecta devuelve INVALID_CREDENTIALS', async () => {
      assert.deepEqual(await crear().iniciarSesion('ana@ejemplo.com', 'otra'),
        { tipo: 'error', codigo: 'INVALID_CREDENTIALS', detalles: [] });
    });

    it('con un usuario bloqueado devuelve USER_DISABLED', async () => {
      assert.deepEqual(await crear().iniciarSesion('bloqueado@ejemplo.com', 'secreta123'),
        { tipo: 'error', codigo: 'USER_DISABLED', detalles: [] });
    });

    it('con campos vacíos devuelve VALIDATION_ERROR con un detalle por campo', async () => {
      assert.deepEqual(await crear().iniciarSesion('', ''), {
        tipo: 'error', codigo: 'VALIDATION_ERROR',
        detalles: [{ campo: 'correo', mensaje: 'Es obligatorio.' }, { campo: 'clave', mensaje: 'Es obligatorio.' }],
      });
    });
  });
}
