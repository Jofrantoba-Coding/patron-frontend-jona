import { readSeed } from '../../mock-server/core/test-helpers.js';
import { localidades } from '../../mock-server/registry/catalogs/localidades.js';
import { validateRegistry } from '../../mock-server/registry/schema.js';

/**
 * Shared case table (R-MOCK-18, S-MOCK-35): the registry under test, its seed and
 * single-outcome cases. Every case runs against the in-browser mock AND the HTTP
 * mock through `InterCatalogService`; per-catalog rows join `<slug>.cases.ts` later.
 */
export interface Step {
  op: 'list' | 'get' | 'create' | 'update' | 'remove';
  id?: string;
  body?: Record<string, unknown>;
  filters?: Record<string, string>;
}
export type Outcome =
  | { ok: true; match?: Record<string, unknown>; total?: number }
  | { status: number; code: string; fields?: string[]; messages?: string[] };
export interface CatalogCase {
  name: string;
  slug: string;
  /** Earlier steps must succeed; `expect` describes the last one. */
  steps: Step[];
  expect: Outcome;
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
]);

const row = (slug: string, id: string, extra: Record<string, unknown> = {}) => ({ [`id_${slug}`]: id, descripcion: `R${id}`, activo: true, ...extra });
export const SEED_UNDER_TEST = {
  ...readSeed(),
  things: { demo: [row('things', '0007', { tipo: 'E' })] },
  padres: { demo: [row('padres', '1', { descripcion: 'PADRE' })] },
  hijos: { demo: [row('hijos', '1', { id_padre: '1' })] },
  series: { demo: [{ id_series: '1', serie: 'F001', activo: true }] },
  modal: { demo: [row('modal', '1')] },
  lookup: [row('lookup', '1')],
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
];
