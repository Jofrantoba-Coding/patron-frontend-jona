import type { CatalogCase, Outcome } from './cases';

/**
 * R-REF-5 empresa and R-REF-6 punto-venta (W2-8 8.4): both entries write the storage sections of the W1 `empresas` and
 * `puntosVenta`, over the demo seed of those sections. The same rows run against the in-browser mock and the HTTP mock.
 */
const WRITER = { userId: '7' };
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const MODE_NOT_SUPPORTED: Outcome = { status: 405, code: 'MODE_NOT_SUPPORTED' };

const empresaText = (modo: string, label: string) => `Para ${modo} una Empresa, debes especificar su ${label}.`;
/** An empresa body that passes every rule; each case overrides what it tests. */
const empresa = (over: Record<string, unknown> = {}) => ({ name: 'comercial demo', direccion: 'av. arequipa 1000', ruc: '20123456789', ...over });
const update = (id: string, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({
  name: '', slug: 'empresa', ctx: WRITER, steps: [{ op: 'update', id, body }], expect,
});

const pvText = (modo: string, label: string) => `Para ${modo} un Punto de Venta, debes especificar su ${label}.`;
const pv = (over: Record<string, unknown> = {}) => ({
  id_empresa: '1', id_localidad: '1', name: 'caja uno', direccion: 'av. uno 100', telefono: '014445555', id_ubigeo: '150101', ...over,
});
const createPv = (body: Record<string, unknown>, expect: Outcome, deviation = false): CatalogCase => ({
  name: '', slug: 'punto-venta', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect,
});
const named = (name: string, c: CatalogCase): CatalogCase => ({ ...c, name });

export const W1_SECTION_CASES: CatalogCase[] = [
  // empresa: S-REF-10, S-REF-4, S-REF-11, S-MOCK-32, R-REG-10
  named('empresa S-REF-10 a 10-digit ruc says the desktop RUC text', update('1', empresa({ ruc: '2012345678' }), invalid(['ruc'], [empresaText('modificar', 'RUC')]))),
  named('empresa S-REF-10 an 11-digit ruc is accepted and stored', update('1', empresa({ ruc: '20111111111' }), { ok: true, match: { ruc: '20111111111' } })),
  named('empresa S-REF-10 a 12-digit ruc is a 422 on ruc', update('1', empresa({ ruc: '201234567890' }), invalid(['ruc']))),
  named('empresa S-REF-10 a blank ruc says the same text', update('1', empresa({ ruc: ' ' }), invalid(['ruc'], [empresaText('modificar', 'RUC')]))),
  named('empresa S-REF-10 letters in the ruc are dropped before the length is judged', update('1', empresa({ ruc: '2012x3456789' }), { ok: true, match: { ruc: '20123456789' } })),
  named('empresa the nombre is checked first and says su Nombre', update('1', empresa({ name: ' ', direccion: ' ', ruc: '' }), invalid(['name'], [empresaText('modificar', 'Nombre')]))),
  named('empresa the direccion keeps the desktop spelling without accent', update('1', empresa({ direccion: ' ' }), invalid(['direccion'], [empresaText('modificar', 'Direccion')]))),
  named('empresa S-REF-3 name rejects 181 characters', update('1', empresa({ name: 'n'.repeat(181) }), invalid(['name']))),
  named('empresa S-REF-3 name accepts 180 characters', update('1', empresa({ name: 'n'.repeat(180) }), { ok: true })),
  named('empresa S-REF-4 name, representante and direccion_comercial are uppercased', update('1', empresa({ name: ' nuevo ', representante: 'juan perez', direccion_comercial: 'jr. lima 5' }), { ok: true, match: { name: 'NUEVO', representante: 'JUAN PEREZ', direccion_comercial: 'JR. LIMA 5' } })),
  named('empresa S-REF-4 website and correo are lowercased', update('1', empresa({ website: 'WWW.Demo.COM', correo: 'Info@Demo.COM' }), { ok: true, match: { website: 'www.demo.com', correo: 'info@demo.com' } })),
  named('empresa S-REF-3 website over 255 is a 422', update('1', empresa({ website: 'w'.repeat(256) }), invalid(['website']))),
  named('empresa S-REF-3 correo over 200 is a 422', update('1', empresa({ correo: 'c'.repeat(201) }), invalid(['correo']))),
  named('empresa the telefono is free text', update('1', empresa({ telefono: 'anexo 12 (lima) 014445555' }), { ok: true, match: { telefono: 'anexo 12 (lima) 014445555' } })),
  named('empresa flag_percepcion is a boolean and is stored', update('1', empresa({ flag_percepcion: true }), { ok: true, match: { flag_percepcion: true } })),
  named('empresa flag_percepcion must be a boolean', update('1', empresa({ flag_percepcion: 'S' }), invalid(['flag_percepcion']))),
  named('empresa the ubigeo cascade is optional', update('1', empresa({ id_ubigeo: '' }), { ok: true })),
  named('empresa a ubigeo that is not a distrito is a 422 on id_ubigeo', update('1', empresa({ id_ubigeo: '15' }), invalid(['id_ubigeo']))),
  named('empresa a distrito is stored', update('1', empresa({ id_ubigeo: '150101' }), { ok: true, match: { id_ubigeo: '150101' } })),
  named('empresa the write stamps the session user, not the body', update('1', empresa({ id_usuario: '9' }), { ok: true, match: { id_usuario: 7 } })),
  named('empresa a write without the user header is a 400', { ...update('1', empresa(), { status: 400, code: 'MISSING_SESSION_CONTEXT' }), ctx: {} }),
  named('empresa an unknown id is a 404', update('99', empresa(), { status: 404, code: 'NOT_FOUND' })),
  named('empresa S-REF-11 / S-MOCK-32 create answers 405 MODE_NOT_SUPPORTED', { name: '', slug: 'empresa', ctx: WRITER, steps: [{ op: 'create', body: empresa() }], expect: MODE_NOT_SUPPORTED }),
  named('empresa S-REF-11 remove answers 405 MODE_NOT_SUPPORTED', { name: '', slug: 'empresa', ctx: WRITER, steps: [{ op: 'remove', id: '1' }], expect: MODE_NOT_SUPPORTED }),
  named('empresa S-REF-11 the empresa stays after a refused remove', { name: '', slug: 'empresa', ctx: WRITER, steps: [{ op: 'remove', id: '1' }, { op: 'list' }], expect: { ok: true, total: 2 } }),
  named('empresa lists the two empresas of the demo tenant', { name: '', slug: 'empresa', steps: [{ op: 'list' }], expect: { ok: true, total: 2 } }),
  named('empresa the options are the empresas by name', { name: '', slug: 'empresa', steps: [{ op: 'options' }], expect: { ok: true, items: [{ id: '1', name: 'COMERCIAL DEMO SAC' }, { id: '2', name: 'DISTRIBUIDORA DEMO SRL' }] } }),

  // punto-venta: S-REF-32, S-MOCK-24 chain, S-MOCK-30, R-REF-6
  named('punto-venta S-MOCK-25 creates the next W1 id, uppercased, stamping the session user', createPv(pv(), { ok: true, match: { id: '4', name: 'CAJA UNO', direccion: 'AV. UNO 100', id_usuario: 7, empresa: 'COMERCIAL DEMO SAC', localidad: 'LOCAL CENTRAL', departamento: 'LIMA' } })),
  named('punto-venta R-REF-9 the estado A of the desktop insert is stored on create (a constant, not a body value)', createPv(pv({ estado: 'I' }), { ok: true, match: { estado: 'A' } })),
  named('punto-venta the empresa message names the Punto de Venta, not the Localidad [DEVIATION]', createPv({}, invalid(['id_empresa'], [pvText('agregar', 'Empresa')]), true)),
  named('punto-venta then the localidad', createPv(pv({ id_localidad: '' }), invalid(['id_localidad'], [pvText('agregar', 'Localidad')]))),
  named('punto-venta then the descripcion with its accent', createPv(pv({ name: ' ' }), invalid(['name'], [pvText('agregar', 'Descripción')]))),
  named('punto-venta then the direccion', createPv(pv({ direccion: ' ' }), invalid(['direccion'], [pvText('agregar', 'Dirección')]))),
  named('punto-venta S-REF-32 a blank telefono says su Telefono', createPv(pv({ telefono: ' ' }), invalid(['telefono'], [pvText('agregar', 'Telefono')]))),
  named('punto-venta S-REF-32 a long telefono is accepted (no max)', createPv(pv({ telefono: '9'.repeat(60) }), { ok: true, match: { telefono: '9'.repeat(60) } })),
  named('punto-venta the distrito is required last', createPv(pv({ id_ubigeo: '' }), invalid(['id_ubigeo'], [pvText('agregar', 'Distrito')]))),
  named('punto-venta UPDATE words the messages with modificar', { name: '', slug: 'punto-venta', ctx: WRITER, steps: [{ op: 'update', id: '1', body: { name: ' ' } }], expect: invalid(['name'], [pvText('modificar', 'Descripción')]) }),
  named('punto-venta S-REF-3 name rejects 101 characters', createPv(pv({ name: 'n'.repeat(101) }), invalid(['name']))),
  named('punto-venta R-MOCK-12 an unknown empresa is a 422 on id_empresa', createPv(pv({ id_empresa: '99' }), invalid(['id_empresa']))),
  named('punto-venta S-REF-32 a localidad of another empresa is a 422 on id_localidad', createPv(pv({ id_empresa: '1', id_localidad: '3' }), invalid(['id_localidad'], ['id_localidad does not belong to id_empresa']))),
  named('punto-venta S-MOCK-23 an inactive localidad is a 422 on id_localidad', createPv(pv({ id_localidad: '5' }), invalid(['id_localidad']))),
  named('punto-venta a localidad of its own empresa 2 is accepted', createPv(pv({ id_empresa: '2', id_localidad: '3' }), { ok: true, match: { id_empresa: '2', localidad: 'ALMACEN CALLAO' } })),
  named('punto-venta S-REF-32 the localidades of empresa 1 are its own two', { name: '', slug: 'localidades', steps: [{ op: 'options', filters: { id_empresa: '1' } }], expect: { ok: true, items: [{ id: '1', name: 'LOCAL CENTRAL' }, { id: '2', name: 'LOCAL ATE' }] } }),
  named('punto-venta S-MOCK-30 options by localidad are exact', { name: '', slug: 'punto-venta', steps: [{ op: 'options', filters: { id_localidad: '1' } }], expect: { ok: true, items: [{ id: '1', name: 'TIENDA CENTRAL' }] } }),
  named('punto-venta S-MOCK-30 options by localidad 2', { name: '', slug: 'punto-venta', steps: [{ op: 'options', filters: { id_localidad: '2' } }], expect: { ok: true, items: [{ id: '2', name: 'TIENDA MIRAFLORES' }] } }),
  named('punto-venta S-MOCK-30 options by empresa', { name: '', slug: 'punto-venta', steps: [{ op: 'options', filters: { id_empresa: '2' } }], expect: { ok: true, items: [{ id: '3', name: 'ALMACEN SUR' }] } }),
  named('punto-venta S-MOCK-30 an unknown localidad gives an empty list', { name: '', slug: 'punto-venta', steps: [{ op: 'options', filters: { id_localidad: 'zzz' } }], expect: { ok: true, items: [] } }),
  named('punto-venta get joins the empresa, localidad and the ubigeo names', { name: '', slug: 'punto-venta', steps: [{ op: 'get', id: '1' }], expect: { ok: true, match: { empresa: 'COMERCIAL DEMO SAC', localidad: 'LOCAL CENTRAL', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LIMA' } } }),
  named('punto-venta the generic list keeps substring matching', { name: '', slug: 'punto-venta', steps: [{ op: 'list', filters: { name: 'tienda' } }], expect: { ok: true, total: 2 } }),
  named('punto-venta lists the three puntos de venta of the demo tenant', { name: '', slug: 'punto-venta', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } }),
  named('punto-venta R-MOCK-7 a deleted punto de venta leaves the list', { name: '', slug: 'punto-venta', ctx: WRITER, steps: [{ op: 'remove', id: '3' }, { op: 'list' }], expect: { ok: true, total: 2 } }),
  named('punto-venta a write without the user header is a 400', { ...createPv(pv(), { status: 400, code: 'MISSING_SESSION_CONTEXT' }), ctx: {} }),
];
