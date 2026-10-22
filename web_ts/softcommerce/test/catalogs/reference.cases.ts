/// <reference types="vite/client" />
import { REGISTRY } from '../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
import type { CatalogCase, Outcome } from './cases';

/**
 * Table-driven cases of the text-only reference catalogs (R-REF-4). Generic rows are generated from the
 * UI config derived from the registry, so UI, HTTP mock and in-browser mock must all meet them (R-REG-3,
 * S-REF-37); per-slug rows pin the exact desktop texts and the documented [DEVIATION]s.
 */
export const ENTITIES: Record<string, string> = {
  aduanas: 'un Aduana',
  colores: 'un Color',
  'estados-documento': 'un Estado de Documento',
  laboratorios: 'un Laboratorio',
  marcas: 'una Marca',
  nacionalidades: 'una Nacionalidad',
  'motivos-traslado': 'un Motivo Traslado',
  'clasif-clientes': 'una Clasif Cliente',
};

const files = import.meta.glob<Record<string, any[]>>('../../mock-server/data/catalogs/*.json', { eager: true, import: 'default' });
/** Demo seed rows of a catalog file. */
export const seedRows = (seed: string): any[] => files[`../../mock-server/data/catalogs/${seed}.json`]?.demo ?? [];

/** Slugs whose desktop message names the wrong entity or gender; the web port words the real one. */
const DEVIATIONS = new Set(['marcas', 'motivos-traslado']);

const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };

/** The reference catalogs of ENTITIES: the generic rows below cover their code and text fields. */
export const referenceEntries = () => REGISTRY.entries.filter((e: any) => e.slug in ENTITIES);

function genericCases(entry: any): CatalogCase[] {
  const { slug, idKey, codeWidth } = entry;
  const config = toCatalogConfig(entry);
  const texts = config.fields.flatMap((f) => (f.kind === 'text' ? [f] : []));
  const valid = Object.fromEntries(texts.filter((f) => f.required).map((f) => [f.name, 'x']));
  const rows = seedRows(entry.seed);
  const active = rows.filter((r) => r.activo !== false);
  const inactive = rows.find((r) => r.activo === false);
  const next = String(Math.max(...rows.map((r) => Number(r[idKey]))) + 1).padStart(codeWidth, '0');
  const at = (what: string) => `${slug} ${what}`;
  const create = (body: Record<string, unknown>, expect: Outcome, ctx: CatalogCase['ctx'] = WRITER): CatalogCase => ({ name: '', slug, ctx, steps: [{ op: 'create', body }], expect });

  const cases: CatalogCase[] = [
    { ...create({ ...valid }, { ok: true, match: { [idKey]: next, activo: true } }), name: at('S-MOCK-25 the server issues the next code padded to codeWidth') },
    { name: at('S-REF-1 the list hides inactive rows'), slug, steps: [{ op: 'list' }], expect: { ok: true, total: active.length } },
    { name: at('S-MOCK-15 get resolves an inactive row'), slug, steps: [{ op: 'get', id: inactive[idKey] }], expect: { ok: true, match: { activo: false } } },
    { name: at('R-MOCK-7 a deleted row leaves the list'), slug, steps: [{ op: 'remove', id: active[0][idKey] }, { op: 'list' }], expect: { ok: true, total: active.length - 1 } },
    { ...create({ ...valid, id_usuario: '9' }, { ok: true, match: { id_usuario: 7 } }), name: at('S-MOCK-26 stamps the session user, not the body') },
    { ...create({ ...valid }, { status: 400, code: 'MISSING_SESSION_CONTEXT' }, {}), name: at('S-MOCK-36 a write without the user header is a 400') },
  ];
  for (const { name, required, maxLength, uppercase } of texts) {
    if (required) {
      cases.push({ ...create({ ...valid, [name]: '  ' }, invalid([name])), name: at(`S-REF-34 a blank ${name} is a 422 on it`) });
      const { [name]: _omitted, ...without } = valid;
      cases.push({ ...create(without, invalid([name])), name: at(`S-REF-34 a missing ${name} is a 422 on it`) });
    }
    if (maxLength !== undefined) {
      cases.push({ ...create({ ...valid, [name]: 'x'.repeat(maxLength) }, { ok: true }), name: at(`S-REF-3 ${name} accepts ${maxLength} characters`) });
      cases.push({ ...create({ ...valid, [name]: 'x'.repeat(maxLength + 1) }, invalid([name])), name: at(`S-REF-3 ${name} rejects ${maxLength + 1} characters`) });
    }
    cases.push({ ...create({ ...valid, [name]: '  rojo ' }, { ok: true, match: { [name]: uppercase ? 'ROJO' : 'rojo' } }), name: at(`S-REF-4 ${name} is trimmed${uppercase ? ' and uppercased' : ' and keeps its case'}`) });
  }
  return cases;
}

/** Exact desktop texts and deviations per slug (R-REF-3, R-REF-4). */
function slugCases(slug: string, deviation = false): CatalogCase[] {
  const entity = ENTITIES[slug];
  const first = seedRows(REGISTRY.bySlug.get(slug).seed)[0][REGISTRY.bySlug.get(slug).idKey];
  const text = (mode: string) => `Para ${mode} ${entity}, debes especificar su Descripcion.`;
  return [
    { name: `${slug} S-REF-2 INSERT words the desktop message`, slug, ctx: WRITER, deviation, steps: [{ op: 'create', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], [text('agregar')]) },
    { name: `${slug} S-REF-2 UPDATE says modificar`, slug, ctx: WRITER, deviation, steps: [{ op: 'update', id: first, body: { descripcion: ' ' } }], expect: invalid(['descripcion'], [text('modificar')]) },
  ];
}

export const REFERENCE_CASES: CatalogCase[] = [
  ...referenceEntries().flatMap(genericCases),
  ...Object.keys(ENTITIES).flatMap((slug) => slugCases(slug, DEVIATIONS.has(slug))),
  // R-REF-4 laboratorios: pais is optional, uppercased and capped at 100.
  { name: 'laboratorios pais is optional', slug: 'laboratorios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'abbott' } }], expect: { ok: true, match: { descripcion: 'ABBOTT' } } },
  { name: 'laboratorios pais is uppercased', slug: 'laboratorios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'abbott', pais: ' suiza ' } }], expect: { ok: true, match: { pais: 'SUIZA' } } },
  { name: 'laboratorios pais over 100 characters is a 422', slug: 'laboratorios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', pais: 'p'.repeat(101) } }], expect: invalid(['pais']) },
  // R-REF-4 nacionalidades: PERUANA and EXTRANJERA are seeded for the docIdentidad rule (W2-12).
  { name: 'nacionalidades seeds PERUANA', slug: 'nacionalidades', steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { descripcion: 'PERUANA' } } },
  { name: 'nacionalidades seeds EXTRANJERA', slug: 'nacionalidades', steps: [{ op: 'get', id: '002' }], expect: { ok: true, match: { descripcion: 'EXTRANJERA' } } },
  // R-REF-5 motivos-traslado: hab_guia is a boolean (default false), abrev is optional.
  { name: 'motivos-traslado abrev is optional and hab_guia defaults to false', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'venta' } }], expect: { ok: true, match: { descripcion: 'VENTA', hab_guia: false } } },
  { name: 'motivos-traslado abrev is uppercased', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: ' vta ' } }], expect: { ok: true, match: { abrev: 'VTA' } } },
  { name: 'motivos-traslado abrev over 100 characters is a 422', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'a'.repeat(101) } }], expect: invalid(['abrev']) },
  { name: 'S-CRUD-24 motivos-traslado stores the boolean it is sent', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', hab_guia: true } }], expect: { ok: true, match: { hab_guia: true } } },
  { name: 'motivos-traslado hab_guia can be switched on UPDATE', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'update', id: '002', body: { descripcion: 'ENTRE ALMACENES', hab_guia: true } }], expect: { ok: true, match: { hab_guia: true } } },
  { name: 'motivos-traslado hab_guia must be a boolean', slug: 'motivos-traslado', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', hab_guia: 'S' } }], expect: invalid(['hab_guia']) },
  // R-REF-3 estado (S-REF-7): true on create, editable afterwards; it is not the logical-delete flag.
  { name: 'S-REF-7 clasif-clientes estado is true when the body omits it', slug: 'clasif-clientes', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x' } }], expect: { ok: true, match: { estado: true, activo: true } } },
  { name: 'S-REF-7 clasif-clientes estado can be set to false on UPDATE and the row stays listed', slug: 'clasif-clientes', ctx: WRITER, steps: [{ op: 'update', id: '1', body: { descripcion: 'MAYORISTA', estado: false } }, { op: 'list' }], expect: { ok: true, total: 2 } },
  { name: 'S-REF-7 clasif-clientes estado must be a boolean', slug: 'clasif-clientes', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', estado: 'A' } }], expect: invalid(['estado']) },
  { name: 'S-REF-7 clasif-clientes get returns the stored estado of an inactive-estado row', slug: 'clasif-clientes', steps: [{ op: 'get', id: '2' }], expect: { ok: true, match: { estado: false, activo: true } } },
];
