import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createMockServer } from '../src/server.mjs';
import { erroresDeRespuesta } from './contrato.mjs';

const ANA = { usuario: 'ana@ejemplo.com', clave: 'secreta123' };
const BLOQUEADO = { usuario: 'bloqueado@ejemplo.com', clave: 'secreta123' };

let server;
let baseUrl;

before(async () => {
  server = createMockServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => fetch(`${baseUrl}/__mock/reset`, { method: 'POST' }));

async function login(body, headers = {}) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return { status: response.status, headers: response.headers, body: await response.json() };
}

function assertCumpleContrato({ status, headers, body }) {
  assert.deepEqual(erroresDeRespuesta('/auth/login', 'post', status, body), []);
  assert.ok(headers.get('x-correlation-id'), 'falta X-Correlation-Id');
}

describe('POST /auth/login (escenario exitoso: responde según los datos de prueba)', () => {
  it('responde 200 con token y usuario para credenciales válidas', async () => {
    const res = await login(ANA);

    assert.equal(res.status, 200);
    assertCumpleContrato(res);
    assert.deepEqual(res.body.user, { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' });
  });

  it('responde 401 INVALID_CREDENTIALS con una clave incorrecta o un usuario desconocido', async () => {
    for (const body of [{ ...ANA, clave: 'otra' }, { usuario: 'nadie@ejemplo.com', clave: 'x' }]) {
      const res = await login(body);

      assert.equal(res.status, 401);
      assertCumpleContrato(res);
      assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    }
  });

  it('responde 403 USER_DISABLED para un usuario bloqueado', async () => {
    const res = await login(BLOQUEADO);

    assert.equal(res.status, 403);
    assertCumpleContrato(res);
    assert.equal(res.body.code, 'USER_DISABLED');
  });

  it('responde 422 VALIDATION_ERROR con un detalle por campo vacío', async () => {
    const res = await login({ usuario: '', clave: '' });

    assert.equal(res.status, 422);
    assertCumpleContrato(res);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
    assert.deepEqual(res.body.details.map((d) => d.field), ['usuario', 'clave']);
  });

  it('responde 422 cuando el cuerpo no es JSON', async () => {
    const res = await login('{no es json');

    assert.equal(res.status, 422);
    assertCumpleContrato(res);
  });
});

describe('X-Correlation-Id', () => {
  it('reenvía el identificador recibido y lo usa como traceId', async () => {
    const res = await login({ ...ANA, clave: 'otra' }, { 'X-Correlation-Id': 'corr-123' });

    assert.equal(res.headers.get('x-correlation-id'), 'corr-123');
    assert.equal(res.body.traceId, 'corr-123');
  });

  it('genera un identificador cuando el cliente no lo envía', async () => {
    const res = await login({ ...ANA, clave: 'otra' });

    assert.ok(res.body.traceId.length > 0);
    assert.equal(res.headers.get('x-correlation-id'), res.body.traceId);
  });
});

describe('escenarios (X-Mock-Scenario)', () => {
  const casos = [
    ['credencialesInvalidas', 401, 'INVALID_CREDENTIALS'],
    ['usuarioBloqueado', 403, 'USER_DISABLED'],
    ['errorServidor', 500, 'INTERNAL_ERROR'],
  ];

  for (const [escenario, status, code] of casos) {
    it(`${escenario} responde ${status} ${code} aun con credenciales válidas`, async () => {
      const res = await login(ANA, { 'X-Mock-Scenario': escenario });

      assert.equal(res.status, status);
      assertCumpleContrato(res);
      assert.equal(res.body.code, code);
    });
  }

  it('exitoso es el escenario por defecto y también se puede pedir de forma explícita', async () => {
    assert.equal((await login(ANA, { 'X-Mock-Scenario': 'exitoso' })).status, 200);
    assert.equal((await login(ANA)).status, 200);
  });

  it('la validación (422) se aplica en cualquier escenario', async () => {
    const res = await login({ usuario: '', clave: 'x' }, { 'X-Mock-Scenario': 'errorServidor' });

    assert.equal(res.status, 422);
  });

  it('rechaza un escenario desconocido con 400 UNKNOWN_SCENARIO', async () => {
    const res = await login(ANA, { 'X-Mock-Scenario': 'inventado' });

    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'UNKNOWN_SCENARIO');
  });
});

describe('rutas de control del mock', () => {
  it('POST /__mock/scenario cambia el escenario por defecto y POST /__mock/reset lo restaura', async () => {
    const cambio = await fetch(`${baseUrl}/__mock/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ escenario: 'errorServidor' }),
    });
    assert.equal(cambio.status, 204);
    assert.equal((await login(ANA)).status, 500);

    const reset = await fetch(`${baseUrl}/__mock/reset`, { method: 'POST' });
    assert.equal(reset.status, 204);
    assert.equal((await login(ANA)).status, 200);
  });

  it('responde la petición previa de CORS para que el navegador pueda llamar al mock', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, { method: 'OPTIONS' });

    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), '*');
    assert.match(res.headers.get('access-control-allow-headers'), /X-Mock-Scenario/);
    assert.match(res.headers.get('access-control-expose-headers'), /X-Correlation-Id/);
  });

  it('responde 404 NOT_FOUND en una ruta desconocida', async () => {
    const res = await fetch(`${baseUrl}/no-existe`);

    assert.equal(res.status, 404);
    assert.equal((await res.json()).code, 'NOT_FOUND');
  });
});

describe('línea de comandos', () => {
  it('con PORT=0 escucha en un puerto libre e imprime su URL', async () => {
    const script = fileURLToPath(new URL('../src/server.mjs', import.meta.url));
    const proceso = spawn(process.execPath, [script], { env: { ...process.env, PORT: '0' } });
    try {
      const url = await new Promise((resolve, reject) => {
        proceso.stdout.on('data', (chunk) => {
          const encontrado = /http:\/\/127\.0\.0\.1:\d+/.exec(String(chunk));
          if (encontrado) resolve(encontrado[0]);
        });
        proceso.on('exit', (code) => reject(new Error(`el proceso terminó con ${code}`)));
      });

      const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ANA),
      });
      assert.equal(res.status, 200);
    } finally {
      proceso.kill();
    }
  });
});
