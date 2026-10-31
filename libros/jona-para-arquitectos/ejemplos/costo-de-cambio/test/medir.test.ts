import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, it } from 'node:test';
import { diferencia, lineasDeCodigo, medirVariante } from '../herramientas/medir.js';

describe('lineasDeCodigo', () => {
  it('descarta líneas en blanco y comentarios de línea o de bloque', () => {
    const texto = [
      '// comentario',
      'const a = 1;',
      '',
      '/** documentación',
      ' * de varias líneas',
      ' */',
      '  const b = 2; // comentario al final: la línea sí es código',
      '/* bloque */ const c = 3;',
      '   ',
    ].join('\n');
    assert.deepEqual(lineasDeCodigo(texto), [
      'const a = 1;',
      'const b = 2; // comentario al final: la línea sí es código',
      'const c = 3;',
    ]);
  });

  it('no depende del fin de línea (LF o CRLF)', () => {
    assert.deepEqual(lineasDeCodigo('a();\r\n\r\nb();\r\n'), ['a();', 'b();']);
  });
});

describe('diferencia (LCS por líneas)', () => {
  it('cuenta las líneas agregadas y eliminadas', () => {
    assert.deepEqual(diferencia(['a', 'b', 'c'], ['a', 'x', 'c', 'd']), { agregadas: 2, eliminadas: 1 });
  });

  it('ignora las diferencias que son solo espacios', () => {
    assert.deepEqual(diferencia(['f(a, b);'], ['f(a,b);']), { agregadas: 0, eliminadas: 0 });
  });

  it('un archivo nuevo es todo agregado y uno borrado todo eliminado', () => {
    assert.deepEqual(diferencia([], ['a', 'b']), { agregadas: 2, eliminadas: 0 });
    assert.deepEqual(diferencia(['a', 'b'], []), { agregadas: 0, eliminadas: 2 });
  });

  it('una línea movida cuenta como una eliminada y una agregada', () => {
    assert.deepEqual(diferencia(['a', 'b', 'c'], ['b', 'c', 'a']), { agregadas: 1, eliminadas: 1 });
  });
});

describe('medirVariante', () => {
  const raiz = mkdtempSync(join(tmpdir(), 'costo-de-cambio-'));
  after(() => rmSync(raiz, { recursive: true, force: true }));

  function escribir(ruta: string, texto: string): void {
    const archivo = join(raiz, ruta);
    mkdirSync(dirname(archivo), { recursive: true });
    writeFileSync(archivo, texto);
  }

  escribir('v0/src/a.ts', '// doc\nconst a = 1;\nconst b = 2;\n');
  escribir('v0/test/a.test.ts', 'probar(a);\n');
  escribir('cambio/src/a.ts', '// otro comentario\nconst a = 1;\nconst b = 3;\n');
  escribir('cambio/src/nuevo.ts', 'const n = 1;\n');
  escribir('cambio/test/a.test.ts', 'probar(a);\nprobar(n);\n');
  escribir('solo-comentario/src/a.ts', '// cambia solo el comentario\nconst a = 1;\nconst b = 2;\n');
  escribir('solo-comentario/test/a.test.ts', 'probar(a);\n');

  it('mide el costo base de v0 separando producción y pruebas', () => {
    const medida = medirVariante(raiz, ['cambio', 'solo-comentario'], 'src/a.ts');
    assert.deepEqual(medida.base, { prod: { archivos: 1, lineas: 2 }, prueba: { archivos: 1, lineas: 1 } });
  });

  it('mide cada cambio contra v0: archivos tocados, nuevos y líneas por tipo', () => {
    const medida = medirVariante(raiz, ['cambio', 'solo-comentario'], 'src/a.ts');
    assert.deepEqual(medida.cambios.cambio, {
      tocados: ['src/a.ts', 'src/nuevo.ts', 'test/a.test.ts'],
      nuevos: ['src/nuevo.ts'],
      eliminados: [],
      tocaLogica: true,
      prod: { agregadas: 2, eliminadas: 1 },
      prueba: { agregadas: 1, eliminadas: 0 },
    });
  });

  it('un cambio solo en comentarios no toca ningún archivo', () => {
    const medida = medirVariante(raiz, ['cambio', 'solo-comentario'], 'src/a.ts');
    assert.deepEqual(medida.cambios['solo-comentario'].tocados, []);
    assert.equal(medida.cambios['solo-comentario'].tocaLogica, false);
  });

  it('falla si las instantáneas no son exactamente v0 y los cambios esperados', () => {
    assert.throws(() => medirVariante(raiz, ['cambio'], 'src/a.ts'), /instantáneas/);
  });
});
