import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import ts from 'typescript';
import { useCrearCuenta } from '../thc-c/hooks/useCrearCuenta.js';
import type { ApiResponse, Cuenta } from '../thc-c/types/crearCuenta.types.js';
import { RAIZ } from './rutas.js';

// Observación 4: el mock y el servicio real no entregan la misma forma.
// El fixture lleva `status` dentro del cuerpo; el servicio real devuelve `response.json()`, y un backend
// típico pone el código HTTP en la respuesta, no en el cuerpo. El hook decide con `result.status`.

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

/** Un backend que responde con el código HTTP y el cuerpo dados; devuelve lo que recibió el hook. */
function backend(codigo: number, cuerpo: unknown): Array<ApiResponse<Cuenta>> {
  const recibidos: Array<ApiResponse<Cuenta>> = [];
  globalThis.fetch = async () => {
    const respuesta = new Response(JSON.stringify(cuerpo), { status: codigo, headers: { 'Content-Type': 'application/json' } });
    const json = respuesta.json.bind(respuesta);
    respuesta.json = async () => { const valor = await json(); recibidos.push(valor); return valor; };
    return respuesta;
  };
  return recibidos;
}

/** El fixture tal como lo devuelve el mock (está fuera del build principal: se transpila aquí). */
async function fixture(escenario: string): Promise<ApiResponse<Cuenta>> {
  const fuente = readFileSync(join(RAIZ, 'thc-c', 'fixtures', escenario, 'crearCuenta.fixture.ts'), 'utf8');
  const js = ts.transpileModule(fuente, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return (await import(`data:text/javascript,${encodeURIComponent(js)}`)).default;
}

const CUENTA: Cuenta = { id: 'usr_9', nombre: 'Ana', email: 'ana@ejemplo.com', createdAt: '2026-01-01T00:00:00Z' };

describe('Observación 4: status en el cuerpo (mock) frente a status en la respuesta HTTP (real)', () => {
  it('con el mock, el fixture de email duplicado trae status: 409 en el cuerpo', async () => {
    const valor = await fixture('emailDuplicado');
    assert.equal(valor.status, 409);
  });

  it('HTTP 409 con { error }: result.status es undefined; el hook cae en error solo porque undefined no es 200 ni 201', async () => {
    const recibidos = backend(409, { error: 'Este email ya está registrado' });
    const hook = useCrearCuenta();
    await hook.registrar();
    assert.equal(recibidos[0].status, undefined);
    assert.equal(hook.estado.status, 'error');
    assert.equal(hook.estado.errors.general, 'Este email ya está registrado');
  });

  it('HTTP 201 con la cuenta creada en el cuerpo: el hook lo trata como error, y sin mensaje', async () => {
    const recibidos = backend(201, CUENTA);
    const hook = useCrearCuenta();
    await hook.registrar();
    assert.equal(recibidos[0].status, undefined);
    assert.equal(hook.estado.status, 'error');
    assert.equal(hook.estado.errors.general, undefined);
  });

  it('HTTP 201 con { data } (ApiSuccessResponse sin status): también termina en error', async () => {
    backend(201, { data: CUENTA });
    const hook = useCrearCuenta();
    await hook.registrar();
    assert.equal(hook.estado.status, 'error');
  });

  it('solo si el backend repite el código dentro del cuerpo el hook llega a success', async () => {
    backend(201, { status: 201, data: CUENTA });
    const hook = useCrearCuenta();
    await hook.registrar();
    assert.equal(hook.estado.status, 'success');
  });
});
