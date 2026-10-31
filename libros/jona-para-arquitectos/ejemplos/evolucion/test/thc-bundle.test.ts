import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { build, type Plugin } from 'esbuild';
import { RAIZ } from './rutas.js';

// Observación 3: en la variante B, el Composer importa de forma estática el servicio real y el mock.
// Se empaqueta la misma aplicación en modo real (useMock: false) y se busca en la salida el mock y sus fixtures.

const THC = join(RAIZ, 'thc-c');
/** El id de la cuenta del fixture exitoso: si aparece, ese fixture viaja con la aplicación. */
const MARCA = 'usr_abc123';
/** El texto del fixture emailDuplicado, el que no compila (observación 1): esbuild no revisa tipos. */
const MARCA_ROTO = 'EMAIL_DUPLICADO';
/** La ruta de los fixtures: solo la tiene el código del mock. */
const MARCA_MOCK = 'crearCuenta.fixture';

/** Sustituye services/composer por services/composerDinamico: la aplicación y el hook no cambian. */
const conComposerDinamico: Plugin = {
  name: 'composer-dinamico',
  setup(b) {
    b.onResolve({ filter: /^\.\.\/services\/composer\.js$/ }, () => ({ path: join(THC, 'services', 'composerDinamico.ts') }));
  },
};

interface Salida { nombre: string; bytes: number; texto: string }

async function empaquetar(opciones: { splitting: boolean; plugins?: Plugin[] }) {
  const resultado = await build({
    entryPoints: [join(THC, 'app.ts')], bundle: true, write: false, minify: true, format: 'esm',
    splitting: opciones.splitting, outdir: join(RAIZ, 'dist', 'bundle'), platform: 'browser', logLevel: 'silent',
    plugins: opciones.plugins ?? [],
  });
  const archivos: Salida[] = resultado.outputFiles.map((f) => ({
    nombre: f.path.split(/[\\/]/).pop()!, bytes: f.contents.byteLength, texto: f.text,
  }));
  const entrada = archivos.find((a) => a.nombre === 'app.js')!;
  const trozos = archivos.filter((a) => a !== entrada);
  const marcas = (a: Salida) => [MARCA, MARCA_ROTO, MARCA_MOCK].filter((m) => a.texto.includes(m));
  console.log(`#   ${[entrada, ...trozos].map((a) => `${a.nombre} ${a.bytes} B [${marcas(a).join(', ')}]`).join('; ')}`);
  return { entrada, trozos, enAlguno: (marca: string) => trozos.some((t) => t.texto.includes(marca)) };
}

describe('Observación 3: con useMock: false, ¿qué llega al bundle?', () => {
  it('Composer estático, un solo archivo: el mock y todos los fixtures van en la entrada', async () => {
    const { entrada, trozos } = await empaquetar({ splitting: false });
    assert.deepEqual(trozos, []);
    assert.ok(entrada.texto.includes('/api/crear-cuenta'), 'el servicio real está');
    assert.ok(entrada.texto.includes(MARCA_MOCK), 'el mock está');
    assert.ok(entrada.texto.includes(MARCA), 'el fixture exitoso está');
    assert.ok(entrada.texto.includes(MARCA_ROTO), 'hasta el fixture que no compila está');
  });

  it('Composer estático con splitting: el mock va en la entrada; los fixtures, en trozos que se publican con ella', async () => {
    const { entrada, enAlguno } = await empaquetar({ splitting: true });
    assert.ok(entrada.texto.includes(MARCA_MOCK), 'el mock está en la entrada');
    assert.ok(!entrada.texto.includes(MARCA), 'los datos del fixture no están en la entrada');
    assert.ok(enAlguno(MARCA) && enAlguno(MARCA_ROTO), 'los fixtures están en la salida, en trozos');
  });

  it('Composer con import() dinámico y splitting: la entrada no lleva ni el mock ni los fixtures', async () => {
    const { entrada, enAlguno } = await empaquetar({ splitting: true, plugins: [conComposerDinamico] });
    assert.ok(entrada.texto.includes('/api/crear-cuenta'), 'el servicio real está');
    assert.ok(!entrada.texto.includes(MARCA_MOCK), 'la entrada no lleva el mock');
    assert.ok(!entrada.texto.includes(MARCA), 'la entrada no lleva fixtures');
    assert.ok(enAlguno(MARCA_MOCK) && enAlguno(MARCA), 'el mock y sus fixtures están en trozos aparte');
  });
});
