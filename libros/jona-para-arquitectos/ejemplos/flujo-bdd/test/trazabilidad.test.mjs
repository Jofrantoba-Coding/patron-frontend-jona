// Sección 5.4: la cadena plan de pruebas <-> servidor mock, comprobada en las dos direcciones.
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ESCENARIOS, USUARIOS } from '../../mock-server/src/datos.mjs';
import { createMockServer } from '../../mock-server/src/server.mjs';
import { expectedOutcome, parseFeature } from '../src/gherkin.mjs';

const plan = parseFeature(readFileSync(new URL('../plan/iniciar-sesion.feature', import.meta.url), 'utf8'));
const cases = plan.scenarios.map((scenario) => ({ name: scenario.name, ...expectedOutcome(scenario) }));
const validUser = USUARIOS.find((u) => !u.bloqueado);

let server;
let baseUrl;

before(async () => {
  server = createMockServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

describe('del plan al servidor mock', () => {
  for (const c of cases) {
    it(`${c.name} (@mock:${c.mock}) responde lo que dice su línea Entonces`, async () => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Mock-Scenario': c.mock },
        body: JSON.stringify({ usuario: validUser.usuario, clave: validUser.clave }),
      });
      const body = await response.json();

      assert.equal(response.status, c.status);
      if (c.token) assert.ok(typeof body.token === 'string' && body.token.length > 0, 'falta el token');
      if (c.code) assert.equal(body.code, c.code);
    });
  }
});

describe('del servidor mock al plan', () => {
  const planned = cases.map((c) => c.mock);

  it('cada escenario del servidor mock tiene su caso en el plan', () => {
    assert.deepEqual(ESCENARIOS.filter((e) => !planned.includes(e)), [], 'escenarios que nadie pidió');
  });

  it('cada etiqueta @mock del plan existe en el servidor mock', () => {
    assert.deepEqual(planned.filter((p) => !ESCENARIOS.includes(p)), [], 'casos que la interfaz nunca vería');
  });

  it('cada escenario aparece en un solo caso', () => {
    assert.equal(new Set(planned).size, planned.length);
  });
});
