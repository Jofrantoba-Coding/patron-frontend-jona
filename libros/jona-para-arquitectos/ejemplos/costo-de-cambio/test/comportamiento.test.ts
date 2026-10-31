import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { CAMBIOS, VARIANTES } from '../herramientas/medir.js';
import { instalarBackend, type Escenario, type Formato } from './backendFalso.js';
import { montar, type CrearLogin, type PantallaVisible, type Presentaciones, type ResultadoLogin } from './montaje.js';

// Una sola suite de comportamiento para cada (variante, instantánea): toda instantánea debe
// comportarse igual que v0, salvo lo que su pedido de cambio dice que cambie.

const INSTANTANEAS = ['v0', ...CAMBIOS.map((c) => c.id)];
const VARIANTES_SRC = fileURLToPath(new URL('../../variantes', import.meta.url));
const formatoDe = (instantanea: string): Formato => (instantanea === 'formato-backend' ? 'v2' : 'v1');

const MENSAJES = {
  credenciales: 'Correo o contraseña incorrectos.',
  bloqueado: 'Su usuario está bloqueado. Contacte al administrador.',
  validacion: 'Revise los datos marcados.',
  generico: 'No se pudo iniciar sesión. Intente de nuevo.',
  red: 'No se pudo conectar con el servidor. Revise su conexión.',
  obligatorio: 'Es obligatorio.',
};

let desinstalar: (() => void) | undefined;
afterEach(() => {
  desinstalar?.();
  desinstalar = undefined;
});

/** Lo que una persona hace y ve, sin saber qué variante hay detrás. */
function abrir(crear: CrearLogin, formato: Formato, escenario: Escenario = 'normal') {
  const backend = instalarBackend(formato, escenario);
  desinstalar = backend.desinstalar;
  let autenticado: ResultadoLogin | undefined;
  const screen: PantallaVisible = crear({ baseUrl: 'http://backend.prueba', onAuthenticated: (r) => { autenticado = r; } });
  return {
    screen,
    backend,
    ingresar(email: string, password: string): void {
      screen.email.type(email);
      screen.password.type(password);
      screen.submit.click();
    },
    mensaje: () => screen.message.text,
    /** El error que se ve junto al campo, esté en una etiqueta aparte o en el propio control. */
    errorDe: (campo: 'email' | 'password') =>
      [screen[`${campo}Error` as const]?.text ?? '', screen[campo].error].filter((t) => t !== '').join(' | '),
    ocupada: () => !screen.submit.enabled,
    autenticado: () => autenticado,
  };
}

function describirLogin(nombre: string, crear: CrearLogin, formato: Formato): void {
  describe(`${nombre}: comportamiento`, () => {
    it('con credenciales válidas avisa con el token y el usuario', async () => {
      const p = abrir(crear, formato);
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.deepEqual(p.autenticado(), { token: 'token-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } });
      assert.equal(p.mensaje(), '');
      assert.equal(p.ocupada(), false);
    });

    it('con una clave incorrecta muestra su mensaje', async () => {
      const p = abrir(crear, formato);
      p.ingresar('ana@ejemplo.com', 'otra');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.credenciales);
      assert.equal(p.autenticado(), undefined);
      assert.equal(p.ocupada(), false);
    });

    it('con un usuario bloqueado (403) muestra su mensaje', async () => {
      const p = abrir(crear, formato);
      p.ingresar('bloqueado@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.bloqueado);
      assert.equal(p.autenticado(), undefined);
    });

    it('sin correo muestra el detalle del 422 junto al correo', async () => {
      const p = abrir(crear, formato);
      p.ingresar('', 'secreta123');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.validacion);
      assert.equal(p.errorDe('email'), MENSAJES.obligatorio);
      assert.equal(p.errorDe('password'), '');
    });

    it('sin clave muestra el detalle del 422 junto a la clave', async () => {
      const p = abrir(crear, formato);
      p.ingresar('ana@ejemplo.com', '');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.validacion);
      assert.equal(p.errorDe('email'), '');
      assert.equal(p.errorDe('password'), MENSAJES.obligatorio);
    });

    it('con un error del servidor muestra el mensaje genérico', async () => {
      const p = abrir(crear, formato, 'errorServidor');
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.generico);
      assert.equal(p.ocupada(), false);
    });

    it('sin red muestra el mensaje de conexión', async () => {
      const p = abrir(crear, formato, 'sinRed');
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.equal(p.mensaje(), MENSAJES.red);
      assert.equal(p.ocupada(), false);
    });

    it('mientras espera está ocupada y no envía dos veces', async () => {
      const p = abrir(crear, formato);
      p.ingresar('ana@ejemplo.com', 'secreta123');
      assert.equal(p.ocupada(), true);
      p.screen.submit.click();
      await p.backend.responder();
      assert.equal(p.backend.peticiones.length, 1);
      assert.equal(p.ocupada(), false);
      assert.equal(p.autenticado()?.user.nombre, 'Ana Torres');
    });

    it('un nuevo intento limpia los errores anteriores', async () => {
      const p = abrir(crear, formato);
      p.ingresar('', '');
      await p.backend.responder();
      assert.equal(p.errorDe('email'), MENSAJES.obligatorio);
      p.ingresar('ana@ejemplo.com', 'secreta123');
      assert.deepEqual([p.mensaje(), p.errorDe('email'), p.errorDe('password')], ['', '', '']);
      await p.backend.responder();
      assert.equal(p.autenticado()?.user.id, 1);
    });
  });
}

/** Lo que cada instantánea debe mostrar y enviar: igual a v0 salvo su pedido de cambio. */
function describirCambio(variante: string, instantanea: string, { normal, compacta }: Presentaciones): void {
  const formato = formatoDe(instantanea);

  describe(`${variante}/${instantanea}: lo que pide el cambio`, () => {
    it('C1: el botón cambia de texto y de clase solo en estilo-boton', () => {
      const { screen } = abrir(normal, formato);
      const esperado = instantanea === 'estilo-boton' ? ['Entrar', 'boton-acento'] : ['Ingresar', 'boton-primario'];
      assert.deepEqual([screen.title?.text, screen.submit.label, screen.submit.className], ['Iniciar sesión', ...esperado]);
    });

    it('la petición lleva los campos del formato de cable de la instantánea', async () => {
      const p = abrir(normal, formato);
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      const esperada: Record<string, unknown> =
        formato === 'v2' ? { correo: 'ana@ejemplo.com', clave: 'secreta123' } : { usuario: 'ana@ejemplo.com', clave: 'secreta123' };
      if (instantanea === 'campo-recordarme') esperada.recordarme = false;
      assert.deepEqual(p.backend.peticiones, [esperada]);
    });

    if (instantanea === 'campo-recordarme') {
      it('C2: marcar «Recordarme» envía recordarme: true', async () => {
        const p = abrir(normal, formato);
        assert.equal(p.screen.remember?.label, 'Recordarme');
        assert.equal(p.screen.remember?.checked, false);
        p.screen.remember?.toggle();
        p.ingresar('ana@ejemplo.com', 'secreta123');
        assert.equal(p.screen.remember?.enabled, false);
        await p.backend.responder();
        assert.equal(p.backend.peticiones[0].recordarme, true);
        assert.equal(p.screen.remember?.checked, true);
      });
    } else {
      it('sin C2 no hay casilla «Recordarme»', () => {
        assert.equal(abrir(normal, formato).screen.remember, undefined);
      });
    }

    if (instantanea === 'formato-backend') {
      it('C3: la suite corre contra el formato v2 y el comportamiento no cambia', () => {
        assert.equal(formato, 'v2');
      });
    }

    if (instantanea === 'segunda-vista') {
      it('C4: la vista compacta no tiene título y muestra los errores dentro del campo', async () => {
        assert.ok(compacta);
        const p = abrir(compacta, formato);
        assert.equal(p.screen.title?.text ?? '', '');
        p.ingresar('', '');
        await p.backend.responder();
        assert.deepEqual([p.screen.email.error, p.screen.password.error], [MENSAJES.obligatorio, MENSAJES.obligatorio]);
      });

      for (const [caso, email, password] of [
        ['clave incorrecta', 'ana@ejemplo.com', 'otra'],
        ['usuario bloqueado', 'bloqueado@ejemplo.com', 'secreta123'],
        ['sin datos', '', ''],
      ]) {
        it(`C4: las dos vistas muestran los mismos mensajes (${caso})`, async () => {
          const textos: string[][] = [];
          for (const crear of [normal, compacta!]) {
            const p = abrir(crear, formato);
            p.ingresar(email, password);
            await p.backend.responder();
            textos.push([p.mensaje(), p.errorDe('email'), p.errorDe('password')]);
            desinstalar?.();
          }
          assert.deepEqual(textos[0], textos[1]);
        });
      }
    } else {
      it('sin C4 hay una sola vista', () => {
        assert.equal(compacta, undefined);
      });
    }

    it('C5: solo prueba-bloqueado agrega una prueba del usuario bloqueado', () => {
      const carpeta = join(VARIANTES_SRC, variante, instantanea, 'test');
      const pruebas = readdirSync(carpeta).map((archivo) => readFileSync(join(carpeta, archivo), 'utf8')).join('\n');
      assert.equal(/bloquead/i.test(pruebas), instantanea === 'prueba-bloqueado');
    });
  });
}

for (const variante of VARIANTES) {
  for (const instantanea of INSTANTANEAS) {
    const nombre = `${variante}/${instantanea}`;
    let presentaciones: Presentaciones;
    try {
      presentaciones = await montar(variante, instantanea);
    } catch (error) {
      it(`${nombre}: la instantánea existe y se puede montar`, () => {
        throw error;
      });
      continue;
    }
    describirLogin(nombre, presentaciones.normal, formatoDe(instantanea));
    if (presentaciones.compacta) describirLogin(`${nombre} (compacta)`, presentaciones.compacta, formatoDe(instantanea));
    describirCambio(variante, instantanea, presentaciones);
  }
}
