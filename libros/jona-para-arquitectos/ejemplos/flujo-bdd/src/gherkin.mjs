// Analizador mínimo de Gherkin en español: lo justo para el plan de pruebas del capítulo 5.
// Reconoce "# language: es", Característica, Escenario, etiquetas (@...), comentarios y los pasos
// Dado, Cuando, Entonces, Y y Pero. No usa dependencias.

const STEP = /^(Dado|Cuando|Entonces|Y|Pero)\s+(.+)$/;

export function parseFeature(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '# language: es') throw new Error('El plan debe empezar con "# language: es"');

  const feature = { language: 'es', name: undefined, scenarios: [] };
  let tags = [];
  let current;

  lines.forEach((raw, index) => {
    const line = raw.trim();
    const fail = (reason) => { throw new Error(`línea ${index + 1}: ${reason}: "${line}"`); };
    if (line === '' || line.startsWith('#')) return;

    if (line.startsWith('@')) {
      tags.push(...line.split(/\s+/).map((tag) => tag.slice(1)));
    } else if (line.startsWith('Característica:')) {
      feature.name = line.slice('Característica:'.length).trim();
    } else if (line.startsWith('Escenario:')) {
      current = { name: line.slice('Escenario:'.length).trim(), tags, steps: [] };
      feature.scenarios.push(current);
      tags = [];
    } else {
      const step = STEP.exec(line);
      if (!step) fail('no es un paso reconocido');
      if (!current) fail('paso fuera de un escenario');
      current.steps.push({ keyword: step[1], text: step[2] });
    }
  });
  return feature;
}

const RESPONSE = /^la API responde (\d{3}) con (?:un token|el código ([A-Z_]+))$/;
const MESSAGE = /^la interfaz muestra "(.*)"$/;

/** Lo que un escenario promete: su escenario del mock, el estado HTTP, el código y el mensaje. */
export function expectedOutcome(scenario) {
  const mockTag = scenario.tags.find((tag) => tag.startsWith('mock:'));
  if (!mockTag) throw new Error(`"${scenario.name}" no tiene etiqueta @mock:<escenario>`);

  const response = scenario.steps.map((s) => RESPONSE.exec(s.text)).find(Boolean);
  if (!response) throw new Error(`"${scenario.name}" no tiene una línea Entonces "la API responde ..."`);

  const message = scenario.steps.map((s) => MESSAGE.exec(s.text)).find(Boolean);
  return {
    mock: mockTag.slice('mock:'.length),
    status: Number(response[1]),
    token: response[2] === undefined,
    code: response[2],
    message: message?.[1],
  };
}
