// @vitest-environment node
/**
 * Versionado semántico de la superficie pública: se compara la superficie actual
 * (calculada con el compilador de TypeScript) con la instantánea api-publica.json,
 * y la versión de package.json debe subir lo que el cambio exige.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { calcularSuperficie, type Superficie } from '../scripts/superficie.mjs';
import { clasificarCambio, cumpleIncremento, versionMinima } from '../scripts/version.mjs';
import * as clasesToken from '../src/tema/clasesToken';

const leerJson = (ruta: string) => JSON.parse(readFileSync(new URL(ruta, import.meta.url), 'utf8'));

/** Superficie de ejemplo: un componente y su contrato. */
const base = (): Superficie => ({
  version: '1.0.0',
  exports: {
    JChip: { kind: 'component' },
    InterJChip: {
      kind: 'contract',
      props: {
        label: { optional: false, type: 'string' },
        tone: { optional: true, type: "'neutral' | 'info'" },
      },
    },
  },
});

describe('clasificarCambio', () => {
  it('sin diferencias es PATCH', () => {
    expect(clasificarCambio(base(), base())).toEqual({ nivel: 'PATCH', cambios: [] });
  });

  it('quitar una exportación es MAJOR', () => {
    const actual = base();
    delete actual.exports.JChip;

    expect(clasificarCambio(base(), actual).nivel).toBe('MAJOR');
  });

  it('quitar una propiedad es MAJOR', () => {
    const actual = base();
    delete actual.exports.InterJChip.props!.tone;

    expect(clasificarCambio(base(), actual)).toEqual({
      nivel: 'MAJOR',
      cambios: [{ nivel: 'MAJOR', detalle: 'InterJChip.tone: propiedad eliminada' }],
    });
  });

  it('volver obligatoria una propiedad opcional es MAJOR', () => {
    const actual = base();
    actual.exports.InterJChip.props!.tone.optional = false;

    expect(clasificarCambio(base(), actual).nivel).toBe('MAJOR');
  });

  it('cambiar el tipo de una propiedad es MAJOR', () => {
    const actual = base();
    actual.exports.InterJChip.props!.tone.type = "'neutral'";

    expect(clasificarCambio(base(), actual).nivel).toBe('MAJOR');
  });

  it('agregar una propiedad obligatoria es MAJOR', () => {
    const actual = base();
    actual.exports.InterJChip.props!.id = { optional: false, type: 'string' };

    expect(clasificarCambio(base(), actual).nivel).toBe('MAJOR');
  });

  it('agregar una exportación es MINOR', () => {
    const actual = base();
    actual.exports.JBadge = { kind: 'component' };

    expect(clasificarCambio(base(), actual)).toEqual({
      nivel: 'MINOR',
      cambios: [{ nivel: 'MINOR', detalle: 'JBadge: exportación nueva' }],
    });
  });

  it('agregar una propiedad opcional es MINOR', () => {
    const actual = base();
    actual.exports.InterJChip.props!.icon = { optional: true, type: 'ReactNode' };

    expect(clasificarCambio(base(), actual).nivel).toBe('MINOR');
  });

  it('manda el cambio más grave', () => {
    const actual = base();
    actual.exports.JBadge = { kind: 'component' };
    delete actual.exports.InterJChip.props!.tone;

    expect(clasificarCambio(base(), actual).nivel).toBe('MAJOR');
  });
});

describe('cumpleIncremento', () => {
  it.each([
    ['1.0.0', '2.0.0', 'MAJOR', true],
    ['1.0.0', '1.1.0', 'MAJOR', false],
    ['1.0.0', '1.1.0', 'MINOR', true],
    ['1.0.0', '2.0.0', 'MINOR', true],
    ['1.0.0', '1.0.1', 'MINOR', false],
    ['1.0.0', '1.0.0', 'PATCH', true],
    ['1.2.0', '1.1.9', 'PATCH', false],
  ] as const)('de %s a %s con un cambio %s: %s', (anterior, actual, nivel, esperado) => {
    expect(cumpleIncremento(anterior, actual, nivel)).toBe(esperado);
  });

  it('calcula la versión mínima que exige cada nivel', () => {
    expect((['MAJOR', 'MINOR', 'PATCH'] as const).map((nivel) => versionMinima('1.4.2', nivel))).toEqual([
      '2.0.0',
      '1.5.0',
      '1.4.2',
    ]);
  });
});

describe('superficie pública del paquete', () => {
  const actual = calcularSuperficie();

  it('expone Entradas, contratos, DEFAULTS y la unidad de tema, no las Vistas', () => {
    const nombres = Object.keys(actual.exports);

    expect(nombres).toEqual(expect.arrayContaining(['JButton', 'JCheckbox', 'JBUTTON_DEFAULTS', 'ModoTemaImpl']));
    expect(nombres.filter((nombre) => nombre.endsWith('View') || nombre in clasesToken)).toEqual([]);
    expect(actual.exports.JButton).toEqual({ kind: 'component' });
    expect(actual.exports.InterJCheckbox.props?.checked).toEqual({ optional: true, type: 'boolean' });
    expect(actual.exports.InterJButtonSoloIcono.props?.['aria-label']).toEqual({ optional: false, type: 'string' });
  });

  it('la versión de package.json respeta el cambio frente a api-publica.json', () => {
    const instantanea = leerJson('../api-publica.json');
    const { version } = leerJson('../package.json');
    const { nivel, cambios } = clasificarCambio(instantanea, actual);

    expect(
      cumpleIncremento(instantanea.version, version, nivel),
      `cambio ${nivel} desde ${instantanea.version}: la versión debe ser al menos ${versionMinima(instantanea.version, nivel)}\n` +
        cambios.map((c) => `  ${c.nivel} ${c.detalle}`).join('\n'),
    ).toBe(true);
  });
});
