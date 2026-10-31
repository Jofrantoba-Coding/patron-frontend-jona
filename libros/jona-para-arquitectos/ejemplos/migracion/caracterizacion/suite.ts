import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { instalarAlmacenamiento } from '../comun/almacenamientoFalso.js';
import { esperarReaccion, instalarBackend, type Escenario } from '../comun/backendFalso.js';
import type { Label } from '../comun/pantalla.js';
import { lectorPara, type Visible } from './lectores.js';

// Pruebas de caracterización: no dicen cómo debería comportarse la pantalla, sino cómo se comporta hoy,
// rarezas incluidas. Se escriben en el paso 01 sin tocar producción, y la MISMA suite debe pasar en cada
// paso siguiente: es la red que permite mover el código sin cambiar lo que la persona ve.
// Observa solo lo que queda fuera del código migrado: controles, peticiones, almacenamiento y la aplicación.

const MENSAJES = {
  correoVacio: 'Ingrese su correo.',
  credenciales: 'Correo o contraseña incorrectos.',
  bloqueado: 'Su usuario está bloqueado. Contacte al administrador.',
  validacion: 'Revise los datos marcados.',
  generico: 'No se pudo iniciar sesión. Intente de nuevo.',
  red: 'No se pudo conectar con el servidor. Revise su conexión.',
  tiempo: 'El servidor no respondió a tiempo. Intente de nuevo.',
  obligatorio: 'Es obligatorio.',
};

const INICIAL: Visible = {
  titulo: 'Iniciar sesión',
  correo: '',
  errorCorreo: '',
  clave: '',
  errorClave: '',
  boton: 'Ingresar',
  claseBoton: 'boton-primario',
  mensaje: '',
  correoHabilitado: true,
  claveHabilitada: true,
  botonHabilitado: true,
};
const OCUPADA: Partial<Visible> = { correoHabilitado: false, claveHabilitada: false, botonHabilitado: false };

/** Lo que la aplicación de cada paso devuelve. Su forma no cambia en toda la migración. */
interface App {
  login: unknown;
  saludo: Label;
}

/** Corre la caracterización contra el paso al que pertenece el archivo de prueba que la llama. */
export function caracterizar(urlDePrueba: string): void {
  const paso = /pasos\/([^/]+)\/test\//.exec(urlDePrueba)?.[1] ?? '(paso desconocido)';
  const urlApp = new URL('../src/App.js', urlDePrueba).href;
  const limpiezas: Array<() => void> = [];

  afterEach(() => {
    for (const limpiar of limpiezas.splice(0)) limpiar();
    mock.timers.reset();
  });

  /** Abre la aplicación del paso con un backend falso y un almacenamiento en memoria. */
  async function abrir({ escenario = 'normal', recordado }: { escenario?: Escenario; recordado?: string } = {}) {
    const backend = instalarBackend({ escenario });
    const almacen = instalarAlmacenamiento(recordado ? { ultimoCorreo: recordado } : {});
    limpiezas.push(backend.desinstalar, almacen.desinstalar);
    const { crearApp } = (await import(urlApp)) as { crearApp: () => App };
    const app = crearApp();
    const pantalla = lectorPara(app.login);
    return {
      ...pantalla,
      backend,
      almacen,
      saludo: () => app.saludo.text,
      ingresar(correo: string, clave: string): void {
        pantalla.escribirCorreo(correo);
        pantalla.escribirClave(clave);
        pantalla.pulsarIngresar();
      },
    };
  }

  describe(`Caracterización (${paso}): lo que la pantalla hace hoy, rarezas incluidas`, () => {
    it('al abrir muestra el formulario vacío y no guarda nada', async () => {
      const p = await abrir();
      assert.deepEqual(p.leer(), INICIAL);
      assert.equal(p.saludo(), '');
      assert.deepEqual(p.almacen.contenido(), {});
    });

    it('al abrir trae escrito el último correo con el que se entró', async () => {
      const p = await abrir({ recordado: 'ana@ejemplo.com' });
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com' });
    });

    it('con credenciales válidas envía usuario y clave, espera ocupada, saluda y guarda el token en «tkn»', async () => {
      const p = await abrir();
      p.ingresar('ana@ejemplo.com', 'secreta123');
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', ...OCUPADA });
      assert.deepEqual(p.backend.peticiones, [{ usuario: 'ana@ejemplo.com', clave: 'secreta123' }]);
      await p.backend.responder();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123' });
      assert.equal(p.saludo(), 'Hola, Ana Torres');
      assert.deepEqual(p.almacen.contenido(), { tkn: 'token-1', ultimoCorreo: 'ana@ejemplo.com' });
    });

    it('con una clave incorrecta muestra el mensaje y borra la clave (rareza conservada)', async () => {
      const p = await abrir();
      p.ingresar('ana@ejemplo.com', 'otra');
      await p.backend.responder();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: '', mensaje: MENSAJES.credenciales });
      assert.equal(p.saludo(), '');
      assert.deepEqual(p.almacen.contenido(), {});
    });

    it('con un usuario bloqueado muestra el mensaje y, a diferencia del caso anterior, conserva la clave', async () => {
      const p = await abrir();
      p.ingresar('bloqueado@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'bloqueado@ejemplo.com', clave: 'secreta123', mensaje: MENSAJES.bloqueado });
    });

    it('sin correo avisa sin llamar al servidor (rareza conservada: solo el correo se valida en el cliente)', async () => {
      const p = await abrir();
      p.ingresar('', 'secreta123');
      await esperarReaccion();
      assert.deepEqual(p.backend.peticiones, []);
      assert.deepEqual(p.leer(), { ...INICIAL, clave: 'secreta123', mensaje: MENSAJES.correoVacio });
    });

    it('sin clave sí llama al servidor y muestra el detalle del 422 junto a la clave', async () => {
      const p = await abrir();
      p.ingresar('ana@ejemplo.com', '');
      await p.backend.responder();
      assert.deepEqual(p.backend.peticiones, [{ usuario: 'ana@ejemplo.com', clave: '' }]);
      assert.deepEqual(p.leer(), {
        ...INICIAL, correo: 'ana@ejemplo.com', mensaje: MENSAJES.validacion, errorClave: MENSAJES.obligatorio,
      });
    });

    it('con un error del servidor muestra el mensaje genérico', async () => {
      const p = await abrir({ escenario: 'errorServidor' });
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', mensaje: MENSAJES.generico });
    });

    it('sin red muestra el mensaje de conexión', async () => {
      const p = await abrir({ escenario: 'sinRed' });
      p.ingresar('ana@ejemplo.com', 'secreta123');
      await p.backend.responder();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', mensaje: MENSAJES.red });
    });

    it('si el servidor no contesta en 10 segundos se rinde y lo dice (un límite que nadie había documentado)', async () => {
      mock.timers.enable({ apis: ['setTimeout'] });
      const p = await abrir({ escenario: 'sinRespuesta' });
      p.ingresar('ana@ejemplo.com', 'secreta123');
      mock.timers.tick(9999);
      await esperarReaccion();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', ...OCUPADA });
      mock.timers.tick(1);
      await esperarReaccion();
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', mensaje: MENSAJES.tiempo });
    });

    it('mientras espera no envía dos veces', async () => {
      const p = await abrir();
      p.ingresar('ana@ejemplo.com', 'secreta123');
      p.pulsarIngresar();
      await p.backend.responder();
      assert.equal(p.backend.peticiones.length, 1);
      assert.equal(p.saludo(), 'Hola, Ana Torres');
    });

    it('un nuevo intento limpia los mensajes del anterior', async () => {
      const p = await abrir();
      p.ingresar('ana@ejemplo.com', '');
      await p.backend.responder();
      assert.equal(p.leer().errorClave, MENSAJES.obligatorio);
      p.ingresar('ana@ejemplo.com', 'secreta123');
      assert.deepEqual(p.leer(), { ...INICIAL, correo: 'ana@ejemplo.com', clave: 'secreta123', ...OCUPADA });
      await p.backend.responder();
      assert.equal(p.saludo(), 'Hola, Ana Torres');
    });
  });
}
