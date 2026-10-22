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
  'clasif-inventarios': 'un Tipo de Movimiento de Inventario',
  tamanos: 'un Tamano',
  'tipos-anexo': 'un Tipo Anexo',
  'tipos-descuento': 'un Tipo Descuento',
  'condiciones-pago': 'una Condición de Pago',
  'tipos-trabajador': 'un Tipo Trabajador',
  'marcas-vehiculo': 'una Marca Vehiculo',
  turnos: 'un Turno',
};

/** Message style per slug when it is not M1, and the descripcion label phrase when it is not `su Descripcion`. */
const M2 = new Set(['tipos-trabajador', 'marcas-vehiculo', 'turnos']);
const DESCRIPCION: Record<string, string> = { 'condiciones-pago': 'su Descripción' };
/** Reference catalogs with no `descripcion` field (the Turno is its own hora:minuto). */
export const NO_DESCRIPCION = new Set(['turnos']);

/** The desktop sentence for a blank descripcion in `modo` (agregar, modificar, ...). */
export const descripcionText = (slug: string, modo: string) => {
  const label = DESCRIPCION[slug] ?? 'su Descripcion';
  return M2.has(slug) ? `Para ${modo}, debes especificar ${label}.` : `Para ${modo} ${ENTITIES[slug]}, debes especificar ${label}.`;
};

const files = import.meta.glob<Record<string, any[]>>('../../mock-server/data/catalogs/*.json', { eager: true, import: 'default' });
/** Demo seed rows of a catalog file. */
export const seedRows = (seed: string): any[] => files[`../../mock-server/data/catalogs/${seed}.json`]?.demo ?? [];

/** Slugs whose desktop message names the wrong entity or gender; the web port words the real one. */
const DEVIATIONS = new Set(['marcas', 'motivos-traslado', 'tamanos', 'tipos-anexo']);

const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };

/** The reference catalogs of ENTITIES: the generic rows below cover their code and text fields. */
export const referenceEntries = () => REGISTRY.entries.filter((e: any) => e.slug in ENTITIES);

function genericCases(entry: any): CatalogCase[] {
  const { slug, idKey, codeWidth } = entry;
  const config = toCatalogConfig(entry);
  const texts = config.fields.flatMap((f) => (f.kind === 'text' ? [f] : []));
  // A valid body: every required text, every required integer (1), and the first option of every required options field.
  const valid = {
    ...Object.fromEntries(texts.filter((f) => f.required).map((f) => [f.name, 'x'])),
    ...Object.fromEntries(config.fields.filter((f) => f.kind === 'number' && f.required).map((f) => [f.name, '1'])),
    ...Object.fromEntries(entry.fields.filter((f: any) => f.kind === 'options' && f.required).map((f: any) => [f.name, f.options[0].value])),
  };
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

export const REFERENCE_CASES: CatalogCase[] = [
  ...referenceEntries().flatMap(genericCases),
  ...Object.keys(ENTITIES).filter((slug) => !NO_DESCRIPCION.has(slug)).flatMap((slug) => slugCases(slug, DEVIATIONS.has(slug))),
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
];
