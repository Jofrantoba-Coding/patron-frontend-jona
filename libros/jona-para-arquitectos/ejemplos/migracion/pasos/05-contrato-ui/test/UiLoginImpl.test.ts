import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { crearAuthServiceFake } from '../src/servicios/AuthServiceFake.js';
import type { InterAuthService, ResultadoLogin, Sesion } from '../src/servicios/InterAuthService.js';
import type { InterUiLogin } from '../src/uilogin/InterUiLogin.js';
import { crearUiLoginImpl } from '../src/uilogin/UiLoginImpl.js';

// La Implementación se prueba sola: sin controles, sin fetch, con el servicio falso.

/** Monta la Implementación y guarda el último modelo que entregó. */
function abrir(servicio: InterAuthService = crearAuthServiceFake(), correoInicial = '') {
  let modelo: InterUiLogin | undefined;
  const sesiones: Sesion[] = [];
  crearUiLoginImpl({ servicio, correoInicial, alAutenticar: (s) => sesiones.push(s) }, (m) => { modelo = m; });
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
  it('entrega un modelo inicial con el correo inicial', () => {
    assert.deepEqual(datos(abrir(undefined, 'ana@ejemplo.com').actual()),
      { correo: 'ana@ejemplo.com', clave: '', errorCorreo: '', errorClave: '', mensaje: '', ocupada: false });
  });

  it('con credenciales válidas queda ocupada, luego avisa la sesión y se libera', async () => {
    const p = abrir();
    p.ingresar('ana@ejemplo.com', 'secreta123');
    assert.equal(p.actual().ocupada, true);
    await esperar();
    assert.equal(p.actual().ocupada, false);
    assert.deepEqual(p.sesiones.map((s) => s.usuario.nombre), ['Ana Torres']);
  });

  it('sin correo avisa y no llama al servicio (solo el correo se valida aquí)', async () => {
    let llamadas = 0;
    const p = abrir({ iniciarSesion: async () => { llamadas += 1; return { tipo: 'error', codigo: 'X', detalles: [] }; } });
    p.ingresar('', 'secreta123');
    await esperar();
    assert.equal(llamadas, 0);
    assert.equal(p.actual().mensaje, 'Ingrese su correo.');
  });

  it('con credenciales inválidas muestra el mensaje y borra la clave', async () => {
    const p = abrir();
    p.ingresar('ana@ejemplo.com', 'otra');
    await esperar();
    assert.deepEqual([p.actual().mensaje, p.actual().clave], ['Correo o contraseña incorrectos.', '']);
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
