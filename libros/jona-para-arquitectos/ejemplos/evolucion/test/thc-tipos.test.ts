import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import ts from 'typescript';
import { RAIZ } from './rutas.js';

// Observaciones 1 y 2 sobre THC-C: dos fixtures que el propio artículo propone no pasan el compilador.
// Esos archivos quedan fuera de tsconfig.json para que el build principal no falle; aquí se compilan aparte.

const OPCIONES: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: true, noEmit: true, skipLibCheck: true, types: [],
};

/** Diagnósticos del compilador para un solo archivo, como los mostraría `tsc`. */
function diagnosticos(ruta: string): Array<{ codigo: number; linea: number; mensaje: string }> {
  const programa = ts.createProgram([ruta], OPCIONES);
  const fuente = programa.getSourceFile(ruta)!;
  return ts.getPreEmitDiagnostics(programa, fuente).map((d) => ({
    codigo: d.code,
    linea: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0,
    mensaje: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
  }));
}

const FIXTURES = join(RAIZ, 'thc-c', 'fixtures');

describe('Observación 1: el fixture emailDuplicado declara un campo que ApiErrorResponse no tiene', () => {
  it('tsc lo rechaza por exceso de propiedad (TS2353) en la línea de code', () => {
    const encontrados = diagnosticos(join(FIXTURES, 'emailDuplicado', 'crearCuenta.fixture.ts'));
    console.log(`# obs. 1: ${JSON.stringify(encontrados)}`);
    assert.deepEqual(encontrados, [{
      codigo: 2353, linea: 8,
      mensaje: "Object literal may only specify known properties, and 'code' does not exist in type 'ApiErrorResponse'.",
    }]);
  });
});

describe('Observación 2: el Test Plan pide 503, pero 503 no está en la unión de status', () => {
  it('tsc rechaza el fixture emailServiceUnavailable (TS2322)', () => {
    const encontrados = diagnosticos(join(FIXTURES, 'emailServiceUnavailable', 'verificacionEmail.fixture.ts'));
    console.log(`# obs. 2: ${JSON.stringify(encontrados)}`);
    const [unico, ...resto] = encontrados;
    assert.deepEqual(resto, []);
    assert.equal(unico.codigo, 2322);
    assert.equal(unico.linea, 6);
    assert.match(unico.mensaje, /^Type '503' is not assignable to type /);
  });
});

describe('Observación 5: el hook del artículo, tal como está escrito, no compila', () => {
  const HOOK = join(RAIZ, 'thc-c', 'hooks', 'useCrearCuenta.ts');
  const CON_CAST = '(result as ApiErrorResponse).error';

  /** Compila el hook con un solo cambio en memoria: sin el cast, como en la versión con useState del artículo. */
  function diagnosticosSinCast() {
    const original = readFileSync(HOOK, 'utf8');
    assert.ok(original.includes(CON_CAST), 'el hook ejecutable usa el cast');
    const anfitrion = ts.createCompilerHost(OPCIONES);
    const leerFuente = anfitrion.getSourceFile;
    anfitrion.getSourceFile = (nombre, version, ...resto) => resolve(nombre) === resolve(HOOK)
      ? ts.createSourceFile(nombre, original.replace(CON_CAST, 'result.error'), version, true)
      : leerFuente.call(anfitrion, nombre, version, ...resto);
    const programa = ts.createProgram([HOOK], OPCIONES, anfitrion);
    return ts.getPreEmitDiagnostics(programa, programa.getSourceFile(HOOK)).map((d) => ({
      codigo: d.code, mensaje: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    }));
  }

  it('sin el cast, `result.error` da TS2339: el else no estrecha la unión', () => {
    const encontrados = diagnosticosSinCast();
    console.log(`# obs. 5: ${JSON.stringify(encontrados)}`);
    assert.deepEqual(encontrados, [{
      codigo: 2339,
      mensaje: "Property 'error' does not exist on type 'ApiResponse<Cuenta>'.\n  Property 'error' does not exist on type 'ApiSuccessResponse<Cuenta>'.",
    }]);
  });

  it('con el cast (el de la variante TanStack del artículo) compila', () => {
    const programa = ts.createProgram([HOOK], OPCIONES);
    assert.deepEqual(ts.getPreEmitDiagnostics(programa, programa.getSourceFile(HOOK)), []);
  });
});

describe('Control: los fixtures válidos sí compilan', () => {
  for (const escenario of ['exitoso', 'errorServidor']) {
    it(`${escenario}/crearCuenta.fixture.ts no tiene diagnósticos`, () => {
      assert.deepEqual(diagnosticos(join(FIXTURES, escenario, 'crearCuenta.fixture.ts')), []);
    });
  }
});
