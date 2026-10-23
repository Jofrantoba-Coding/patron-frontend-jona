/// <reference types="vite/client" />
import { todayIso } from '../../mock-server/core/dates.js';
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
  'clasif-inventarios': 'un Tipo de Movimiento de Inventario',
  tamanos: 'un Tamano',
  'tipos-anexo': 'un Tipo Anexo',
  'tipos-descuento': 'un Tipo Descuento',
  'condiciones-pago': 'una Condición de Pago',
  'tipos-trabajador': 'un Tipo Trabajador',
  'marcas-vehiculo': 'una Marca Vehiculo',
  turnos: 'un Turno',
  'motivos-descuento': 'un Motivo Descuento',
  'motivos-nc': 'un Motivo de Nota de Crédito',
  'tipos-trabajador-perfil': 'un Perfil',
  familias: 'una Familia',
  'modelos-vehiculo': 'un Modelo Vehiculo',
  subfamilias: 'una SubFamilia',
  'tipos-cambio': 'un Tipo de Cambio',
  promociones: 'una Promocion',
  almacenes: 'un Almacen',
  zonas: 'una Zona',
  correlativos: 'un Correlativo',
};

/** Message style per slug when it is not M1, and the descripcion label phrase when it is not `su Descripcion`. */
const M2 = new Set(['tipos-trabajador', 'marcas-vehiculo', 'turnos', 'modelos-vehiculo']);
const DESCRIPCION: Record<string, string> = { 'condiciones-pago': 'su Descripción', almacenes: 'su Descripción' };
/** Reference catalogs with no `descripcion` field (the Turno is its own hora:minuto, the Tipo de Cambio its fecha and moneda). */
export const NO_DESCRIPCION = new Set(['turnos', 'tipos-cambio', 'correlativos']);
/** The Motivo de Nota de Crédito checks its tipo before the descripcion (R-REF-5). */
/** The Almacen checks its localidad and punto de venta before the descripcion (RegisterAlmacen.isRegisterValid). */
export const DESCRIPCION_NOT_FIRST = new Set(['motivos-nc', 'subfamilias', 'almacenes']);

/** The desktop sentence for a blank descripcion in `modo` (agregar, modificar, ...). */
export const descripcionText = (slug: string, modo: string) => {
  const label = DESCRIPCION[slug] ?? 'su Descripcion';
  // The desktop descripcion message of the SubFamilia has a stray space before its comma (RegisterSubFamilia.isRegisterValid).
  if (slug === 'subfamilias') return `Para ${modo} ${ENTITIES[slug]} , debes especificar ${label}.`;
  return M2.has(slug) ? `Para ${modo}, debes especificar ${label}.` : `Para ${modo} ${ENTITIES[slug]}, debes especificar ${label}.`;
};

const files = import.meta.glob<Record<string, any[]>>('../../mock-server/data/catalogs/*.json', { eager: true, import: 'default' });
/** Demo seed rows of a catalog file. */
export const seedRows = (seed: string): any[] => {
  const data = files[`../../mock-server/data/catalogs/${seed}.json`];
  return Array.isArray(data) ? data : (data?.demo ?? []);
};

/** Slugs whose desktop message names the wrong entity or gender; the web port words the real one. */
const DEVIATIONS = new Set(['marcas', 'motivos-traslado', 'tamanos', 'tipos-anexo']);

/** A date no seed row uses, so a valid body never meets the (empresa, fecha, moneda) key of a seeded tipo de cambio. */
const FREE_DATE = '2030-06-15';

const w1Files = import.meta.glob<any>('../../mock-server/data/*.json', { eager: true, import: 'default' });
/** The W1 file of an entry or source with no seed file of its own: a W1 section (R-REG-12) or a builtin source. */
const W1_FILE: Record<string, string> = { localidades: 'localidades', empresa: 'empresas', 'punto-venta': 'puntos-venta', empresas: 'empresas', ubigeo: 'ubigeo' };
const w1Rows = (file: string) => {
  const data = w1Files[`../../mock-server/data/${file}.json`];
  return Array.isArray(data) ? data : (data?.demo ?? []);
};

/** What a select points to: its rows, id key and, for ubigeo, the rule that only a distrito (6 digits) is a valid ref. */
function sourceOf(catalog: string): { rows: any[]; idKey: string; scope?: string; accepts: (row: any) => boolean } {
  const entry = REGISTRY.bySlug.get(catalog);
  if (!entry) return { rows: w1Rows(W1_FILE[catalog]), idKey: 'id', accepts: (row) => catalog !== 'ubigeo' || row.id.length === 6 };
  return { rows: entry.seed === null ? w1Rows(W1_FILE[catalog]) : seedRows(entry.seed), idKey: entry.idKey, scope: entry.scope, accepts: () => true };
}

/**
 * A ref id the server accepts for a select field: the first active row of its source that meets the static where (`$session.empresa`
 * is the session empresa) and belongs to the parents already chosen (`chosen`, by field name).
 */
const refId = (field: any, empresa: string | undefined, chosen: Record<string, string>): string => {
  const source = sourceOf(field.source.catalog);
  const where = Object.entries(field.source.where ?? {}).map(([k, v]) => [k, v === '$session.empresa' ? (empresa ?? EMPRESA) : v] as const);
  // An empresa-scope source only offers (and the server only accepts) the rows of the session empresa.
  const row = source.rows.find(
    (r) =>
      r.activo !== false && source.accepts(r) && (empresa === undefined || source.scope !== 'empresa' || String(r.id_empresa) === empresa) &&
      where.every(([k, v]) => String(r[k]) === String(v)) && (field.dependsOn ?? []).every((p: any) => String(r[p.filterKey]) === chosen[p.field]),
  );
  return String(row[source.idKey]);
};

/** The required selects of an entry filled in declared order, each child with an id of the parent chosen before it. */
const refsFor = (entry: any, empresa?: string): Record<string, string> => {
  const chosen: Record<string, string> = {};
  for (const f of entry.fields.filter((f: any) => f.kind === 'select' && f.required)) chosen[f.name] = refId(f, empresa, chosen);
  return chosen;
};

/** Session empresa of the table: the demo seed has rows of empresas 1 and 2 (5.3, 5.6b). */
const EMPRESA = '1';
/** Entries whose writes record the session empresa: `scope: 'empresa'` also limits list and get to it, a stamp-only entry does not. */
const usesEmpresa = (entry: any) => entry.scope === 'empresa' || (entry.stamp ?? []).includes('id_empresa');
const inEmpresa = (entry: any, rows: any[]) => (entry.scope === 'empresa' ? rows.filter((r) => String(r.id_empresa) === EMPRESA) : rows);

const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };

/** The reference catalogs of ENTITIES: the generic rows below cover their code and text fields. */
export const referenceEntries = () => REGISTRY.entries.filter((e: any) => e.slug in ENTITIES);

function genericCases(entry: any): CatalogCase[] {
  const { slug, idKey, codeWidth } = entry;
  const config = toCatalogConfig(entry);
  // A conditional text (the ticket fields of a Correlativo) has its own rows: it only exists for some values of another field.
  const texts = config.fields.flatMap((f) => (f.kind === 'text' && !f.visibleWhen ? [f] : []));
  // A valid body: every required text, every required integer (1), and the first option of every required options field.
  const valid = {
    ...Object.fromEntries(texts.filter((f) => f.required).map((f) => [f.name, 'x'])),
    ...Object.fromEntries(config.fields.filter((f) => f.kind === 'number' && f.required).map((f) => [f.name, '1'])),
    ...Object.fromEntries(entry.fields.filter((f: any) => f.kind === 'options' && f.required).map((f: any) => [f.name, f.options[0].value])),
    ...refsFor(entry),
    ...Object.fromEntries(entry.fields.filter((f: any) => f.kind === 'date' && f.required).map((f: any) => [f.name, FREE_DATE])),
  };
  /** Required refs that exist in the session empresa: an empresa-scope source (the familia) differs per empresa. */
  const refsOf = (empresa: string) => refsFor(entry, empresa);
  const rows = seedRows(entry.seed);
  const scoped = inEmpresa(entry, rows);
  const active = scoped.filter((r) => r.activo !== false);
  const inactive = scoped.find((r) => r.activo === false);
  const next = String(Math.max(...rows.map((r) => Number(r[idKey]))) + 1).padStart(codeWidth, '0');
  const at = (what: string) => `${slug} ${what}`;
  const create = (body: Record<string, unknown>, expect: Outcome, ctx: CatalogCase['ctx'] = WRITER): CatalogCase => ({ name: '', slug, ctx, steps: [{ op: 'create', body }], expect });

  const cases: CatalogCase[] = [
    { ...create({ ...valid }, { ok: true, match: { [idKey]: next, activo: true } }), name: at('S-MOCK-25 the server issues the next code padded to codeWidth') },
    { name: at('S-REF-1 the list hides inactive rows'), slug, steps: [{ op: 'list' }], expect: { ok: true, total: active.length } },
    { name: at('S-MOCK-15 get resolves an inactive row'), slug, steps: [{ op: 'get', id: inactive[idKey] }], expect: { ok: true, match: { activo: false } } },
    { name: at('R-MOCK-7 a deleted row leaves the list'), slug, steps: [{ op: 'remove', id: active[0][idKey] }, { op: 'list' }], expect: { ok: true, total: active.length - 1 } },
  ];
  // The Turno desktop never passes the user to its DAO, so it stamps nothing and needs no session header.
  if (entry.stamp?.includes('id_usuario')) {
    cases.push(
      { ...create({ ...valid, id_usuario: '9' }, { ok: true, match: { id_usuario: 7 } }), name: at('S-MOCK-26 stamps the session user, not the body') },
      { ...create({ ...valid }, { status: 400, code: 'MISSING_SESSION_CONTEXT' }, {}), name: at('S-MOCK-36 a write without the user header is a 400') },
    );
  }
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
  // S-MOCK-26/27/36 on the real catalogs of an empresa: writes record the session empresa, an `empresa` scope limits reads to it.
  if (usesEmpresa(entry)) {
    const as = (empresaId: string) => ({ userId: '7', empresaId });
    const count = (empresa: string) => rows.filter((r) => String(r.id_empresa) === empresa && r.activo !== false).length;
    const list = (what: string, empresaId: string, expect: Outcome): CatalogCase => ({ name: at(what), slug, ctx: as(empresaId), steps: [{ op: 'list' }], expect });
    cases.push(
      { ...create({ ...valid, ...refsOf('2'), id_empresa: '9' }, { ok: true, match: { id_empresa: '2' } }, as('2')), name: at('S-MOCK-26 a write records the session empresa, not the body') },
      { ...create({ ...valid }, { status: 400, code: 'MISSING_SESSION_CONTEXT' }, as('')), name: at('S-MOCK-36 a write without the empresa header is a 400') },
      { ...create({ ...valid }, { status: 400, code: 'INVALID_SESSION_CONTEXT' }, as('999')), name: at('S-MOCK-36 a write with an empresa outside the tenant is a 400') },
    );
    if (entry.scope === 'empresa') {
      const other = rows.find((r) => String(r.id_empresa) !== EMPRESA);
      cases.push(
        list('S-MOCK-27 empresa 1 lists only its own rows', '1', { ok: true, total: count('1') }),
        list('S-MOCK-27 empresa 2 lists only its own rows', '2', { ok: true, total: count('2') }),
        list('S-MOCK-36 a list without the empresa header is a 400', '', { status: 400, code: 'MISSING_SESSION_CONTEXT' }),
        list('S-MOCK-36 a list with an empresa outside the tenant is a 400', '999', { status: 400, code: 'INVALID_SESSION_CONTEXT' }),
        { name: at('S-MOCK-27 a row of another empresa is not found'), slug, ctx: as('1'), steps: [{ op: 'get', id: other[idKey] }], expect: { status: 404, code: 'NOT_FOUND' } },
      );
    } else cases.push(list('the list stays tenant-wide: it needs no empresa header', '', { ok: true, total: active.length }));
  }
  // S-REF-34: a required ref that is blank, unknown or inactive is a 422 on that field, for every catalog with a select.
  for (const { name, required, source, default: starts } of entry.fields.filter((f: any) => f.kind === 'select')) {
    if (required) {
      const { [name]: _omitted, ...without } = valid;
      // A select with a default (the moneda of a tipo de cambio) is filled when the body omits it; a blank one is still a 422.
      if (starts === undefined) cases.push({ ...create(without, invalid([name])), name: at(`S-REF-34 a missing ${name} is a 422 on it`) });
      else cases.push({ ...create({ ...valid, [name]: '' }, invalid([name])), name: at(`S-REF-34 a blank ${name} is a 422 on it`) });
    }
    cases.push({ ...create({ ...valid, [name]: '99999' }, invalid([name])), name: at(`S-REF-34 an unknown ${name} is a 422 on it`) });
    const target = sourceOf(source.catalog);
    const retired = target.rows.find((r) => r.activo === false);
    if (retired) cases.push({ ...create({ ...valid, [name]: String(retired[target.idKey]) }, invalid([name])), name: at(`S-REF-34 an inactive ${name} is a 422 on it`) });
  }
  return cases;
}

/** Exact desktop texts and deviations per slug (R-REF-3, R-REF-4). */
function slugCases(slug: string, deviation = false): CatalogCase[] {
  const first = seedRows(REGISTRY.bySlug.get(slug).seed)[0][REGISTRY.bySlug.get(slug).idKey];
  const text = (modo: string) => descripcionText(slug, modo);
  return [
    { name: `${slug} S-REF-2 INSERT words the desktop message`, slug, ctx: WRITER, deviation, steps: [{ op: 'create', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], [text('agregar')]) },
    { name: `${slug} S-REF-2 UPDATE says modificar`, slug, ctx: WRITER, deviation, steps: [{ op: 'update', id: first, body: { descripcion: ' ' } }], expect: invalid(['descripcion'], [text('modificar')]) },
  ];
}

const DATE_MSG = 'La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.';
const DUPLICATE_MSG = 'La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.';
/** Stray space before the comma: the desktop spells its monto messages `un Tipo de Cambio , debes ...` (RegisterTipoCambio.isRegisterValid). */
const montoText = (modo: string, label: string) => `Para ${modo} un Tipo de Cambio , debes especificar su ${label}.`;
const AMOUNTS = { monto_compra: 1, monto_venta: 1, monto_comercial: 1, monto_especial: 1 };

const CORRELATIVO_DUPLICATE = 'Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.';

const BASE_CASES: CatalogCase[] = [
  ...referenceEntries().flatMap(genericCases),
  ...Object.keys(ENTITIES).filter((slug) => !NO_DESCRIPCION.has(slug) && !DESCRIPCION_NOT_FIRST.has(slug)).flatMap((slug) => slugCases(slug, DEVIATIONS.has(slug))),
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
  // R-REF-4 clasif-inventarios: tipo is a required E|S option, checked after descripcion and abrev.
  { name: 'S-REF-6 clasif-inventarios without a tipo says so with the desktop text', slug: 'clasif-inventarios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'x' } }], expect: invalid(['tipo'], ['Para agregar un Tipo de Movimiento de Inventario, debes especificar su Tipo de Movimiento.']) },
  { name: 'clasif-inventarios abrev is required and says Abreviatura', slug: 'clasif-inventarios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', tipo: 'E' } }], expect: invalid(['abrev'], ['Para agregar un Tipo de Movimiento de Inventario, debes especificar su Abreviatura.']) },
  { name: 'S-REF-6 clasif-inventarios stores tipo S and labels it', slug: 'clasif-inventarios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'x', tipo: 'S' } }], expect: { ok: true, match: { tipo: 'S', tipo_label: 'Salida' } } },
  { name: 'R-MOCK-10 clasif-inventarios tipo outside E|S is a 422 on tipo', slug: 'clasif-inventarios', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'x', tipo: 'Z' } }], expect: invalid(['tipo']) },
  { name: 'S-MOCK-37 clasif-inventarios get carries tipo and tipo_label', slug: 'clasif-inventarios', steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { tipo: 'E', tipo_label: 'Entrada' } } },
  { name: 'S-MOCK-37 clasif-inventarios list carries tipo and tipo_label on every item', slug: 'clasif-inventarios', steps: [{ op: 'list' }], expect: { ok: true, match: { items: [{ tipo: 'E', tipo_label: 'Entrada' }, { tipo: 'S', tipo_label: 'Salida' }] } } },
  { name: 'clasif-inventarios tipo can change on UPDATE', slug: 'clasif-inventarios', ctx: WRITER, steps: [{ op: 'update', id: '001', body: { descripcion: 'COMPRA', abrev: 'COM', tipo: 'S' } }], expect: { ok: true, match: { tipo: 'S', tipo_label: 'Salida' } } },
  // R-REF-4 tipos-descuento: abrev is required, at most 5. S-MOCK-17 lists both fields, but D10 stops at the first failing step.
  { name: 'S-MOCK-17 tipos-descuento blank descripcion and a 6-character abrev fail on descripcion first (D10)', slug: 'tipos-descuento', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: ' ', abrev: 'abcdef' } }], expect: invalid(['descripcion']) },
  { name: 'S-MOCK-17 tipos-descuento abrev of 6 characters is a 422 on abrev', slug: 'tipos-descuento', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'abcdef' } }], expect: invalid(['abrev']) },
  { name: 'tipos-descuento abrev accepts 5 characters, uppercased', slug: 'tipos-descuento', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: ' ab12c ' } }], expect: { ok: true, match: { abrev: 'AB12C' } } },
  { name: 'tipos-descuento blank abrev says Abrev, not Descripcion [DEVIATION]', slug: 'tipos-descuento', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: { descripcion: 'x', abrev: ' ' } }], expect: invalid(['abrev'], ['Para agregar un Tipo Descuento, debes especificar su Abrev.']) },
  // R-REF-4 tipos-anexo: abreviatura is optional.
  { name: 'tipos-anexo abreviatura is optional', slug: 'tipos-anexo', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'principal' } }], expect: { ok: true, match: { descripcion: 'PRINCIPAL' } } },
  { name: 'tipos-anexo abreviatura is uppercased and capped at 100', slug: 'tipos-anexo', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abreviatura: 'a'.repeat(101) } }], expect: invalid(['abreviatura']) },
  // R-REF-5 condiciones-pago (S-REF-5): dias_pago is a required integer where 0 is valid, tipo is a required option with no default.
  { name: 'S-REF-5 condiciones-pago a blank dias_pago says sus Dias de Pago', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', tipo: 'CR' } }], expect: invalid(['dias_pago'], ['Para agregar una Condición de Pago, debes especificar sus Dias de Pago.']) },
  { name: 'S-REF-5 condiciones-pago dias_pago 0 with a tipo is accepted', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'contado', dias_pago: 0, tipo: 'CO' } }], expect: { ok: true, match: { dias_pago: 0, tipo: 'CO', tipo_label: 'Contado' } } },
  { name: 'S-REF-5 condiciones-pago without a tipo says su Tipo de Pago', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', dias_pago: 30 } }], expect: invalid(['tipo'], ['Para agregar una Condición de Pago, debes especificar su Tipo de Pago.']) },
  { name: 'S-REF-5 condiciones-pago a non-digit dias_pago is a 422 on dias_pago', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', dias_pago: 'abc', tipo: 'CR' } }], expect: invalid(['dias_pago']) },
  { name: 'R-CRUD-11 condiciones-pago dias_pago rejects 3 digits', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', dias_pago: '100', tipo: 'CR' } }], expect: invalid(['dias_pago']) },
  { name: 'R-CRUD-11 condiciones-pago dias_pago 99 is accepted', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', dias_pago: 99, tipo: 'CR' } }], expect: { ok: true, match: { dias_pago: 99 } } },
  { name: 'R-MOCK-10 condiciones-pago tipo outside the four codes is a 422 on tipo', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', dias_pago: 1, tipo: 'XX' } }], expect: invalid(['tipo']) },
  { name: 'S-REF-5 condiciones-pago checks descripcion, then dias_pago, then tipo (declared order)', slug: 'condiciones-pago', ctx: WRITER, steps: [{ op: 'create', body: {} }], expect: invalid(['descripcion']) },
  { name: 'S-MOCK-37 condiciones-pago tipo OB is labelled Operación Bancaria on get', slug: 'condiciones-pago', steps: [{ op: 'get', id: '003' }], expect: { ok: true, match: { tipo: 'OB', tipo_label: 'Operación Bancaria' } } },
  { name: 'condiciones-pago a stored dias_pago 0 reads back as 0', slug: 'condiciones-pago', steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { dias_pago: 0, tipo: 'CO' } } },
  // R-REF-5 tipos-trabajador: style M2, abreviatura* U <=5 labelled Abrev, estado preset.
  { name: 'tipos-trabajador a blank abreviatura says su Abrev (M2)', slug: 'tipos-trabajador', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abreviatura: ' ' } }], expect: invalid(['abreviatura'], ['Para agregar, debes especificar su Abrev.']) },
  { name: 'tipos-trabajador abreviatura of 6 characters is a 422', slug: 'tipos-trabajador', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abreviatura: 'abcdef' } }], expect: invalid(['abreviatura']) },
  { name: 'tipos-trabajador abreviatura is trimmed and uppercased', slug: 'tipos-trabajador', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abreviatura: ' ab1 ' } }], expect: { ok: true, match: { abreviatura: 'AB1' } } },
  { name: 'S-REF-7 tipos-trabajador estado is true when the body omits it', slug: 'tipos-trabajador', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abreviatura: 'x' } }], expect: { ok: true, match: { estado: true, activo: true } } },
  { name: 'S-REF-7 tipos-trabajador an estado-false row stays listed', slug: 'tipos-trabajador', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  // R-REF-5 marcas-vehiculo: style M2 and the estado preset.
  { name: 'S-REF-7 marcas-vehiculo estado is true when the body omits it', slug: 'marcas-vehiculo', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'toyota' } }], expect: { ok: true, match: { descripcion: 'TOYOTA', estado: true } } },
  { name: 'S-REF-7 marcas-vehiculo an estado-false row stays listed', slug: 'marcas-vehiculo', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  // R-REF-5 turnos (S-REF-12, S-MOCK-19): two padded integers with ranges, checked in the R-REF-7 order, AM default.
  { name: 'S-MOCK-19 turnos hora 13 is a 422 on hora with the desktop text', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '13', minuto: '30' } }], expect: invalid(['hora'], ['Para agregar, debes Insertar Hora Correcto.']) },
  { name: 'S-REF-12 turnos minuto 60 is a 422 on minuto with the desktop text', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '12', minuto: '60' } }], expect: invalid(['minuto'], ['Para agregar, debes Insertar Minutos Correcto.']) },
  { name: 'S-REF-12 turnos hora 0 minuto 0 is accepted and stored padded', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '0', minuto: '0' } }], expect: { ok: true, match: { hora: '00', minuto: '00', tipo: 'AM', estado: true } } },
  { name: 'S-REF-12 turnos hora 12 minuto 59 are the accepted upper bounds', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '12', minuto: '59', tipo: 'PM' } }], expect: { ok: true, match: { hora: '12', minuto: '59', tipo: 'PM', tipo_label: 'PM' } } },
  { name: 'S-CRUD-35 turnos pads a single digit on the server too', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '5', minuto: '7' } }], expect: { ok: true, match: { hora: '05', minuto: '07' } } },
  { name: 'R-REF-7 turnos a blank hora says su Hora (M2)', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: ' ', minuto: '30' } }], expect: invalid(['hora'], ['Para agregar, debes especificar su Hora.']) },
  { name: 'R-REF-7 turnos a blank minuto says su Minutos', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '5', minuto: '' } }], expect: invalid(['minuto'], ['Para agregar, debes especificar su Minutos.']) },
  { name: 'R-REF-7 turnos checks both blanks before the ranges: blank minuto beats hora 13', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '13', minuto: '' } }], expect: invalid(['minuto'], ['Para agregar, debes especificar su Minutos.']) },
  { name: 'R-REF-7 turnos checks the hora range before the minuto range', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '13', minuto: '60' } }], expect: invalid(['hora']) },
  { name: 'R-REF-7 turnos UPDATE words the range text with modificar', slug: 'turnos', ctx: WRITER, steps: [{ op: 'update', id: '1', body: { hora: '13', minuto: '30' } }], expect: invalid(['hora'], ['Para modificar, debes Insertar Hora Correcto.']) },
  { name: 'R-MOCK-10 turnos tipo outside AM|PM is a 422 on tipo', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '5', minuto: '7', tipo: 'XX' } }], expect: invalid(['tipo']) },
  { name: 'R-MOCK-10 turnos three digits are a 422 on hora', slug: 'turnos', ctx: WRITER, steps: [{ op: 'create', body: { hora: '123', minuto: '30' } }], expect: invalid(['hora']) },
  { name: 'S-REF-7 turnos an estado-false row stays listed', slug: 'turnos', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  // R-REF-5 motivos-descuento (S-REF-9, S-MOCK-28): abrev <= 5 and a required ref to tipos-descuento; the desktop texts are wrong or empty [DEVIATION].
  { name: 'S-REF-9 motivos-descuento without a tipo says su Tipo Dscto on id_tipo_descuento [DEVIATION]', slug: 'motivos-descuento', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'x' } }], expect: invalid(['id_tipo_descuento'], ['Para agregar un Motivo Descuento, debes especificar su Tipo Dscto.']) },
  { name: 'S-REF-9 motivos-descuento an unknown tipo id is a 422 on id_tipo_descuento', slug: 'motivos-descuento', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', abrev: 'x', id_tipo_descuento: '99' } }], expect: invalid(['id_tipo_descuento']) },
  { name: 'motivos-descuento a blank abrev says Abrev, not Descripcion [DEVIATION]', slug: 'motivos-descuento', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: { descripcion: 'x', abrev: ' ', id_tipo_descuento: '1' } }], expect: invalid(['abrev'], ['Para agregar un Motivo Descuento, debes especificar su Abrev.']) },
  { name: 'motivos-descuento checks descripcion, then abrev, then tipo (desktop order)', slug: 'motivos-descuento', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x' } }], expect: invalid(['abrev']) },
  { name: 'S-MOCK-28 motivos-descuento get joins the tipo description', slug: 'motivos-descuento', steps: [{ op: 'get', id: '1' }], expect: { ok: true, match: { id_tipo_descuento: '1', tipo_descuento: 'PORCENTAJE' } } },
  { name: 'S-MOCK-28 motivos-descuento a deactivated tipo joins as an empty string, without error', slug: 'motivos-descuento', steps: [{ op: 'get', id: '3' }], expect: { ok: true, match: { id_tipo_descuento: '3', tipo_descuento: '' } } },
  { name: 'S-MOCK-28 motivos-descuento list carries the joined name on every item', slug: 'motivos-descuento', steps: [{ op: 'list' }], expect: { ok: true, match: { items: [{ tipo_descuento: 'PORCENTAJE' }, { tipo_descuento: 'MONTO FIJO' }, { tipo_descuento: '' }] } } },
  // R-REF-5 motivos-nc: the tipo is checked first; the desktop tipo message says "Familia" [DEVIATION].
  { name: 'motivos-nc checks tipo first: an empty body is a 422 on tipo with the real entity [DEVIATION]', slug: 'motivos-nc', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: {} }], expect: invalid(['tipo'], ['Para agregar un Motivo de Nota de Crédito, debes especificar su Tipo.']) },
  { name: 'motivos-nc a blank descripcion after a valid tipo says su Descripcion [DEVIATION]', slug: 'motivos-nc', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: { tipo: 'P', descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para agregar un Motivo de Nota de Crédito, debes especificar su Descripcion.']) },
  { name: 'motivos-nc UPDATE words the tipo message with modificar', slug: 'motivos-nc', ctx: WRITER, deviation: true, steps: [{ op: 'update', id: '001', body: { tipo: '' } }], expect: invalid(['tipo'], ['Para modificar un Motivo de Nota de Crédito, debes especificar su Tipo.']) },
  { name: 'R-MOCK-10 motivos-nc tipo outside P|C|Y is a 422 on tipo', slug: 'motivos-nc', ctx: WRITER, steps: [{ op: 'create', body: { tipo: 'Z', descripcion: 'x' } }], expect: invalid(['tipo']) },
  { name: 'S-MOCK-37 motivos-nc stores tipo C and labels it NOTA CREDITO VENTA', slug: 'motivos-nc', ctx: WRITER, steps: [{ op: 'create', body: { tipo: 'C', descripcion: 'x' } }], expect: { ok: true, match: { tipo: 'C', tipo_label: 'NOTA CREDITO VENTA' } } },
  { name: 'S-MOCK-37 motivos-nc get carries the label of tipo Y', slug: 'motivos-nc', steps: [{ op: 'get', id: '003' }], expect: { ok: true, match: { tipo: 'Y', tipo_label: 'NOTA DEBITO VENTA' } } },
  // R-REF-5 tipos-trabajador-perfil: descripcion first, then a tipo trabajador whose estado is active (the desktop lists estado A).
  { name: 'tipos-trabajador-perfil without a tipo says su Tipo Trabajador [DEVIATION]', slug: 'tipos-trabajador-perfil', ctx: WRITER, deviation: true, steps: [{ op: 'create', body: { descripcion: 'x' } }], expect: invalid(['id_tipo_trabajador'], ['Para agregar un Perfil, debes especificar su Tipo Trabajador.']) },
  { name: 'tipos-trabajador-perfil checks descripcion before the tipo trabajador', slug: 'tipos-trabajador-perfil', ctx: WRITER, steps: [{ op: 'create', body: {} }], expect: invalid(['descripcion']) },
  { name: 'tipos-trabajador-perfil rejects a tipo trabajador whose estado is false (active only)', slug: 'tipos-trabajador-perfil', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'x', id_tipo_trabajador: '003' } }], expect: invalid(['id_tipo_trabajador']) },
  { name: 'tipos-trabajador-perfil accepts an active tipo trabajador', slug: 'tipos-trabajador-perfil', ctx: WRITER, steps: [{ op: 'create', body: { descripcion: 'cajero', id_tipo_trabajador: '002' } }], expect: { ok: true, match: { descripcion: 'CAJERO', id_tipo_trabajador: '002', tipo_trabajador: 'VENDEDOR' } } },
  { name: 'S-MOCK-28 tipos-trabajador-perfil get joins the tipo trabajador name', slug: 'tipos-trabajador-perfil', steps: [{ op: 'get', id: '1' }], expect: { ok: true, match: { tipo_trabajador: 'ADMINISTRATIVO' } } },
  { name: 'S-MOCK-30 the active-only filter keeps estado-false tipos out of the options', slug: 'tipos-trabajador', steps: [{ op: 'options', filters: { estado: 'true' } }], expect: { ok: true, items: [{ id: '001', name: 'ADMINISTRATIVO' }, { id: '002', name: 'VENDEDOR' }] } },
  // R-REF-5 subfamilias (S-REF-8, S-MOCK-23, S-MOCK-28): the familia is checked first, then the descripcion; the SUNAT code is optional and follows the familia.
  { name: 'subfamilias an empty body is a 422 on id_familia with the desktop text', slug: 'subfamilias', steps: [{ op: 'create', body: {} }], expect: invalid(['id_familia'], ['Para agregar una SubFamilia, debes especificar su Familia.']) },
  { name: 'subfamilias UPDATE words the familia message with modificar', slug: 'subfamilias', steps: [{ op: 'update', id: '001', body: { id_familia: '' } }], expect: invalid(['id_familia'], ['Para modificar una SubFamilia, debes especificar su Familia.']) },
  { name: 'subfamilias a blank descripcion keeps the desktop spacing before the comma', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '001', descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para agregar una SubFamilia , debes especificar su Descripcion.']) },
  { name: 'subfamilias UPDATE words the descripcion message with modificar', slug: 'subfamilias', steps: [{ op: 'update', id: '001', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para modificar una SubFamilia , debes especificar su Descripcion.']) },
  { name: 'S-MOCK-23 subfamilias an unknown familia is a 422 on id_familia', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '999', descripcion: 'x' } }], expect: invalid(['id_familia']) },
  { name: 'S-MOCK-23 subfamilias an inactive familia is a 422 on id_familia', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '004', descripcion: 'x' } }], expect: invalid(['id_familia']) },
  { name: 'S-MOCK-23 subfamilias a familia of another empresa is a 422 on id_familia', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '005', descripcion: 'x' } }], expect: invalid(['id_familia']) },
  { name: 'S-REF-8 subfamilias the SUNAT code is optional', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '001', descripcion: 'frutas' } }], expect: { ok: true, match: { descripcion: 'FRUTAS', subfamilia_sunat: '' } } },
  { name: 'S-REF-8 subfamilias accepts a SUNAT code of the familia SUNAT code', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '001', descripcion: 'frutas', id_subfamilia_sunat: '501015' } }], expect: { ok: true, match: { id_subfamilia_sunat: '501015', familia: 'ABARROTES', subfamilia_sunat: 'FRUTAS FRESCAS' } } },
  { name: 'S-REF-8 subfamilias rejects a SUNAT code that belongs to another familia', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '001', descripcion: 'x', id_subfamilia_sunat: '501315' } }], expect: invalid(['id_subfamilia_sunat']) },
  { name: 'S-REF-8 subfamilias rejects any SUNAT code under a familia that has none', slug: 'subfamilias', steps: [{ op: 'create', body: { id_familia: '003', descripcion: 'x', id_subfamilia_sunat: '501015' } }], expect: invalid(['id_subfamilia_sunat']) },
  { name: 'S-REF-8 subfamilias a familia change with the old SUNAT code is a 422 on it', slug: 'subfamilias', steps: [{ op: 'update', id: '001', body: { id_familia: '002' } }], expect: invalid(['id_subfamilia_sunat']) },
  { name: 'S-MOCK-28 subfamilias get joins the familia and the SUNAT descriptions', slug: 'subfamilias', steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { id_familia: '001', familia: 'ABARROTES', id_subfamilia_sunat: '501015', subfamilia_sunat: 'FRUTAS FRESCAS' } } },
  { name: 'S-MOCK-28 subfamilias a row without a SUNAT code joins it as an empty string', slug: 'subfamilias', steps: [{ op: 'get', id: '004' }], expect: { ok: true, match: { familia: 'LIMPIEZA', subfamilia_sunat: '' } } },
  { name: 'S-MOCK-28 subfamilias a tenant-wide row of another empresa still joins its familia', slug: 'subfamilias', steps: [{ op: 'get', id: '005' }], expect: { ok: true, match: { familia: 'BEBIDAS', subfamilia_sunat: 'GASEOSAS' } } },
  { name: 'S-REF-8 subfamilias the list is tenant-wide: both empresas show', slug: 'subfamilias', steps: [{ op: 'list' }], expect: { ok: true, total: 6 } },
  // R-REF-6 / R-REF-7 tipos-cambio (S-MOCK-22, S-REF-18, S-REF-19, S-MOCK-19): unique per (empresa, fecha, moneda), amounts above zero, the desktop texts in order.
  ...tipoCambioCases(),
  // R-REF-6 / R-REF-7 promociones (S-REF-20): only the descripcion is validated; the dates carry no range, blank or not-future rule.
  { name: 'S-REF-20 promociones a blank descripcion says the desktop text', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], ['Para agregar una Promocion, debes especificar su Descripcion.']) },
  { name: 'S-REF-20 promociones fecha_fin before fecha_ini is accepted (no range rule)', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: 'verano', fecha_ini: '2026-02-01', fecha_fin: '2026-01-01' } }], expect: { ok: true, match: { fecha_ini: '2026-02-01', fecha_fin: '2026-01-01' } } },
  { name: 'S-REF-20 promociones both dates default to today when the body omits them', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: 'hoy' } }], expect: { ok: true, match: { fecha_ini: todayIso(), fecha_fin: todayIso(), estado: true } } },
  { name: 'S-REF-20 promociones a date in the future is accepted (no not-future rule)', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: 'x', fecha_ini: '2999-01-01', fecha_fin: '2999-12-31' } }], expect: { ok: true, match: { fecha_fin: '2999-12-31' } } },
  { name: 'S-REF-20 promociones a blank date is accepted (the desktop validates only the descripcion)', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: 'x', fecha_ini: '', fecha_fin: '' } }], expect: { ok: true, match: { fecha_ini: '', fecha_fin: '' } } },
  { name: 'S-MOCK-19 promociones a date that does not exist is a 422 on it', slug: 'promociones', steps: [{ op: 'create', body: { descripcion: 'x', fecha_ini: '2026-02-31' } }], expect: invalid(['fecha_ini']) },
  { name: 'S-REF-7 promociones estado can be switched off on UPDATE and the row stays listed', slug: 'promociones', steps: [{ op: 'update', id: '1', body: { descripcion: 'NAVIDAD', estado: false } }, { op: 'list' }], expect: { ok: true, total: 2 } },
  // R-REF-6 almacenes (S-REF-13, S-MOCK-24): localidad, punto de venta, descripcion, direccion, then the cascade; the M1 sentences, the empresa of the session.
  ...almacenCases(),
  // R-REF-6 zonas (S-REF-7, S-REF-33): descripcion first, then the cascade in the MS style; estado is the shared preset.
  ...zonaCases(),
  // R-REF-6 / R-REF-7 / R-REF-8 / R-REF-9 correlativos (S-MOCK-20, S-MOCK-21, S-REF-14, S-REF-15, S-REF-16).
  ...correlativoCases(),
];

function correlativoCases(): CatalogCase[] {
  const slug = 'correlativos';
  const as = (empresaId = '1') => ({ userId: '7', empresaId });
  const text = (modo: string, label: string) => `Para ${modo} un Correlativo, debes especificar ${label}.`;
  const body = (over: Record<string, unknown> = {}) => ({ id_tipo_doc: '01', serie: 'F009', correlativo: '1', estado: 'A', id_localidad: '1', id_punto_venta: '1', ...over });
  const create = (over: Record<string, unknown>, expect: Outcome, deviation = false): CatalogCase => ({ name: '', slug, ctx: as(), deviation, steps: [{ op: 'create', body: body(over) }], expect });
  const update = (id: string, over: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: '', slug, ctx: as(), steps: [{ op: 'update', id, body: over }], expect });
  const row = (name: string, c: CatalogCase): CatalogCase => ({ ...c, name: `${slug} ${name}` });
  const dup: Outcome = { status: 409, code: 'DUPLICATE', fields: ['serie'], messages: [CORRELATIVO_DUPLICATE] };
  return [
    row('desktop order: an empty body fails first on the tipo de documento', { name: '', slug, ctx: as(), steps: [{ op: 'create', body: {} }], expect: invalid(['id_tipo_doc'], [text('agregar', 'su Tipo de Documento')]) }),
    row('then the serie', create({ serie: ' ' }, invalid(['serie'], [text('agregar', 'su Serie')]))),
    row('then the correlativo', create({ correlativo: '' }, invalid(['correlativo'], [text('agregar', 'su Correlativo')]))),
    row('then the estado', create({ estado: '' }, invalid(['estado'], [text('agregar', 'su Estado')]))),
    row('then the localidad, worded la Localidad', create({ id_localidad: '', id_punto_venta: '' }, invalid(['id_localidad'], [text('agregar', 'la Localidad')]))),
    row('then the punto de venta', create({ id_punto_venta: '' }, invalid(['id_punto_venta'], [text('agregar', 'su Punto de Venta')]))),
    row('UPDATE words the messages with modificar', update('00001', { serie: ' ' }, invalid(['serie'], [text('modificar', 'su Serie')]))),
    row('S-MOCK-21 a duplicate (punto de venta, tipo, serie) is a 409 on serie with the desktop text', create({ serie: 'F001' }, dup)),
    row('S-MOCK-21 the serie is compared after the pad and the case: f1 is stored as 00F1', create({ serie: 'f1' }, { ok: true, match: { serie: '00F1' } })),
    row('S-REF-14 the same serie on another punto de venta is accepted', create({ serie: 'F001', id_localidad: '2', id_punto_venta: '2' }, { ok: true, match: { id_punto_venta: '2' } })),
    row('S-REF-14 the same serie under another tipo de documento is accepted', create({ serie: 'F001', id_tipo_doc: '03' }, { ok: true, match: { id_tipo_doc: '03' } })),
    row('S-MOCK-21 UPDATE keeping its own triple is accepted', update('00001', { correlativo: '0000000200' }, { ok: true, match: { correlativo: '0000000200' } })),
    row('S-REF-14 UPDATE onto the triple of another record is a 409 on serie', update('00004', { id_localidad: '1', id_punto_venta: '1', serie: 'F001' }, dup)),
    row('S-REF-14 CLONE keeping the triple is rejected [DEVIATION: the desktop skips the check on CLONE]', create({ serie: 'F001' }, dup, true)),
    row('S-MOCK-21 a deleted correlativo frees its triple', { name: '', slug, ctx: as(), steps: [{ op: 'remove', id: '00001' }, { op: 'create', body: body({ serie: 'F001' }) }], expect: { ok: true, match: { serie: 'F001' } } }),
    row('S-MOCK-21 an inactive (estado I) correlativo still holds its triple', create({ id_tipo_doc: '03', serie: 'B001' }, dup)),
    row('S-MOCK-20 a ticket without the authorization number is a 422 on it, with the desktop text', create({ id_tipo_doc: 'TI', serie: 'T009' }, invalid(['nro_autorizacion'], [text('agregar', 'su Numero de Autorizacion')]))),
    row('S-REF-15 a ticket with only the authorization number fails on codigo_maquina, after a passing unique', create({ id_tipo_doc: 'TI', serie: 'T009', nro_autorizacion: 'a1' }, invalid(['codigo_maquina'], [text('agregar', 'su Codigo de Maquina')]))),
    row('S-REF-15 the duplicate is reported before the ticket fields', create({ id_tipo_doc: 'TI', serie: 'T001' }, dup)),
    row('S-REF-15 a ticket with both fields stores them uppercased', create({ id_tipo_doc: 'TI', serie: 'T009', nro_autorizacion: 'a1', codigo_maquina: 'mq9' }, { ok: true, match: { nro_autorizacion: 'A1', codigo_maquina: 'MQ9' } })),
    row('S-MOCK-20 another tipo stores both ticket fields as empty strings even when typed', create({ nro_autorizacion: 'a1', codigo_maquina: 'mq9' }, { ok: true, match: { nro_autorizacion: '', codigo_maquina: '' } })),
    row('R-CRUD-13 the UI sends null for the hidden fields: stored as empty strings', create({ nro_autorizacion: null, codigo_maquina: null }, { ok: true, match: { nro_autorizacion: '', codigo_maquina: '' } })),
    row('S-REF-15 UPDATE from ticket to another tipo empties the ticket fields', update('00002', { id_tipo_doc: '01', serie: 'T001' }, { ok: true, match: { id_tipo_doc: '01', nro_autorizacion: '', codigo_maquina: '' } })),
    row('S-REF-16 serie 1 is stored as 0001', create({ serie: '1' }, { ok: true, match: { serie: '0001' } })),
    row('S-REF-16 a fifth character in the serie is a 422 on serie', create({ serie: 'abcde' }, invalid(['serie']))),
    row('S-REF-16 correlativo 25 is stored as 0000000025', create({ correlativo: '25' }, { ok: true, match: { correlativo: '0000000025' } })),
    row('S-REF-16 an 11-digit correlativo is a 422 on correlativo', create({ correlativo: '12345678901' }, invalid(['correlativo']))),
    row('S-REF-16 a correlativo with letters is a 422 on correlativo', create({ correlativo: 'abc' }, invalid(['correlativo']))),
    row('S-REF-16 the constants and linea_impresion 12 (imprime defaults to Sí) are stored', create({}, { ok: true, match: { imprime: 'S', num_inicial: '0000000001', num_final: '9999999999', flag_cond_pago: 'N', linea_impresion: 12 } })),
    row('S-REF-16 imprime No stores linea_impresion 0', create({ imprime: 'N' }, { ok: true, match: { imprime: 'N', linea_impresion: 0, num_final: '9999999999' } })),
    row('S-REF-16 UPDATE re-derives linea_impresion', update('00001', { imprime: 'N' }, { ok: true, match: { linea_impresion: 0, num_inicial: '0000000001' } })),
    row('S-REF-16 the constants cannot be sent in the body', create({ num_inicial: '5', num_final: '6', flag_cond_pago: 'S', linea_impresion: 99 }, { ok: true, match: { num_inicial: '0000000001', num_final: '9999999999', flag_cond_pago: 'N', linea_impresion: 12 } })),
    row('R-MOCK-12 a punto de venta of another localidad is a 422 on id_punto_venta', create({ id_localidad: '2', id_punto_venta: '1' }, invalid(['id_punto_venta'], ['id_punto_venta does not belong to id_localidad']))),
    row('R-REF-6 a localidad of another empresa is a 422 on id_localidad (the where is the session empresa)', create({ id_localidad: '3', id_punto_venta: '3' }, invalid(['id_localidad']))),
    row('S-MOCK-28 get joins the tipo, localidad and punto de venta names and labels the estado', { name: '', slug, steps: [{ op: 'get', id: '00001' }], expect: { ok: true, match: { tipo_documento: 'FACTURA', localidad: 'LOCAL CENTRAL', punto_venta: 'TIENDA CENTRAL', estado_label: 'Activo' } } }),
    row('R-REF-6 the list is tenant-wide and needs no session header', { name: '', slug, steps: [{ op: 'list' }], expect: { ok: true, total: 4 } }),
  ];
}

function almacenCases(): CatalogCase[] {
  const slug = 'almacenes';
  const as = (empresaId: string) => ({ userId: '7', empresaId });
  const text = (modo: string, label: string) => `Para ${modo} un Almacen, debes especificar su ${label}.`;
  const body = (over: Record<string, unknown> = {}) => ({ id_localidad: '1', id_punto_venta: '1', descripcion: 'caja', direccion: 'av. uno', id_ubigeo: '150101', ...over });
  const create = (over: Record<string, unknown>, expect: Outcome, empresaId = '1'): CatalogCase => ({ name: '', slug, ctx: as(empresaId), steps: [{ op: 'create', body: body(over) }], expect });
  const row = (name: string, c: CatalogCase): CatalogCase => ({ ...c, name: `${slug} ${name}` });
  return [
    row('S-REF-13 a blank form fails first on id_localidad with the desktop text', { name: '', slug, ctx: as('1'), steps: [{ op: 'create', body: {} }], expect: invalid(['id_localidad'], [text('agregar', 'Localidad')]) }),
    row('S-REF-13 a localidad alone fails next on the punto de venta', create({ id_punto_venta: '' }, invalid(['id_punto_venta'], [text('agregar', 'Punto de Venta')]))),
    row('S-REF-13 then the descripcion, with its accent', create({ descripcion: ' ' }, invalid(['descripcion'], [text('agregar', 'Descripción')]))),
    row('S-REF-13 then the direccion', create({ direccion: ' ' }, invalid(['direccion'], [text('agregar', 'Dirección')]))),
    row('S-REF-13 the cascade without a distrito says su Distrito', create({ id_ubigeo: '' }, invalid(['id_ubigeo'], [text('agregar', 'Distrito')]))),
    row('S-REF-13 UPDATE words the messages with modificar', { name: '', slug, ctx: as('1'), steps: [{ op: 'update', id: '001', body: { descripcion: ' ' } }], expect: invalid(['descripcion'], [text('modificar', 'Descripción')]) }),
    row('S-MOCK-24 a punto de venta of another localidad is a 422 on id_punto_venta', create({ id_localidad: '1', id_punto_venta: '2' }, invalid(['id_punto_venta'], ['id_punto_venta does not belong to id_localidad']))),
    row('S-MOCK-24 a punto de venta of its own localidad is accepted', create({ id_localidad: '2', id_punto_venta: '2' }, { ok: true, match: { id_almacen: '005', punto_venta: 'TIENDA MIRAFLORES', localidad: 'LOCAL ATE' } })),
    row('S-MOCK-24 changing the localidad on UPDATE re-checks the punto de venta', { name: '', slug, ctx: as('1'), steps: [{ op: 'update', id: '001', body: { id_localidad: '2' } }], expect: invalid(['id_punto_venta']) }),
    row('R-REF-6 a localidad of another empresa is a 422 on id_localidad (the where is the session empresa)', create({ id_localidad: '3', id_punto_venta: '3' }, invalid(['id_localidad']))),
    row('R-REF-6 the same localidad is accepted under empresa 2', create({ id_localidad: '3', id_punto_venta: '3' }, { ok: true, match: { id_empresa: '2', localidad: 'ALMACEN CALLAO', id_usuario: 7 } }, '2')),
    row('R-REF-6 the three booleans default to false', create({}, { ok: true, match: { direccionamiento: false, habilita_despacho: false, habilita_venta: false } })),
    row('R-REF-6 the booleans are stored as sent', create({ direccionamiento: true, habilita_despacho: true, habilita_venta: true }, { ok: true, match: { direccionamiento: true, habilita_despacho: true, habilita_venta: true } })),
    row('R-REF-6 a boolean must be a boolean', create({ habilita_venta: 'S' }, invalid(['habilita_venta']))),
    row('R-REF-6 a ubigeo that is not a distrito is a 422 on id_ubigeo', create({ id_ubigeo: '15' }, invalid(['id_ubigeo']))),
    row('S-MOCK-28 get joins the localidad, punto de venta and ubigeo names', { name: '', slug, ctx: as('1'), steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { localidad: 'LOCAL CENTRAL', punto_venta: 'TIENDA CENTRAL', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LIMA' } } }),
    row('S-MOCK-30 the localidad options carry the session empresa through the where: empresa 1', { name: '', slug: 'localidades', ctx: as('1'), steps: [{ op: 'options', filters: { id_empresa: '$session.empresa' } }], expect: { ok: true, items: [{ id: '1', name: 'LOCAL CENTRAL' }, { id: '2', name: 'LOCAL ATE' }] } }),
    row('S-MOCK-30 the localidad options carry the session empresa through the where: empresa 2', { name: '', slug: 'localidades', ctx: as('2'), steps: [{ op: 'options', filters: { id_empresa: '$session.empresa' } }], expect: { ok: true, items: [{ id: '3', name: 'ALMACEN CALLAO' }, { id: '4', name: 'SUCURSAL CUSCO' }] } }),
  ];
}

function zonaCases(): CatalogCase[] {
  const slug = 'zonas';
  const text = (modo: string, what: string) => `Para ${modo} una Zona, debes ${what}.`;
  const create = (body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: '', slug, ctx: WRITER, steps: [{ op: 'create', body }], expect });
  const row = (name: string, c: CatalogCase): CatalogCase => ({ ...c, name: `${slug} ${name}` });
  return [
    row('S-REF-33 descripcion first: the desktop M1 sentence', create({}, invalid(['descripcion'], [text('agregar', 'especificar su Descripcion')]))),
    row('S-REF-33 a descripcion and no distrito says Seleccionar un Distrito (the server only sees the leaf)', create({ descripcion: 'norte' }, invalid(['id_ubigeo'], [text('agregar', 'Seleccionar un Distrito')]))),
    row('S-REF-33 UPDATE words it with modificar', { name: '', slug, ctx: WRITER, steps: [{ op: 'update', id: '1', body: { id_ubigeo: '' } }], expect: invalid(['id_ubigeo'], [text('modificar', 'Seleccionar un Distrito')]) }),
    row('R-REF-6 a ubigeo that is not a distrito is a 422 on id_ubigeo', create({ descripcion: 'norte', id_ubigeo: '1501' }, invalid(['id_ubigeo']))),
    row('S-REF-7 estado is true when the body omits it, and the id is the next int', create({ descripcion: 'norte', id_ubigeo: '150101' }, { ok: true, match: { id_zona: '5', descripcion: 'NORTE', estado: true, id_usuario: 7 } })),
    row('S-REF-7 estado can be switched off on UPDATE and the row stays listed', { name: '', slug, ctx: WRITER, steps: [{ op: 'update', id: '1', body: { descripcion: 'LIMA CENTRO', id_ubigeo: '150101', estado: false } }, { op: 'list' }], expect: { ok: true, total: 3 } }),
    row('S-REF-7 an estado-false row is listed and keeps its stored estado', { name: '', slug, steps: [{ op: 'get', id: '3' }], expect: { ok: true, match: { estado: false, activo: true } } }),
    row('S-REF-7 estado must be a boolean', create({ descripcion: 'norte', id_ubigeo: '150101', estado: 'A' }, invalid(['estado']))),
    row('S-MOCK-28 get joins the departamento, provincia and distrito names', { name: '', slug, steps: [{ op: 'get', id: '2' }], expect: { ok: true, match: { departamento: 'LIMA', provincia: 'LIMA', distrito: 'ATE' } } }),
    row('R-REF-6 the list is tenant-wide and needs no empresa header', { name: '', slug, ctx: { userId: '7' }, steps: [{ op: 'list' }], expect: { ok: true, total: 3 } }),
  ];
}

function tipoCambioCases(): CatalogCase[] {
  const slug = 'tipos-cambio';
  const as = (empresaId: string) => ({ userId: '7', empresaId });
  const body = (over: Record<string, unknown> = {}) => ({ fecha: FREE_DATE, id_moneda: '00004', ...AMOUNTS, ...over });
  const create = (over: Record<string, unknown>, expect: Outcome, empresaId = '1', deviation = false): Omit<CatalogCase, 'name'> => ({ slug, ctx: as(empresaId), deviation, steps: [{ op: 'create', body: body(over) }], expect });
  const update = (id: string, over: Record<string, unknown>, expect: Outcome): Omit<CatalogCase, 'name'> => ({ slug, ctx: as('1'), steps: [{ op: 'update', id, body: over }], expect });
  const dup: Outcome = { status: 409, code: 'DUPLICATE', fields: ['fecha'], messages: [DUPLICATE_MSG] };
  const row = (name: string, c: Omit<CatalogCase, 'name'>): CatalogCase => ({ ...c, name: `${slug} ${name}` });
  return [
    row('S-MOCK-22 a duplicate (empresa, fecha, moneda) under empresa 1 is a 409 on fecha with the desktop text', create({ fecha: '2026-01-15' }, dup)),
    row('S-MOCK-22 the same date and moneda under empresa 2 is accepted', create({ fecha: '2026-01-15' }, { ok: true, match: { id_empresa: '2', fecha: '2026-01-15' } }, '2')),
    row('S-REF-18 the next date is accepted', create({ fecha: '2026-01-18' }, { ok: true })),
    row('S-REF-18 the same date with another moneda is accepted: uniqueness is keyed on the moneda [DEVIATION]', create({ fecha: '2026-01-15', id_moneda: '00005' }, { ok: true, match: { moneda: 'EURO' } }, '1', true)),
    row('S-REG-10 a deleted tipo de cambio frees its key', create({ fecha: '2026-01-10' }, { ok: true })),
    row('S-REF-18 UPDATE keeping its own date and moneda is accepted', update('001', { monto_compra: 3.8 }, { ok: true, match: { monto_compra: 3.8 } })),
    row('S-REF-18 UPDATE onto the date and moneda of another record is a 409 on fecha', update('002', { fecha: '2026-01-15' }, dup)),
    row('S-REF-19 an empty date says the invalid-date message first', create({ fecha: ' ', id_moneda: '', monto_compra: 0 }, invalid(['fecha'], [DATE_MSG]))),
    row('S-REF-19 a date that does not exist says the invalid-date message', create({ fecha: '2026-02-31' }, invalid(['fecha'], [DATE_MSG]))),
    row('S-MOCK-19 a date outside the ISO format is a 422 on fecha', create({ fecha: '31/01/2026' }, invalid(['fecha'], [DATE_MSG]))),
    row('R-REF-7 a blank moneda says su Moneda (M1), after the date', create({ id_moneda: '' }, invalid(['id_moneda'], ['Para agregar un Tipo de Cambio, debes especificar su Moneda.']))),
    row('S-REF-19 an omitted moneda is DOLAR AMERICANO, an omitted date is today', { slug, ctx: as('1'), steps: [{ op: 'create', body: AMOUNTS }], expect: { ok: true, match: { id_moneda: '00004', moneda: 'DOLAR AMERICANO', fecha: todayIso() } } }),
    row('S-REF-19 a body with no amounts fails on the first one: the 0.0 default is not a positive amount', { slug, ctx: as('1'), steps: [{ op: 'create', body: {} }], expect: invalid(['monto_compra'], [montoText('agregar', 'Monto de Compra')]) }),
    row('S-REF-19 monto_compra 0 says su Monto de Compra', create({ monto_compra: 0 }, invalid(['monto_compra'], [montoText('agregar', 'Monto de Compra')]))),
    row('S-MOCK-19 monto_venta 0 is a 422 on monto_venta with the desktop text (monto de Venta)', create({ monto_venta: 0 }, invalid(['monto_venta'], [montoText('agregar', 'monto de Venta')]))),
    row('S-MOCK-19 monto_venta -1 is a 422 on monto_venta', create({ monto_venta: -1 }, invalid(['monto_venta'], [montoText('agregar', 'monto de Venta')]))),
    row('R-REF-7 monto_comercial 0 says su Monto Comercial', create({ monto_comercial: 0 }, invalid(['monto_comercial'], [montoText('agregar', 'Monto Comercial')]))),
    row('R-REF-7 monto_especial 0 says su Monto Especial, not Comercial [DEVIATION]', create({ monto_especial: 0 }, invalid(['monto_especial'], [montoText('agregar', 'Monto Especial')]), '1', true)),
    row('R-REF-7 the amounts are checked in order: compra before venta', create({ monto_compra: 0, monto_venta: 0 }, invalid(['monto_compra']))),
    row('R-REF-7 the duplicate is reported before a zero amount', create({ fecha: '2026-01-15', monto_compra: 0 }, dup)),
    row('R-REF-7 UPDATE words the amount text with modificar', update('001', { monto_compra: 0 }, invalid(['monto_compra'], [montoText('modificar', 'Monto de Compra')]))),
    row('S-CRUD-25 an amount with letters is a 422 on it', create({ monto_compra: 'abc' }, invalid(['monto_compra']))),
    row('S-CRUD-25 the amounts are stored as sent, with no rounding', create({ monto_compra: 3.456789, monto_venta: '3.1' }, { ok: true, match: { monto_compra: 3.456789 } })),
    row('S-MOCK-28 get joins the moneda name', { slug, ctx: as('1'), steps: [{ op: 'get', id: '001' }], expect: { ok: true, match: { id_moneda: '00004', moneda: 'DOLAR AMERICANO', monto_compra: 3.71 } } }),
    row('S-MOCK-23 a retired moneda is a 422 on id_moneda', create({ id_moneda: '00009' }, invalid(['id_moneda']))),
    row('R-REF-6 the list is tenant-wide: both empresas show', { slug, ctx: as('1'), steps: [{ op: 'list' }], expect: { ok: true, total: 3 } }),
  ];
}

/** An entry that stamps or scopes by the empresa, or whose select asks for the localidades of the session empresa (the Correlativo). */
const needsEmpresa = (entry: any) => usesEmpresa(entry) || entry.fields.some((f: any) => f.source?.where && Object.values(f.source.where).includes('$session.empresa'));
/** A case of an empresa catalog acts in the session empresa unless it names its own (an empty one is a missing header). */
const inSessionEmpresa = (c: CatalogCase): CatalogCase =>
  needsEmpresa(REGISTRY.bySlug.get(c.slug)) && c.ctx?.empresaId === undefined ? { ...c, ctx: { ...c.ctx, empresaId: EMPRESA } } : c;
export const REFERENCE_CASES: CatalogCase[] = BASE_CASES.map(inSessionEmpresa);
