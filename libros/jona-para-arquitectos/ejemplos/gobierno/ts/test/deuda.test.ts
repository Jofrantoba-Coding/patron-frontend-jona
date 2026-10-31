import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { aplicarDeuda, leerDeuda } from '../herramientas/deuda.js';
import { revisar } from '../herramientas/jona-check.js';
import { enProyecto, fixture } from './rutas.js';

// Un proyecto heredado con dos violaciones conocidas, anotadas en fixtures/deuda/deuda.json.
const DEUDA = leerDeuda(fixture('deuda/deuda.json'));

describe('Trinquete: la deuda conocida se tolera, pero solo puede bajar', () => {
  it('el proyecto heredado tiene violaciones reales (la deuda no es ficticia)', () => {
    assert.equal(revisar(fixture('deuda/legado')).length, 2);
  });

  it('(a) las violaciones anotadas en la deuda pasan', () => {
    const resultado = aplicarDeuda(revisar(fixture('deuda/legado')), DEUDA);

    assert.equal(resultado.aprobado, true);
    assert.equal(resultado.toleradas.length, 2);
  });

  it('(b) una violación nueva, fuera de la deuda, falla', () => {
    const resultado = aplicarDeuda(revisar(fixture('deuda/legado-con-nueva')), DEUDA);

    assert.equal(resultado.aprobado, false);
    assert.deepEqual(resultado.nuevas.map((v) => [v.regla, v.archivo]), [['JONA-N4', 'Menu.ts']]);
  });

  it('(c) una entrada de la deuda que ya no ocurre falla y pide quitarla: la deuda solo baja', () => {
    const resultado = aplicarDeuda(revisar(fixture('deuda/legado-saldado')), DEUDA);

    assert.equal(resultado.aprobado, false);
    assert.deepEqual(resultado.nuevas, []);
    assert.deepEqual(resultado.saldadas.map((e) => [e.regla, e.archivo]), [['JONA-N4', 'App.ts']]);
  });

  it('una misma violación repetida cuenta dos veces: la deuda no la tolera más veces de las anotadas', () => {
    const [una] = revisar(fixture('deuda/legado'));
    const resultado = aplicarDeuda([una, una], [una]);

    assert.equal(resultado.toleradas.length, 1);
    assert.equal(resultado.nuevas.length, 1);
  });
});

describe('La línea de comandos: npm run check -- <carpeta> [--deuda archivo]', () => {
  const cli = (...argumentos: string[]) =>
    spawnSync(process.execPath, [enProyecto('dist/herramientas/cli.js'), ...argumentos], { encoding: 'utf8' });

  it('termina en 0 si no hay violaciones', () => {
    const salida = cli(enProyecto('src'));

    assert.equal(salida.status, 0, salida.stdout + salida.stderr);
    assert.match(salida.stdout, /0 violaciones/);
  });

  it('termina en 1 con una violación nueva y la nombra', () => {
    const salida = cli(fixture('deuda/legado-con-nueva'), '--deuda', fixture('deuda/deuda.json'));

    assert.equal(salida.status, 1);
    assert.match(salida.stdout, /NUEVA\s+JONA-N4 Menu\.ts:1/);
  });

  it('termina en 1 si la deuda anota algo ya corregido, y pide quitarlo', () => {
    const salida = cli(fixture('deuda/legado-saldado'), '--deuda', fixture('deuda/deuda.json'));

    assert.equal(salida.status, 1);
    assert.match(salida.stdout, /SALDADA\s+JONA-N4 App\.ts/);
    assert.match(salida.stdout, /quítela de/);
  });
});
