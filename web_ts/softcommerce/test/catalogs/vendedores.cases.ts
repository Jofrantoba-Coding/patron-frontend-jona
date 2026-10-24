import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the master `vendedores` (`RegisterVendedor`, R-MST-9, S-MST-18, S-MST-19, S-ANX-1, S-MOCK-44), against the real registry and seeds, on the in-browser
 * mock and the HTTP mock. Seeded vendedores (code padded to ten): 1 JUAN (trabajador 001, active, contado), 2 MARIA (trabajador 002, active after a
 * reingreso, credito), 3 CARLOS (trabajador 003, deactivated), 4 a retired one (hidden from the list).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const sale = (n: number) => String(n).padStart(10, '0');
/** What the register sends after a pick: the trabajador id and the six copied values. */
const VALID = { id_trabajador: '001', nombres: 'juan perez lopez', direccion: 'av lima 123', numero_doc: '40123456', telefono: '4561234', celular: '999111222', id_tipo_doc_iden: '01', id_nacionalidad: '001' };

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `vendedores ${name}`, slug: 'vendedores', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `vendedores ${name}`, slug: 'vendedores', ctx: WRITER, steps: [{ op: 'update', id: sale(id), body }], expect });

export const VENDEDOR_CASES: CatalogCase[] = [
  // S-MST-18: the only check of the desktop is a chosen trabajador, shown on Nombres.
  write('S-MST-18 an empty INSERT says Debe elegir un trabajdor (the desktop spelling) on nombres', {}, invalid(['nombres'], ['Debe elegir un trabajdor'])),
  write('S-MST-18 a blank nombres (spaces) says the same', { ...VALID, nombres: '   ' }, invalid(['nombres'], ['Debe elegir un trabajdor'])),
  write('S-MST-18 the copied values are stored as sent, in capitals where the desktop has a document', VALID, { ok: true, match: { id_trabajador: '001', nombres: 'JUAN PEREZ LOPEZ', direccion: 'AV LIMA 123', numero_doc: '40123456', telefono: '4561234', celular: '999111222', trabajador: 'JUAN PEREZ LOPEZ' } }),
  write('S-MST-18 an unknown trabajador is a 422 on it', { ...VALID, id_trabajador: '999' }, invalid(['id_trabajador'])),

  // S-MST-19: the tipo is the selected one, no entry of the combo is dropped, the comentario is stored.
  write('S-MST-19 INSERT stores the selected tipo, not the hardcoded 01 [DEVIATION]', { ...VALID, id_tipo_doc_iden: '05', numero_doc: '20123456789' }, { ok: true, match: { id_tipo_doc_iden: '05', numero_doc: '20123456789' } }, true),
  write('S-MST-19 the other persona tipo (CE) is selectable too [DEVIATION]', { ...VALID, id_tipo_doc_iden: '04' }, { ok: true, match: { id_tipo_doc_iden: '04' } }, true),
  write('S-MST-19 a tipo that is not for persons is a 422 on it', { ...VALID, id_tipo_doc_iden: '00' }, invalid(['id_tipo_doc_iden'])),
  write('S-MST-19 a blank tipo says the MS sentence with Vendedor', { ...VALID, id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Vendedor, debes Seleccionar un Tipo de Documento.'])),
  write('S-MST-19 the comentario is stored, trimmed, line breaks kept [DEVIATION]', { ...VALID, comentario: '  linea 1\nlinea 2 ' }, { ok: true, match: { comentario: 'linea 1\nlinea 2' } }, true),
  write('S-MST-19 a comentario of 501 characters is a 422', { ...VALID, comentario: 'a'.repeat(501) }, invalid(['comentario'])),
  write('S-MST-19 INSERT opens on Contado, not Credito, PERUANA and DNI: a body that leaves them out gets them', { id_trabajador: '001', nombres: 'juan' }, { ok: true, match: { contado: true, credito: false, id_nacionalidad: '001', id_tipo_doc_iden: '01', nacionalidad: 'PERUANA' } }),
  write('R-MST-9 a DNI takes at most 8 digits, a RUC 11', { ...VALID, numero_doc: '401234567' }, invalid(['numero_doc'])),
  write('R-MST-9 credito and contado are stored as sent', { ...VALID, credito: true, contado: false }, { ok: true, match: { credito: true, contado: false } }),

  // Code, stamp, anexo and estado (R-ANX-9, R-ACT-5).
  write('RegisterVendedor the server issues the next code padded to ten and the tipo anexo is the hidden constant "8"', { ...VALID, id_tipo_anexo: '1' }, { ok: true, match: { id_vendedor: sale(5), id_tipo_anexo: '8', activo: true } }),
  write('RegisterVendedor mantVendedor stamps the session user, never the body', { ...VALID, id_usuario: '9' }, { ok: true, match: { id_usuario: 7 } }),
  write('R-ACT-5 estado is derived: a POST ignores the body estado and the new vendedor is active', { ...VALID, estado: false }, { ok: true, match: { estado: true } }),
  { name: 'vendedores S-MOCK-36 a write without the user header is a 400', slug: 'vendedores', ctx: {}, steps: [{ op: 'create', body: VALID }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },
  update('R-MST-9 UPDATE keeps the stored tipo and the copied values', 1, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '01', nombres: 'JUAN PEREZ LOPEZ', telefono: '5551234' } }),
  update('S-ANX-14 a PUT carrying estado false keeps the vendedor active', 1, { estado: false }, { ok: true, match: { estado: true } }),

  // Modes and the list (R-MST-1): no CLONE is a UI matter, the table lists the active ones.
  { name: 'vendedores R-MST-9 the list hides the retired vendedor', slug: 'vendedores', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'vendedores R-REG-8 get joins the trabajador and the nacionalidad', slug: 'vendedores', steps: [{ op: 'get', id: sale(2) }], expect: { ok: true, match: { trabajador: 'MARIA GARCIA RAMOS', nacionalidad: 'PERUANA', credito: true, contado: false, estado: true } } },
  { name: 'vendedores S-MOCK-40 an unknown vendedor is a 404', slug: 'vendedores', ctx: WRITER, steps: [{ op: 'get', id: sale(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
];
