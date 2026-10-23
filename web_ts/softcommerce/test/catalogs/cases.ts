import { readSeed } from '../../mock-server/core/test-helpers.js';
import { localidades } from '../../mock-server/registry/catalogs/localidades.js';
import { validateRegistry } from '../../mock-server/registry/schema.js';

/**
 * Shared case table (R-MOCK-18, S-MOCK-35): the registry under test, its seed and
 * single-outcome cases. Every case runs against the in-browser mock AND the HTTP
 * mock through `InterCatalogService`; per-catalog rows join `<slug>.cases.ts` later.
 */
export interface Step {
  op: 'list' | 'get' | 'create' | 'update' | 'remove' | 'options';
  id?: string;
  body?: Record<string, unknown>;
  filters?: Record<string, string>;
}
export type Outcome =
  | { ok: true; match?: Record<string, unknown>; total?: number; items?: { id: string; name: string }[] }
  | { status: number; code: string; fields?: string[]; messages?: string[] };
export interface CatalogCase {
  name: string;
  slug: string;
  /** Earlier steps must succeed; `expect` describes the last one. */
  steps: Step[];
  expect: Outcome;
  /** Session context (X-User-Id, X-Empresa-Id) of the whole case; none by default. */
  ctx?: { userId?: string; empresaId?: string };
  /** Set on rows that record a documented desktop [DEVIATION]. */
  deviation?: boolean;
}

const text = (name: string, extra: Record<string, unknown> = {}) => ({ name, kind: 'text', label: name, required: true, max: 10, ...extra });
const entry = (slug: string, over: Record<string, unknown> = {}) => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});

export const REGISTRY_UNDER_TEST = validateRegistry([
  localidades,
  entry('things', {
    codeWidth: 4,
    fields: [text('descripcion'), { name: 'tipo', kind: 'options', label: 'Tipo', options: [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }] }],
  }),
  entry('padres'),
  entry('hijos', {
    fields: [text('descripcion'), { name: 'id_padre', kind: 'select', label: 'Padre', required: true, source: { catalog: 'padres' } }],
    joins: [{ as: 'padre', ref: 'id_padre', display: 'descripcion' }],
  }),
  entry('series', {
    fields: [text('serie', { max: 4 })],
    unique: [{ fields: ['serie'], errorField: 'serie', message: 'La serie ya existe.' }],
  }),
  entry('modal', { modes: ['UPDATE', 'DETAIL'] }),
  entry('lookup', { scope: 'shared', readOnly: true }),
  // W2-1b: session scope, declared validation order and normalize.
  entry('notas', { scope: 'empresa', stamp: ['id_usuario', 'id_empresa'] }),
  entry('declarado', { fields: [text('a', { max: 5 }), text('b', { max: 5 })], validation: ['a', { unique: 0 }, 'b'], unique: [{ fields: ['a'], errorField: 'a', message: 'Ya existe.' }] }),
  entry('colores', { fields: [text('descripcion', { normalize: ['upper'] })] }),
]);

const row = (slug: string, id: string, extra: Record<string, unknown> = {}) => ({ [`id_${slug}`]: id, descripcion: `R${id}`, activo: true, ...extra });
export const SEED_UNDER_TEST = {
  ...readSeed(),
  things: { demo: [row('things', '0007', { tipo: 'E' })] },
  padres: { demo: [row('padres', '1', { descripcion: 'PADRE' })] },
  hijos: { demo: [row('hijos', '1', { id_padre: '1' }), row('hijos', '2', { id_padre: '10' })] },
  series: { demo: [{ id_series: '1', serie: 'F001', activo: true }] },
  modal: { demo: [row('modal', '1')] },
  lookup: [row('lookup', '1')],
  notas: { demo: [row('notas', '1', { id_empresa: '1' }), row('notas', '2', { id_empresa: '2' })] },
  declarado: { demo: [{ id_declarado: '1', a: 'X', b: 'Y', activo: true }] },
  colores: { demo: [] },
};

const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });

export const CASES: CatalogCase[] = [
  { name: 'S-MOCK-25 pads the generated code to codeWidth', slug: 'things', steps: [{ op: 'create', body: { descripcion: '  ab ' } }], expect: { ok: true, match: { id_things: '0008', descripcion: 'ab', activo: true } } },
  { name: 'S-MOCK-37 adds the option label on get', slug: 'things', steps: [{ op: 'get', id: '0007' }], expect: { ok: true, match: { tipo: 'E', tipo_label: 'Entrada' } } },
  { name: 'R-MOCK-10 a blank required field is a 422 on that field', slug: 'things', steps: [{ op: 'create', body: { descripcion: ' ' } }], expect: invalid(['descripcion']) },
  { name: 'R-MOCK-10 an option outside its list is a 422', slug: 'things', steps: [{ op: 'create', body: { descripcion: 'X', tipo: 'Z' } }], expect: invalid(['tipo']) },
  { name: 'S-REG-8 an unknown ref is a 422 on the ref field', slug: 'hijos', steps: [{ op: 'create', body: { descripcion: 'X', id_padre: '99' } }], expect: invalid(['id_padre']) },
  { name: 'S-REG-11 joins the parent description', slug: 'hijos', steps: [{ op: 'get', id: '1' }], expect: { ok: true, match: { padre: 'PADRE' } } },
  { name: 'S-MOCK-33 a deleted target cannot be referenced and its join is empty', slug: 'hijos', steps: [{ op: 'remove', id: '1' }, { op: 'get', id: '1' }], expect: { ok: true, match: { activo: false } } },
  { name: 'R-REG-7 a duplicate key is a 409 on the declared field', slug: 'series', steps: [{ op: 'create', body: { serie: 'F001' } }], expect: { status: 409, code: 'DUPLICATE', fields: ['serie'], messages: ['La serie ya existe.'] } },
  { name: 'S-REG-9 an update keeping its own key succeeds', slug: 'series', steps: [{ op: 'update', id: '1', body: { serie: 'F001' } }], expect: { ok: true, match: { serie: 'F001' } } },
  { name: 'S-REG-10 a deleted key is free again', slug: 'series', steps: [{ op: 'remove', id: '1' }, { op: 'create', body: { serie: 'F001' } }], expect: { ok: true, match: { serie: 'F001' } } },
  { name: 'S-REG-13 create outside modes is 405 MODE_NOT_SUPPORTED', slug: 'modal', steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'S-REG-13 remove outside modes is 405 MODE_NOT_SUPPORTED', slug: 'modal', steps: [{ op: 'remove', id: '1' }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'S-REG-14 create on a read-only lookup is 405 METHOD_NOT_ALLOWED', slug: 'lookup', steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: { status: 405, code: 'METHOD_NOT_ALLOWED' } },
  { name: 'S-REG-14 update on a read-only lookup is 405 METHOD_NOT_ALLOWED', slug: 'lookup', steps: [{ op: 'update', id: '1', body: {} }], expect: { status: 405, code: 'METHOD_NOT_ALLOWED' } },
  { name: 'S-REG-14 remove on a read-only lookup is 405 and the data is unchanged', slug: 'lookup', steps: [{ op: 'remove', id: '1' }], expect: { status: 405, code: 'METHOD_NOT_ALLOWED' } },
  { name: 'S-MOCK-15 a read-only lookup still lists', slug: 'lookup', steps: [{ op: 'list' }], expect: { ok: true, total: 1 } },
  { name: 'R-MOCK-9 contains filter on a listed field', slug: 'things', steps: [{ op: 'list', filters: { descripcion: 'r0007' } }], expect: { ok: true, total: 1 } },
  { name: 'S-REG-15 Localidad keeps the W1 422 with every failing field', slug: 'localidades', steps: [{ op: 'create', body: { id_empresa: '99', descripcion: '', id_ubigeo: '15' } }], expect: invalid(['id_empresa', 'descripcion', 'id_ubigeo'], ['id_empresa does not exist', 'descripcion is required', 'id_ubigeo must be an existing distrito']) },
  { name: 'S-REG-15 Localidad create returns the W1 joined item', slug: 'localidades', steps: [{ op: 'create', body: { id_empresa: '1', descripcion: 'SEDE', id_ubigeo: '150103' } }], expect: { ok: true, match: { empresa: 'COMERCIAL DEMO SAC', departamento: 'LIMA', distrito: 'ATE', activo: true } } },
  // W2-1b (S-MOCK-26/27/30/36, S-MOCK-18, S-REG-17, S-REF-2): the same outcomes from both sources.
  { name: 'S-MOCK-26 stamps empresa and user from the session context, not the body', slug: 'notas', ctx: { userId: '5', empresaId: '1' }, steps: [{ op: 'create', body: { descripcion: 'X', id_usuario: '9', id_empresa: '9' } }], expect: { ok: true, match: { id_empresa: '1', id_usuario: 5 } } },
  { name: 'S-MOCK-27 an empresa-scope list shows only the session empresa', slug: 'notas', ctx: { userId: '5', empresaId: '1' }, steps: [{ op: 'list' }], expect: { ok: true, total: 1 } },
  { name: 'S-MOCK-36 a missing session empresa is 400 MISSING_SESSION_CONTEXT', slug: 'notas', steps: [{ op: 'list' }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },
  { name: 'S-MOCK-36 a missing user on write is 400 MISSING_SESSION_CONTEXT', slug: 'notas', ctx: { empresaId: '1' }, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },
  { name: 'S-MOCK-36 an empresa outside the tenant is 400 INVALID_SESSION_CONTEXT', slug: 'notas', ctx: { userId: '5', empresaId: '999' }, steps: [{ op: 'list' }], expect: { status: 400, code: 'INVALID_SESSION_CONTEXT' } },
  { name: 'S-MOCK-36 Localidad needs no session context', slug: 'localidades', steps: [{ op: 'list' }], expect: { ok: true } },
  { name: 'S-MOCK-30 options match the filter exactly, as {id,name}', slug: 'hijos', steps: [{ op: 'options', filters: { id_padre: '1' } }], expect: { ok: true, items: [{ id: '1', name: 'R1' }] } },
  { name: 'S-MOCK-30 options of an unknown value are empty, not an error', slug: 'hijos', steps: [{ op: 'options', filters: { id_padre: 'zzz' } }], expect: { ok: true, items: [] } },
  { name: 'S-MOCK-30 options of an empresa-scope catalog follow the session empresa', slug: 'notas', ctx: { userId: '5', empresaId: '2' }, steps: [{ op: 'options' }], expect: { ok: true, items: [{ id: '2', name: 'R2' }] } },
  { name: 'S-MOCK-18 trims and normalizes before storing', slug: 'colores', steps: [{ op: 'create', body: { descripcion: '  rojo ' } }], expect: { ok: true, match: { descripcion: 'ROJO' } } },
  { name: 'S-REF-2 the required message names the entity and the mode', slug: 'things', steps: [{ op: 'create', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para agregar un item, debes especificar su descripcion.']) },
  { name: 'S-REF-2 update words the same message with modificar', slug: 'things', steps: [{ op: 'update', id: '0007', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para modificar un item, debes especificar su descripcion.']) },
  { name: 'S-REG-17 the unique error is returned before a later field', slug: 'declarado', steps: [{ op: 'create', body: { a: 'X', b: '' } }], expect: { status: 409, code: 'DUPLICATE', fields: ['a'], messages: ['Ya existe.'] } },
  { name: 'D10 a W2 entry reports only the first failing step', slug: 'things', steps: [{ op: 'create', body: { descripcion: ' ', tipo: 'Z' } }], expect: invalid(['descripcion']) },
];
