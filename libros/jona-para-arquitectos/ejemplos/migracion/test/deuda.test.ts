import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { aplicarDeuda, leerDeuda, type EntradaDeuda } from '../herramientas/deuda.js';
import { revisar, type ReglaId } from '../herramientas/jona-check.js';
import { PASOS, PRIMER_PASO_SIN_DEUDA } from '../herramientas/pasos.js';
import { RAIZ } from './rutas.js';

// El trinquete en una migración real: cada paso anota su deuda conocida en deuda.json, el verificador
// la tolera y el pipeline queda en verde. Pero la deuda solo puede bajar.

const deudaDe = (paso: string): EntradaDeuda[] => {
  const ruta = join(RAIZ, 'pasos', paso, 'deuda.json');
  return existsSync(ruta) ? leerDeuda(ruta) : [];
};
const clave = (e: EntradaDeuda) => `${e.regla}|${e.archivo}|${e.mensaje}`;

/** Lo que tiene `a` y no tiene `b`, contando repeticiones (una misma violación puede aparecer varias veces). */
function resta(a: string[], b: string[]): string[] {
  const quedan = [...b];
  return a.filter((x) => {
    const i = quedan.indexOf(x);
    if (i < 0) return true;
    quedan.splice(i, 1);
    return false;
  });
}

interface CambioDeForma {
  regla: ReglaId;
  sale: Omit<EntradaDeuda, 'regla'>;
  entra: Omit<EntradaDeuda, 'regla'>;
  motivo: string;
}

/**
 * Las únicas entradas nuevas que la deuda admite: una violación que cambia de forma sin crecer.
 * Cada una reemplaza a otra de la misma regla que desaparece en el mismo paso.
 */
const CAMBIOS_DE_FORMA: Record<string, CambioDeForma[]> = {
  '02-costura-servicio': [
    {
      regla: 'JONA-N3',
      sale: { archivo: 'uilogin/UiLoginView.ts', mensaje: 'la vista usa fetch; los efectos van en la Implementación o en un adaptador' },
      entra: { archivo: 'uilogin/UiLoginView.ts', mensaje: 'la vista importa servicios/AuthServiceHttp.ts, un servicio' },
      motivo: 'la vista ya no hace HTTP, pero todavía elige el adaptador por defecto para que App no cambie',
    },
    {
      regla: 'JONA-N3',
      sale: { archivo: 'uilogin/UiLoginView.ts', mensaje: 'la vista usa setTimeout; los efectos van en la Implementación o en un adaptador' },
      entra: { archivo: 'uilogin/UiLoginView.ts', mensaje: 'la vista importa servicios/InterAuthService.ts, un servicio' },
      motivo: 'el límite de tiempo se fue al adaptador; la vista recibe el servicio tipado con su contrato',
    },
  ],
  '04-implementacion': [
    {
      regla: 'JONA-N1',
      sale: { archivo: 'uilogin/UiLoginView.ts', mensaje: 'la unidad uilogin no tiene contrato de UI (Inter*.ts)' },
      entra: { archivo: 'uilogin/UiLoginImpl.ts', mensaje: 'la unidad uilogin no tiene contrato de UI (Inter*.ts)' },
      motivo: 'la misma falta; el verificador la señala en la Implementación cuando existe',
    },
    {
      regla: 'JONA-N4',
      sale: { archivo: 'App.ts', mensaje: 'importa uilogin/UiLoginView.ts, interno de la unidad uilogin; use su entrada: (no tiene)' },
      entra: { archivo: 'App.ts', mensaje: 'importa uilogin/UiLoginView.ts, interno de la unidad uilogin; use su entrada: uilogin/UiLoginImpl.ts' },
      motivo: 'la misma importación; sin archivo de entrada, la Implementación hace de entrada y el mensaje la nombra',
    },
  ],
};

describe('Deuda por paso (trinquete)', () => {
  for (const paso of PASOS) {
    it(`${paso}: el verificador aprueba con su deuda anotada`, () => {
      const resultado = aplicarDeuda(revisar(join(RAIZ, 'pasos', paso, 'src')), deudaDe(paso));
      assert.ok(resultado.aprobado, JSON.stringify({ nuevas: resultado.nuevas, saldadas: resultado.saldadas }, null, 2));
    });
  }

  it('la deuda del legado es real: el verificador encuentra violaciones antes de empezar', () => {
    assert.ok(deudaDe('00-legado').length > 0);
  });

  it(`desde ${PRIMER_PASO_SIN_DEUDA} no hay deuda ni archivo de deuda`, () => {
    for (const paso of PASOS.slice(PASOS.indexOf(PRIMER_PASO_SIN_DEUDA))) {
      assert.equal(existsSync(join(RAIZ, 'pasos', paso, 'deuda.json')), false, `${paso} todavía tiene deuda.json`);
    }
  });
});

describe('La deuda solo baja', () => {
  for (let i = 1; i < PASOS.length; i++) {
    const [anterior, paso] = [PASOS[i - 1], PASOS[i]];

    it(`${paso}: toda entrada ya estaba en ${anterior}, salvo los cambios de forma declarados`, () => {
      const antes = deudaDe(anterior).map(clave);
      const ahora = deudaDe(paso).map(clave);
      const cambios = CAMBIOS_DE_FORMA[paso] ?? [];
      const nuevas = resta(ahora, antes);
      const saldadas = resta(antes, ahora);

      assert.deepEqual(nuevas.sort(), cambios.map((c) => clave({ regla: c.regla, ...c.entra })).sort(), 'entradas nuevas no declaradas');
      for (const c of cambios) {
        assert.ok(saldadas.includes(clave({ regla: c.regla, ...c.sale })), `el cambio de forma no reemplaza nada: ${c.motivo}`);
      }
      assert.ok(ahora.length <= antes.length, `la deuda creció de ${antes.length} a ${ahora.length}`);
    });
  }
});
