import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { expectedOutcome, parseFeature } from '../src/gherkin.mjs';

const FEATURE = `# language: es
Característica: Ejemplo

  # un comentario
  @mock:exitoso @otra
  Escenario: Primero
    Dado algo
    Cuando pasa algo
    Entonces la API responde 200 con un token
    Y la interfaz abre la pantalla de inicio

  @mock:errorServidor
  Escenario: Segundo
    Dado otra cosa
    Pero no esta
    Entonces la API responde 500 con el código INTERNAL_ERROR
    Y la interfaz muestra "No se pudo."
`;

describe('parseFeature (subconjunto de Gherkin en español)', () => {
  it('lee el idioma, la característica, los escenarios, sus etiquetas y sus pasos', () => {
    const feature = parseFeature(FEATURE);

    assert.equal(feature.language, 'es');
    assert.equal(feature.name, 'Ejemplo');
    assert.deepEqual(feature.scenarios.map((s) => s.name), ['Primero', 'Segundo']);
    assert.deepEqual(feature.scenarios[0].tags, ['mock:exitoso', 'otra']);
    assert.deepEqual(feature.scenarios[1].steps, [
      { keyword: 'Dado', text: 'otra cosa' },
      { keyword: 'Pero', text: 'no esta' },
      { keyword: 'Entonces', text: 'la API responde 500 con el código INTERNAL_ERROR' },
      { keyword: 'Y', text: 'la interfaz muestra "No se pudo."' },
    ]);
  });

  it('rechaza un paso fuera de un escenario y una línea que no reconoce', () => {
    assert.throws(() => parseFeature('# language: es\nCaracterística: X\nDado algo\n'), /línea 3/);
    assert.throws(() => parseFeature('# language: es\nCaracterística: X\n  Escenario: A\n    Cuando\n'), /línea 4/);
  });

  it('exige el idioma español', () => {
    assert.throws(() => parseFeature('# language: en\nFeature: X\n'), /language: es/);
  });
});

describe('expectedOutcome (lo que el escenario promete)', () => {
  it('lee el escenario del mock, el estado, el código y el mensaje', () => {
    const [ok, failure] = parseFeature(FEATURE).scenarios;

    assert.deepEqual(expectedOutcome(ok), { mock: 'exitoso', status: 200, token: true, code: undefined, message: undefined });
    assert.deepEqual(expectedOutcome(failure), {
      mock: 'errorServidor', status: 500, token: false, code: 'INTERNAL_ERROR', message: 'No se pudo.',
    });
  });

  it('falla si el escenario no tiene etiqueta @mock o línea Entonces reconocible', () => {
    const [scenario] = parseFeature('# language: es\nCaracterística: X\n  Escenario: A\n    Entonces algo\n').scenarios;

    assert.throws(() => expectedOutcome(scenario), /@mock/);
    assert.throws(() => expectedOutcome({ ...scenario, tags: ['mock:exitoso'] }), /Entonces/);
  });
});
