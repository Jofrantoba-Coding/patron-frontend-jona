#!/usr/bin/env node
// Instala, compila y prueba todos los ejemplos en secuencia, y resume el resultado.
// Uso: node run-all.mjs [--limpio]   (--limpio borra node_modules, dist, target, bin y obj antes)
import { spawn, spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const at = (...parts) => join(ROOT, ...parts);

// Cada paso: carpeta, comando y cómo leer la cantidad de pruebas de su salida.
const NODE_TEST = /^# pass (\d+)/m;
const VITEST = /Tests\s+(\d+) passed/;
const SUREFIRE = /Tests run: (\d+), Failures: 0, Errors: 0, Skipped: (\d+)\s*$/m;
const DOTNET = /(?:Passed|Superado):\s+(\d+)/;
const DIAGRAMAS = /^(\d+) diagramas, 0 con error/m;

/** npm ci, npm run build y npm test en una carpeta. */
const npmProject = (name, count) => [
  { name, dir: at(name), cmd: 'npm ci --no-audit --no-fund' },
  { name, dir: at(name), cmd: 'npm run build' },
  { name, dir: at(name), cmd: 'npm test', count },
];

const STEPS = [
  { name: 'mock-server', dir: at('mock-server'), cmd: 'npm ci --no-audit --no-fund' },
  { name: 'mock-server', dir: at('mock-server'), cmd: 'npm test', count: NODE_TEST },
  // Sin dependencias: el plan de pruebas (Gherkin) contra los escenarios del servidor mock.
  { name: 'flujo-bdd', dir: at('flujo-bdd'), cmd: 'npm test', count: NODE_TEST },
  { name: 'web-react', dir: at('web-react'), cmd: 'npm ci --no-audit --no-fund' },
  { name: 'web-react', dir: at('web-react'), cmd: 'npm run build' },
  { name: 'web-react', dir: at('web-react'), cmd: 'npm test', count: VITEST },
  { name: 'java-swing', dir: at('java-swing'), cmd: 'mvn -B test', count: SUREFIRE },
  ...npmProject('web-ts-puro', VITEST),
  ...npmProject('web-angular', VITEST),
  ...npmProject('web-vue', VITEST),
  { name: 'java-javafx', dir: at('java-javafx'), cmd: 'mvn -B test', count: SUREFIRE },
  // La aplicación WPF solo compila en Windows; la Implementación y el adaptador se prueban en cualquier sistema.
  ...(process.platform === 'win32' ? [{ name: 'dotnet-wpf', dir: at('dotnet-wpf'), cmd: 'dotnet build' }] : []),
  { name: 'dotnet-wpf', dir: at('dotnet-wpf'), cmd: 'dotnet test JonaLogin.Tests', count: DOTNET },
  ...npmProject('electron', VITEST),
  // Capítulo 6: JONA dentro de cada unidad y FSD entre unidades, con pruebas de arquitectura.
  ...npmProject('web-fsd', VITEST),
  // Capítulo 7: el mismo inicio de sesión en MVC, MVP, MVVM y las dos formas de JONA, con una suite común.
  ...npmProject('patrones-comparados', NODE_TEST),
  // Capítulo 8: sistema de diseño (tokens, tema, contraste, axe-core y versionado de la API pública).
  ...npmProject('sistema-diseno', VITEST),
  // Capítulo 10: el costo de cada cambio, medido en una variante directa y en una JONA.
  ...npmProject('costo-de-cambio', NODE_TEST),
  // Capítulo 11: migración paso a paso de una pantalla heredada, con caracterización y deuda medida.
  ...npmProject('migracion', NODE_TEST),
  // Capítulo 12: nomenclatura previa frente a la canónica, y observaciones medidas sobre THC-C.
  ...npmProject('evolucion', NODE_TEST),
  // Capítulo 13: sistema de diseño por niveles (Atomic Design + JONA); se compila antes que su consumidor.
  ...npmProject('sistema-diseno-atomico', VITEST),
  // Capítulo 14: aplicación con FSD, Clean/Hexagonal y JONA que consume el sistema de diseño del 13.
  ...npmProject('aplicacion-catalogo', VITEST),
  // Capítulo 15: un BFF hexagonal delante de dos backends, y el catálogo con SSR (usa el sistema de diseño del 13).
  ...npmProject('catalogo-bff', VITEST),
  ...npmProject('catalogo-ssr', VITEST),
  // Capítulo 16: SEO desde el sistema de diseño, un sitio estático y un servidor SSR, con una sola auditoría.
  ...npmProject('catalogo-seo', VITEST),
  // Capítulo 9: un catálogo de reglas JONA verificado en TypeScript, Java (ArchUnit) y C# (ArchUnitNET).
  ...npmProject('gobierno/ts', NODE_TEST),
  { name: 'gobierno/java', dir: at('gobierno', 'java'), cmd: 'mvn -B test', count: SUREFIRE },
  { name: 'gobierno/dotnet', dir: at('gobierno', 'dotnet'), cmd: 'dotnet test', count: DOTNET },
  { name: 'contratos-multilenguaje/typescript', dir: at('contratos-multilenguaje', 'typescript'), cmd: 'npm ci --no-audit --no-fund' },
  { name: 'contratos-multilenguaje/typescript', dir: at('contratos-multilenguaje', 'typescript'), cmd: 'npm test', count: NODE_TEST },
  { name: 'contratos-multilenguaje/kotlin', dir: at('contratos-multilenguaje', 'kotlin'), cmd: 'mvn -B test', count: SUREFIRE },
  { name: 'contratos-multilenguaje/csharp', dir: at('contratos-multilenguaje', 'csharp'), cmd: 'dotnet test', count: DOTNET },
  // El libro mismo: la sintaxis de cada diagrama Mermaid de los capítulos.
  { name: 'libro: diagramas', dir: at('..', 'herramientas', 'diagramas'), cmd: 'npm ci --no-audit --no-fund' },
  { name: 'libro: diagramas', dir: at('..', 'herramientas', 'diagramas'), cmd: 'npm test', count: DIAGRAMAS },
  // El catálogo de antipatrones del capítulo 12 coincide con las fichas de los capítulos (sin dependencias).
  { name: 'libro: antipatrones', dir: at('..', 'herramientas', 'antipatrones'), cmd: 'npm test', count: NODE_TEST },
  // Los enlaces relativos de capítulos, apéndices y README apuntan a archivos que existen (sin dependencias).
  { name: 'libro: enlaces', dir: at('..', 'herramientas', 'enlaces'), cmd: 'npm test', count: NODE_TEST },
];

// Las mismas suites de contrato, ahora contra un servidor "externo" (el mock arrancado aquí),
// como se correrían contra un backend real: CONTRATO_API_URL=<url>.
const EXTERNAL_STEPS = [
  { name: 'contrato externo (web-react)', dir: at('web-react'), cmd: 'npx vitest run src/services/AuthServiceHttp.test.ts', count: VITEST },
  { name: 'contrato externo (web-fsd)', dir: at('web-fsd'), cmd: 'npx vitest run src/features/auth-login/api/createAuthServiceHttp.test.ts', count: VITEST },
  { name: 'contrato externo (java-swing)', dir: at('java-swing'), cmd: 'mvn -B test -Dtest=AuthServiceHttpTest', count: SUREFIRE },
  { name: 'contrato externo (java-javafx)', dir: at('java-javafx'), cmd: 'mvn -B test -Dtest=AuthServiceHttpTest', count: SUREFIRE },
  { name: 'contrato externo (dotnet-wpf)', dir: at('dotnet-wpf'), cmd: 'dotnet test JonaLogin.Tests --filter AuthServiceHttpTests', count: DOTNET },
];

function clean() {
  const targets = [
    ['mock-server', 'node_modules'], ['web-react', 'node_modules'], ['web-react', 'dist'],
    ['java-swing', 'target'], ['contratos-multilenguaje', 'typescript', 'node_modules'],
    ['contratos-multilenguaje', 'typescript', 'dist'], ['contratos-multilenguaje', 'kotlin', 'target'],
    ['contratos-multilenguaje', 'csharp', 'bin'], ['contratos-multilenguaje', 'csharp', 'obj'],
    ['web-ts-puro', 'node_modules'], ['web-ts-puro', 'dist'],
    ['web-angular', 'node_modules'], ['web-angular', 'dist'], ['web-angular', '.angular'],
    ['web-vue', 'node_modules'], ['web-vue', 'dist'],
    ['electron', 'node_modules'], ['electron', 'dist'],
    ['web-fsd', 'node_modules'], ['web-fsd', 'dist'],
    ['patrones-comparados', 'node_modules'], ['patrones-comparados', 'dist'],
    ['sistema-diseno', 'node_modules'], ['sistema-diseno', 'dist'],
    ['costo-de-cambio', 'node_modules'], ['costo-de-cambio', 'dist'],
    ['migracion', 'node_modules'], ['migracion', 'dist'],
    ['evolucion', 'node_modules'], ['evolucion', 'dist'],
    ['sistema-diseno-atomico', 'node_modules'], ['sistema-diseno-atomico', 'dist'],
    ['aplicacion-catalogo', 'node_modules'], ['aplicacion-catalogo', 'dist'],
    ['catalogo-bff', 'node_modules'], ['catalogo-bff', 'dist'],
    ['catalogo-ssr', 'node_modules'], ['catalogo-ssr', 'dist'],
    ['catalogo-seo', 'node_modules'], ['catalogo-seo', 'dist'],
    ['gobierno', 'ts', 'node_modules'], ['gobierno', 'ts', 'dist'], ['gobierno', 'java', 'target'],
    ['gobierno', 'dotnet', 'bin'], ['gobierno', 'dotnet', 'obj'],
    ['..', 'herramientas', 'diagramas', 'node_modules'],
    ['java-javafx', 'target'],
    ...['JonaLogin.Core', 'JonaLogin.Wpf', 'JonaLogin.Tests'].flatMap((p) => [['dotnet-wpf', p, 'bin'], ['dotnet-wpf', p, 'obj']]),
  ];
  for (const parts of targets) rmSync(at(...parts), { recursive: true, force: true });
  console.log('Limpieza: node_modules, dist, target, bin y obj eliminados.\n');
}

function run(step, env = {}) {
  const started = Date.now();
  process.stdout.write(`> ${step.name}: ${step.cmd} ... `);
  const result = spawnSync(step.cmd, {
    cwd: step.dir, shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, DOTNET_CLI_UI_LANGUAGE: 'en', FORCE_COLOR: '0', NO_COLOR: '1', ...env },
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const ok = result.status === 0;
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`${ok ? 'ok' : 'FALLÓ'} (${seconds} s)`);
  if (!ok) console.log(output.split('\n').slice(-40).join('\n'));
  let tests = '';
  if (step.count) {
    const matches = [...output.matchAll(new RegExp(step.count.source, `${step.count.flags}g`))];
    const last = matches.at(-1);
    if (last) tests = last[2] && last[2] !== '0' ? `${last[1]} (${last[2]} omitidas)` : last[1];
  }
  return { name: step.name, cmd: step.cmd, ok, seconds, tests };
}

async function startMockServer() {
  const child = spawn(process.execPath, [at('mock-server', 'src', 'server.mjs')], {
    env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'inherit'],
  });
  const url = await new Promise((resolve, reject) => {
    child.stdout.on('data', (chunk) => {
      const match = /http:\/\/127\.0\.0\.1:\d+/.exec(String(chunk));
      if (match) resolve(match[0]);
    });
    child.on('exit', (code) => reject(new Error(`El servidor mock terminó con código ${code}`)));
  });
  return { url, stop: () => child.kill() };
}

/** Los dos backends simulados y el BFF del capítulo 15 (catalogo-bff), en puertos libres. */
async function startBffStack() {
  const child = spawn(process.execPath, [at('catalogo-bff', 'dist', 'arrancar.js')], {
    env: { ...process.env, BFF_PUERTO: '0', CATALOGO_PUERTO: '0', INVENTARIO_PUERTO: '0' }, stdio: ['ignore', 'pipe', 'inherit'],
  });
  const urls = await new Promise((resolve, reject) => {
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += String(chunk);
      const found = Object.fromEntries([...output.matchAll(/(catalogo|inventario|BFF) listo en (http:\/\/127\.0\.0\.1:\d+)/g)].map((m) => [m[1], m[2]]));
      if (found.catalogo && found.inventario && found.BFF) resolve(found);
    });
    child.on('exit', (code) => reject(new Error(`El BFF terminó con código ${code}`)));
  });
  return { ...urls, stop: () => child.kill() };
}

// La suite de contrato HTTP del capítulo 14, sin cambiar una línea de la aplicación, contra el BFF.
const BFF_STEPS = [
  { name: 'contrato BFF (aplicacion-catalogo)', dir: at('aplicacion-catalogo'), cmd: 'npx vitest run src/entities/producto/api/crearRepositorioHttp.test.ts', count: VITEST },
];

if (process.argv.includes('--limpio')) clean();

const results = STEPS.map((step) => run(step));

const mock = await startMockServer();
console.log(`\nServidor mock arrancado en ${mock.url} (como si fuera el backend real)`);
try {
  for (const step of EXTERNAL_STEPS) results.push(run(step, { CONTRATO_API_URL: mock.url }));
} finally {
  mock.stop();
  console.log('Servidor mock detenido.');
}

const bff = await startBffStack();
console.log(`\nBFF arrancado en ${bff.BFF} (catalogo en ${bff.catalogo}, inventario en ${bff.inventario})`);
try {
  const reiniciar = [bff.catalogo, bff.inventario].map((url) => `${url}/__pruebas/reiniciar`).join(',');
  for (const step of BFF_STEPS) results.push(run(step, { CATALOGO_API_URL: bff.BFF, CATALOGO_REINICIAR: reiniciar }));
} finally {
  bff.stop();
  console.log('BFF detenido.');
}

console.log('\nResumen');
console.log('-------');
for (const r of results) {
  const tests = r.tests ? `  pruebas: ${r.tests}` : '';
  console.log(`${r.ok ? 'OK   ' : 'FALLA'}  ${r.name.padEnd(38)} ${r.cmd.padEnd(58)} ${r.seconds.padStart(6)} s${tests}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? `\nTodo pasó (${results.length} pasos).` : `\n${failed} de ${results.length} pasos fallaron.`);
process.exit(failed === 0 ? 0 : 1);
