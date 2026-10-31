import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Las pruebas compiladas corren desde dist/test; las fuentes .ts están dos carpetas arriba.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** Módulo -> módulos que importa. Ids relativos a la raíz, con "/" y sin extensión. */
type ImportGraph = Map<string, string[]>;

const moduleId = (file: string) => relative(ROOT, file).split(sep).join('/').replace(/\.(ts|js)$/, '');

/** Lee los imports de cada .ts de una carpeta con ts.preProcessFile (sin compilar ni ejecutar). */
function importGraph(folder: string): ImportGraph {
  const dir = join(ROOT, folder);
  const graph: ImportGraph = new Map();
  for (const file of readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts'))) {
    const path = join(dir, file);
    const { importedFiles } = ts.preProcessFile(readFileSync(path, 'utf8'), true, true);
    const imports = importedFiles
      .map((imported) => imported.fileName)
      .filter((name) => name.startsWith('.'))
      .map((name) => moduleId(resolve(dirname(path), name)));
    graph.set(moduleId(path), imports);
  }
  return graph;
}

const PORT = 'src/comun/InterAuthService';
const FAKE = 'src/comun/AuthServiceFake';
const WIDGETS = 'src/comun/pantalla';
const MESSAGES = 'src/comun/mensajes';

/** Módulos que importan alguno de los destinos, ordenados. */
const importersOf = (graph: ImportGraph, ...targets: string[]) =>
  [...graph].filter(([, imports]) => imports.some((m) => targets.includes(m))).map(([m]) => m).sort();

/** Pares "módulo -> destino" prohibidos que sí aparecen. Vacío = la regla se cumple. */
const violations = (graph: ImportGraph, modules: string[], forbidden: string[]) =>
  modules.flatMap((m) => (graph.get(m) ?? []).filter((t) => forbidden.includes(t)).map((t) => `${m} -> ${t}`));

/** La matriz esperada: quién conoce el servicio, quién los controles, quién la vista y quién decide el mensaje. */
const EXPECTED = {
  mvc: { view: 'LoginView', service: ['LoginModel'], widgets: ['LoginView'], viewImporters: ['createLogin'], messages: ['LoginModel'] },
  mvp: { view: 'LoginView', service: ['LoginPresenter'], widgets: ['LoginView'], viewImporters: ['createLogin'], messages: ['LoginPresenter'] },
  mvvm: { view: 'LoginView', service: ['LoginViewModel'], widgets: ['LoginView'], viewImporters: ['createLogin'], messages: ['LoginViewModel'] },
  'jona-clasica': { view: 'UiLogin', service: ['UiLoginImpl'], widgets: ['UiLogin'], viewImporters: ['UiLoginImpl'], messages: ['UiLogin', 'UiLoginImpl'] },
  'jona-minima': { view: 'UiLoginView', service: ['UiLoginImpl'], widgets: ['UiLoginView'], viewImporters: ['UiLogin'], messages: ['UiLoginImpl'] },
};

const graph = importGraph('src');
const inPattern = (pattern: string, modules: string[]) =>
  modules.filter((m) => m.startsWith(`src/${pattern}/`)).map((m) => m.slice(`src/${pattern}/`.length));
const viewModules = Object.entries(EXPECTED).map(([pattern, { view }]) => `src/${pattern}/${view}`);

describe('estructura: quién conoce a quién en cada patrón', () => {
  it('encuentra los cinco patrones y sus vistas (la regla no es vacía)', () => {
    for (const view of viewModules) assert.ok(graph.has(view), `falta ${view}`);
  });

  it('ninguna vista importa el servicio, en ningún patrón', () => {
    assert.deepEqual(violations(graph, viewModules, [PORT, FAKE]), []);
  });

  for (const [pattern, expected] of Object.entries(EXPECTED)) {
    describe(pattern, () => {
      it(`solo ${expected.service.join(', ')} conoce el servicio`, () => {
        assert.deepEqual(inPattern(pattern, importersOf(graph, PORT, FAKE)), expected.service);
      });
      it(`solo ${expected.widgets.join(', ')} conoce los controles`, () => {
        assert.deepEqual(inPattern(pattern, importersOf(graph, WIDGETS)), expected.widgets);
      });
      it(`solo ${expected.viewImporters.join(', ')} importa la vista ${expected.view}`, () => {
        assert.deepEqual(inPattern(pattern, importersOf(graph, `src/${pattern}/${expected.view}`)), expected.viewImporters);
      });
      it(`el mensaje lo decide ${expected.messages.join(' y ')}`, () => {
        assert.deepEqual(inPattern(pattern, importersOf(graph, MESSAGES)), expected.messages);
      });
    });
  }

  it('mvp: el presentador conoce la interfaz de la vista, nunca LoginView', () => {
    assert.ok(graph.get('src/mvp/LoginPresenter')?.includes('src/mvp/InterLoginView'));
    assert.deepEqual(violations(graph, ['src/mvp/LoginPresenter'], ['src/mvp/LoginView']), []);
  });

  it('jona-minima: la Vista importa solo el contrato y los controles', () => {
    assert.deepEqual(graph.get('src/jona-minima/UiLoginView')?.sort(), ['src/comun/pantalla', 'src/jona-minima/InterUiLogin']);
  });
});

describe('estructura: las reglas detectan un acoplamiento real (fixture)', () => {
  const coupled = importGraph('test/fixtures/acoplado');

  it('una vista que importa el servicio se reporta', () => {
    assert.deepEqual(violations(coupled, ['test/fixtures/acoplado/LoginView'], [PORT, FAKE]), [
      `test/fixtures/acoplado/LoginView -> ${PORT}`,
    ]);
  });

  it('un presentador que importa la vista concreta se reporta', () => {
    assert.deepEqual(violations(coupled, ['test/fixtures/acoplado/LoginPresenter'], ['test/fixtures/acoplado/LoginView']), [
      'test/fixtures/acoplado/LoginPresenter -> test/fixtures/acoplado/LoginView',
    ]);
  });
});
