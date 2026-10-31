import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { instalarAlmacenamiento } from '../../../comun/almacenamientoFalso.js';
import { crearAuthServiceFake } from '../src/servicios/AuthServiceFake.js';
import type { InterAuthService, ResultadoLogin, Sesion } from '../src/servicios/InterAuthService.js';
import type { InterUiLogin } from '../src/uilogin/InterUiLogin.js';
import { crearUiLoginImpl } from '../src/uilogin/UiLoginImpl.js';

// La Implementación se prueba sola: sin controles, sin fetch, con el servicio falso.
// Desde el paso 06 también es la dueña del almacenamiento (el último correo y el token).

let almacen = instalarAlmacenamiento();
afterEach(() => {
  almacen.desinstalar();
  almacen = instalarAlmacenamiento();
});

/** Monta la Implementación y guarda el último modelo que entregó. */
function abrir(servicio: InterAuthService = crearAuthServiceFake()) {
  let modelo: InterUiLogin | undefined;
  const sesiones: Sesion[] = [];
  crearUiLoginImpl({ servicio, alAutenticar: (s) => sesiones.push(s) }, (m) => { modelo = m; });
  const actual = () => modelo!;
  return {
    actual,
    sesiones,
    ingresar(correo: string, clave: string): void {
      actual().alCambiarCorreo?.(correo);
      actual().alCambiarClave?.(clave);
      actual().alEnviar?.();
    },
  };
}

const esperar = () => new Promise<void>((resolver) => setImmediate(resolver));
const fijo = (resultado: ResultadoLogin): InterAuthService => ({ iniciarSesion: async () => resultado });
/** Datos del modelo, sin los callbacks. */
const datos = ({ alCambiarCorreo: _a, alCambiarClave: _b, alEnviar: _c, ...resto }: InterUiLogin) => resto;

describe('UiLoginImpl', () => {
  it('entrega un modelo inicial vacío', () => {
    assert.deepEqual(datos(abrir().actual()),
      { correo: '', clave: '', errorCorreo: '', errorClave: '', mensaje: '', ocupada: false });
  });

  it('empieza con el último correo guardado', () => {
    almacen.desinstalar();
    almacen = instalarAlmacenamiento({ ultimoCorreo: 'ana@ejemplo.com' });
    assert.equal(abrir().actual().correo, 'ana@ejemplo.com');
  });

  it('con credenciales válidas queda ocupada, guarda el token y el correo, avisa la sesión y se libera', async () => {
    const p = abrir();
    p.ingresar('ana@ejemplo.com', 'secreta123');
    assert.equal(p.actual().ocupada, true);
    await esperar();
    assert.equal(p.actual().ocupada, false);
    assert.deepEqual(p.sesiones.map((s) => s.usuario.nombre), ['Ana Torres']);
    assert.deepEqual(almacen.contenido(), { tkn: 'token-1', ultimoCorreo: 'ana@ejemplo.com' });
  });

  it('sin correo avisa y no llama al servicio (solo el correo se valida aquí)', async () => {
    let llamadas = 0;
    const p = abrir({ iniciarSesion: async () => { llamadas += 1; return { tipo: 'error', codigo: 'X', detalles: [] }; } });
    p.ingresar('', 'secreta123');
    await esperar();
    assert.equal(llamadas, 0);
    assert.equal(p.actual().mensaje, 'Ingrese su correo.');
  });

  it('con credenciales inválidas muestra el mensaje, borra la clave y no guarda nada', async () => {
    const p = abrir();
    p.ingresar('ana@ejemplo.com', 'otra');
    await esperar();
    assert.deepEqual([p.actual().mensaje, p.actual().clave], ['Correo o contraseña incorrectos.', '']);
    assert.deepEqual(almacen.contenido(), {});
  });

  it('pone cada detalle de validación junto a su campo', async () => {
    const p = abrir();
    p.ingresar('ana@ejemplo.com', '');
    await esperar();
    assert.deepEqual([p.actual().mensaje, p.actual().errorCorreo, p.actual().errorClave], ['Revise los datos marcados.', '', 'Es obligatorio.']);
  });

  for (const [codigo, mensaje] of [
    ['USER_DISABLED', 'Su usuario está bloqueado. Contacte al administrador.'],
    ['SIN_RED', 'No se pudo conectar con el servidor. Revise su conexión.'],
    ['TIEMPO_AGOTADO', 'El servidor no respondió a tiempo. Intente de nuevo.'],
    ['INTERNAL_ERROR', 'No se pudo iniciar sesión. Intente de nuevo.'],
  ]) {
    it(`traduce ${codigo} a su mensaje`, async () => {
      const p = abrir(fijo({ tipo: 'error', codigo, detalles: [] }));
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await esperar();
      assert.equal(p.actual().mensaje, mensaje);
    });
  }

  it('mientras espera no envía dos veces', async () => {
    let llamadas = 0;
    const fake = crearAuthServiceFake();
    const p = abrir({ iniciarSesion: (c, k) => { llamadas += 1; return fake.iniciarSesion(c, k); } });
    p.ingresar('ana@ejemplo.com', 'secreta123');
    p.actual().alEnviar?.();
    await esperar();
    assert.equal(llamadas, 1);
  });
});
