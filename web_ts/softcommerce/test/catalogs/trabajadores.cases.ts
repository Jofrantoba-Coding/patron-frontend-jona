import { todayIso } from '../../mock-server/core/dates.js';
import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the master `trabajadores` (`RegisterTrabajador`, R-MST-4, S-MST-6, S-MST-8, S-MST-9, S-REF-43), against the real registry and seeds, on the in-browser
 * mock and the HTTP mock. Seeded trabajadores (the W2 codes, kept as written): 001 JUAN (ADMINISTRATIVO / ADMINISTRADOR, active), 002 MARIA (VENDEDOR / CAJERO,
 * active), 003 CARLOS (ADMINISTRATIVO / ADMINISTRADOR, deactivated), 004 retired (hidden from the list).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7', empresaId: '1' };
const DATE_TEXT = 'La fecha que has especificado no es válida. Compruébala e inténtalo de nuevo.';
const CHAIN = { id_tipo_trabajador: '001', id_tipo_perfil: '1' };
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const VALID = { ...CHAIN, ...NAMES, dni: '12345678' };

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `trabajadores ${name}`, slug: 'trabajadores', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: string, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `trabajadores ${name}`, slug: 'trabajadores', ctx: WRITER, steps: [{ op: 'update', id, body }], expect });

export const TRABAJADOR_CASES: CatalogCase[] = [
  // S-MST-6: the desktop literal messages in the isRegisterValid order, each as the previous is fixed.
  write('S-MST-6 an empty INSERT asks for the tipo first', {}, invalid(['id_tipo_trabajador'], ['Seleccione Tipo Trabajador'])),
  write('S-MST-6 then the perfil', { id_tipo_trabajador: '001' }, invalid(['id_tipo_perfil'], ['Seleccione Trabajador Perfil'])),
  write('S-MST-6 then the apellido paterno', CHAIN, invalid(['ap_paterno'], ['Ingrese Apellido Paterno'])),
  write('S-MST-6 then the apellido materno', { ...CHAIN, ap_paterno: 'perez' }, invalid(['ap_materno'], ['Ingrese Apellido Materno'])),
  write('S-MST-6 then the nombres', { ...CHAIN, ap_paterno: 'perez', ap_materno: 'lopez' }, invalid(['nombres'], ['Ingrese Nombres'])),
  write('S-MST-6 then the dni', { ...CHAIN, ...NAMES }, invalid(['dni'], ['Ingrese Dni'])),
  write('S-MST-6 a blank apellido (spaces only) is blank', { ...CHAIN, ...NAMES, ap_paterno: '  ' }, invalid(['ap_paterno'], ['Ingrese Apellido Paterno'])),
  write('S-MST-6 then an empty date', { ...VALID, fecha_nac: '' }, invalid(['fecha_nac'], [DATE_TEXT])),
  write('S-MST-6 an impossible date says the same', { ...VALID, fecha_nac: '2026-13-45' }, invalid(['fecha_nac'], [DATE_TEXT])),

  // S-MST-7: the perfil belongs to the tipo.
  write('S-MST-7 a perfil of another tipo is a 422 on the perfil', { ...VALID, id_tipo_trabajador: '002' }, invalid(['id_tipo_perfil'])),
  write('S-MST-7 an unknown tipo is a 422 on it', { ...VALID, id_tipo_trabajador: '999' }, invalid(['id_tipo_trabajador'])),

  // The optional fields and their limits (R-MST-4).
  write('R-MST-4 the dni keeps digits only and takes at most 10 (no 8-digit minimum)', { ...VALID, dni: '1234' }, { ok: true, match: { dni: '1234' } }),
  write('R-MST-4 an 11-digit dni is a 422', { ...VALID, dni: '12345678901' }, invalid(['dni'])),
  write('R-MST-4 the names take at most 50', { ...VALID, ap_paterno: 'a'.repeat(51) }, invalid(['ap_paterno'])),
  write('R-MST-4 telefono and celular keep digits only, at most 10', { ...VALID, telefono: '(01) 456-78', celular: '9'.repeat(10) }, { ok: true, match: { telefono: '0145678', celular: '9'.repeat(10) } }),
  write('R-MST-4 an 11-digit celular is a 422', { ...VALID, celular: '9'.repeat(11) }, invalid(['celular'])),
  write('R-MST-4 direccion takes 300 characters, not 301', { ...VALID, direccion: 'a'.repeat(301) }, invalid(['direccion'])),
  write('R-MST-4 email takes 50 characters, not 51', { ...VALID, email: 'a'.repeat(51) }, invalid(['email'])),
  write('R-MST-4 a sexo outside M|F is a 422', { ...VALID, sexo: 'X' }, invalid(['sexo'])),

  // S-MST-8 / S-MST-9: the derived nombre, the defaults and the stored columns.
  write('S-MST-8 nombre is composed paterno materno nombres, uppercase [DEVIATION from the assumed order]', VALID, { ok: true, match: { nombre: 'PEREZ LOPEZ ANA', ap_paterno: 'PEREZ', ap_materno: 'LOPEZ', nombres: 'ANA' } }, true),
  write('S-MST-8 a body nombre is ignored: the server owns it', { ...VALID, nombre: 'OTRO' }, { ok: true, match: { nombre: 'PEREZ LOPEZ ANA' } }),
  write('S-MST-9 sexo is M and fecha nac is today when the body leaves them out', VALID, { ok: true, match: { sexo: 'M', sexo_label: 'Masculino', fecha_nac: todayIso() } }),
  write('RegisterTrabajador the code is padded to three like the W2 seed codes [DEVIATION from the five of PanelTFTrabajador] and the tipo anexo is the hidden constant', { ...VALID, id_tipo_anexo: '1' }, { ok: true, match: { id_trabajador: '005', id_tipo_anexo: '9', activo: true } }),
  write('RegisterTrabajador mantTrabajador stamps the session user and empresa, never the body', { ...VALID, id_usuario: '9', id_empresa: '9' }, { ok: true, match: { id_usuario: 7, id_empresa: '1' } }),
  write('R-ACT-5 estado is derived: a POST ignores the body estado and the new trabajador is active', { ...VALID, estado: false }, { ok: true, match: { estado: true } }),
  write('R-REG-8 the create joins the tipo de trabajador and the perfil', VALID, { ok: true, match: { tipo_trabajador: 'ADMINISTRATIVO', perfil: 'ADMINISTRADOR' } }),
  { name: 'trabajadores S-MOCK-36 a write without the user header is a 400', slug: 'trabajadores', ctx: {}, steps: [{ op: 'create', body: VALID }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },
  {
    name: 'trabajadores S-MST-8 the created trabajador is listed by the lookup with its derived nombre', slug: 'trabajadores', ctx: WRITER,
    steps: [{ op: 'create', body: VALID }, { op: 'options' }],
    expect: { ok: true, items: [{ id: '001', name: 'JUAN PEREZ LOPEZ' }, { id: '002', name: 'MARIA GARCIA RAMOS' }, { id: '003', name: 'CARLOS TORRES DIAZ' }, { id: '005', name: 'PEREZ LOPEZ ANA' }] },
  },

  // UPDATE recomposes the nombre and does not write the estado (S-ANX-14).
  update('S-MST-8 UPDATE recomposes the nombre from the parts', '001', { nombres: 'juan carlos' }, { ok: true, match: { nombre: 'PEREZ LOPEZ JUAN CARLOS' } }),
  update('R-MST-4 UPDATE keeps the messages: a blank dni is still Ingrese Dni', '001', { dni: '' }, invalid(['dni'], ['Ingrese Dni'])),
  update('S-ANX-14 a PUT carrying estado false keeps the trabajador active', '001', { estado: false }, { ok: true, match: { estado: true } }),
  update('S-ACT-8 a PUT carrying estado true does not activate a deactivated trabajador', '003', { estado: true }, { ok: true, match: { estado: false } }),

  // Modes and the list (R-MST-1).
  { name: 'trabajadores R-MST-1 DELETE answers 405 MODE_NOT_SUPPORTED', slug: 'trabajadores', ctx: WRITER, steps: [{ op: 'remove', id: '001' }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'trabajadores R-MST-1 a refused DELETE leaves the trabajador in the list', slug: 'trabajadores', ctx: WRITER, steps: [{ op: 'remove', id: '001' }, { op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'trabajadores S-MOCK-40 an unknown trabajador is a 404', slug: 'trabajadores', ctx: WRITER, steps: [{ op: 'get', id: '999' }], expect: { status: 404, code: 'NOT_FOUND' } },
  { name: 'trabajadores R-REG-8 get joins the tipo and the perfil', slug: 'trabajadores', steps: [{ op: 'get', id: '002' }], expect: { ok: true, match: { tipo_trabajador: 'VENDEDOR', perfil: 'CAJERO', estado: true } } },
];
