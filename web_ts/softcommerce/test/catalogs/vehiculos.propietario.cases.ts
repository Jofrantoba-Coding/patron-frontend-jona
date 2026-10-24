import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the Vehiculo `Propietario` (R-MST-6, S-MST-12, S-REF-41, S-MST-11) on the in-browser mock and the HTTP mock. Seeded vehiculos: 001 and 002 belong to the
 * transportista 1 (TRANSPORTES RAPIDO SAC, RUC 20123456789), 003 (estado off) to the transportista 2, 004 is retired. Seeded transportistas: 1 and 2 active, 3 deactivated,
 * 4 retired. The W2 scenarios (S-REF-31) are in `reference.cases.ts` and stay as they were.
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const KEY = 'id_anexo_empresa_transportista';
const body = (over: Record<string, unknown> = {}) => ({ placa: 'abc123', constancia_inscripcion: 'ci-9', peso: 1200, id_marca: '001', id_modelo: '001', ...over });
const create = (name: string, over: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `vehiculos ${name}`, slug: 'vehiculos', ctx: WRITER, steps: [{ op: 'create', body: body(over) }], expect });

export const PROPIETARIO_CASES: CatalogCase[] = [
  create('S-REF-41 a vehiculo with no propietario is saved, with an empty Propietario', {}, { ok: true, match: { transportista: '', transportista_ruc: '' } }),
  create('S-REF-41 a blank propietario is no propietario', { [KEY]: '' }, { ok: true, match: { transportista: '' } }),
  create('S-MST-11 a vehiculo with the transportista T carries T and its joined razon social and RUC', { [KEY]: '0000000001' }, { ok: true, match: { [KEY]: '0000000001', transportista: 'TRANSPORTES RAPIDO SAC', transportista_ruc: '20123456789' } }),
  create('S-MST-12 an inactive transportista (estado off) is a 422 on the field', { [KEY]: '0000000003' }, invalid([KEY])),
  create('S-MST-12 a retired transportista is a 422 on the field', { [KEY]: '0000000004' }, invalid([KEY])),
  create('S-MST-12 an id that is no transportista is a 422 on the field', { [KEY]: '0000000042' }, invalid([KEY])),
  { name: 'vehiculos S-MST-12 UPDATE to an inactive transportista is a 422 on the field', slug: 'vehiculos', ctx: WRITER, steps: [{ op: 'update', id: '001', body: { [KEY]: '0000000003' } }], expect: invalid([KEY]) },
  { name: 'vehiculos S-MST-12 UPDATE with a blank propietario removes it', slug: 'vehiculos', ctx: WRITER, steps: [{ op: 'update', id: '001', body: { [KEY]: '' } }], expect: { ok: true, match: { transportista: '' } } },
  { name: 'vehiculos S-REF-41 get joins the propietario of a seeded vehiculo', slug: 'vehiculos', steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { [KEY]: '0000000001', transportista: 'TRANSPORTES RAPIDO SAC' } } },
  { name: 'vehiculos R-LKP-3 the list filters over the joined transportista (contains)', slug: 'vehiculos', steps: [{ op: 'list', filters: { transportista: 'rapido' } }], expect: { ok: true, total: 2 } },
  { name: 'vehiculos R-LKP-3 the list filters over the joined RUC (contains)', slug: 'vehiculos', steps: [{ op: 'list', filters: { transportista_ruc: '20123' } }], expect: { ok: true, total: 2 } },
  { name: 'vehiculos R-LKP-3 a marca filter is exact: 1 never matches 001', slug: 'vehiculos', steps: [{ op: 'list', filters: { id_marca: '1' } }], expect: { ok: true, total: 0 } },
  { name: 'vehiculos R-LKP-3 a marca filter takes the exact key', slug: 'vehiculos', steps: [{ op: 'list', filters: { id_marca: '001' } }], expect: { ok: true, total: 2 } },
  { name: 'vehiculos R-LKP-3 a modelo filter takes the exact key', slug: 'vehiculos', steps: [{ op: 'list', filters: { id_modelo: '001' } }], expect: { ok: true, total: 2 } },
];
