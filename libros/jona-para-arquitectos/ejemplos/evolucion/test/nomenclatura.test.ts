import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { archivosAnalizados, revisar } from '../herramientas/jona-check.js';
import { leerMapeo, normalizar, renombrarRuta, unidadesDe } from '../nomenclatura/renombrar.js';
import { RAIZ } from './rutas.js';

// La nomenclatura anterior (orquestador = *View, render sin sufijo, *TemplateModel) frente a la canónica
// (entrada sin sufijo, vista pura = *View, *Base). Mismo código, mismos archivos: solo cambian los nombres.

const ANTES = join(RAIZ, 'nomenclatura', 'antes');
const DESPUES = join(RAIZ, 'nomenclatura', 'despues');
const MAPEO = leerMapeo(join(RAIZ, 'nomenclatura', 'mapeo.json'));
const UNIDADES = unidadesDe(archivosAnalizados(ANTES));
const UNIDAD = 'views/uiiniciarsesion';
const leer = (ruta: string) => readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n');

describe('Nomenclatura anterior: el verificador canónico la lee al revés', () => {
  it('en antes/ informa una sola violación: N4 en App.ts, que importa el orquestador', () => {
    const violaciones = revisar(ANTES);
    assert.deepEqual(violaciones, [{
      regla: 'JONA-N4', archivo: 'App.ts', linea: 3,
      mensaje: `importa ${UNIDAD}/UiIniciarSesionView.ts, interno de la unidad ${UNIDAD}; use su entrada: ${UNIDAD}/UiIniciarSesion.ts`,
    }]);
  });

  it('la "entrada" que sugiere es el render: el archivo que no instancia la Implementación', () => {
    const sugerida = leer(join(ANTES, UNIDAD, 'UiIniciarSesion.ts'));
    const importada = leer(join(ANTES, UNIDAD, 'UiIniciarSesionView.ts'));
    assert.doesNotMatch(sugerida, /useUiIniciarSesionImpl/, 'la sugerida es solo render');
    assert.match(importada, /useUiIniciarSesionImpl\(\)/, 'la importada es la que compone la unidad');
  });
});

describe('Nomenclatura canónica: el mismo código no tiene violaciones', () => {
  it('en despues/ el verificador no informa nada', () => {
    assert.deepEqual(revisar(DESPUES), []);
  });
});

describe('El cambio es solo de nombres', () => {
  it('la unidad se reconoce por su contrato', () => {
    assert.deepEqual(UNIDADES, ['UiIniciarSesion']);
  });

  it('aplicar mapeo.json a los archivos de antes/ da exactamente los archivos de despues/', () => {
    const renombrados = archivosAnalizados(ANTES).map((ruta) => renombrarRuta(ruta, MAPEO, UNIDADES)).sort();
    assert.deepEqual(renombrados, archivosAnalizados(DESPUES));
  });

  it('cada archivo de antes/, con los identificadores renombrados, es idéntico a su par de despues/', () => {
    for (const ruta of archivosAnalizados(ANTES)) {
      const par = renombrarRuta(ruta, MAPEO, UNIDADES);
      assert.equal(normalizar(leer(join(ANTES, ruta)), MAPEO, UNIDADES), leer(join(DESPUES, par)), `${ruta} -> ${par}`);
    }
  });

  it('los renombres se aplican a la vez: el render y el orquestador intercambian nombres', () => {
    assert.equal(renombrarRuta(`${UNIDAD}/UiIniciarSesion.ts`, MAPEO, UNIDADES), `${UNIDAD}/UiIniciarSesionView.ts`);
    assert.equal(renombrarRuta(`${UNIDAD}/UiIniciarSesionView.ts`, MAPEO, UNIDADES), `${UNIDAD}/UiIniciarSesion.ts`);
    assert.equal(renombrarRuta(`${UNIDAD}/UiIniciarSesionTemplateModel.ts`, MAPEO, UNIDADES), `${UNIDAD}/UiIniciarSesionBase.ts`);
  });

  it('las dos aplicaciones producen la misma salida', async () => {
    const antes = await import('../nomenclatura/antes/App.js');
    const despues = await import('../nomenclatura/despues/App.js');
    for (const email of ['ana@jona.dev', 'intruso@otro.com']) {
      assert.equal(antes.App(email), despues.App(email));
    }
    assert.match(antes.App('ana@jona.dev'), /Bienvenida, ana@jona\.dev/);
  });
});

// La aplicación real con la nomenclatura anterior; solo se lee. Si no está en este checkout, se omite.
const REAL = join(RAIZ, '..', '..', '..', '..', 'web_ts', 'appjona_codex_react_hooks', 'src');

describe('Caso real: web_ts/appjona_codex_react_hooks', { skip: existsSync(REAL) ? false : `no existe ${REAL}` }, () => {
  it('el verificador sugiere como entrada el render de la unidad uihome', () => {
    const n4 = revisar(REAL).filter((v) => v.regla === 'JONA-N4' && v.archivo === 'App.tsx');
    assert.ok(n4.some((v) => v.mensaje
      === 'importa views/uihome/UiHomeView.tsx, interno de la unidad views/uihome; use su entrada: views/uihome/UiHome.tsx'),
    n4.map((v) => v.mensaje).join('\n'));
  });

  it('el archivo sugerido es el render y el importado es el orquestador', () => {
    assert.doesNotMatch(leer(join(REAL, 'views/uihome/UiHome.tsx')), /useUiHomeImpl\(/);
    assert.match(leer(join(REAL, 'views/uihome/UiHomeView.tsx')), /useUiHomeImpl\(/);
  });
});
