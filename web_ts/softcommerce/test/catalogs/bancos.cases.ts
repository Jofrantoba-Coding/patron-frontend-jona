import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the anexo master `bancos` (`RegisterBancoAnexo`, R-MST-1..3, R-ANX-2..5, S-MST-1, S-MST-3, S-MST-4, S-ANX-6, S-ANX-7, S-ANX-14, S-ANX-16),
 * against the real registry and seeds, on the in-browser mock and the HTTP mock. Seeded bancos (code padded to 10):
 * 1 BCP (RUC 2, active), 2 BBVA (RUC 2, active), 3 INTERBANK (RUC 2, three activations, the last active), 4 a natural person with tipo CE and nacionalidad
 * EXTRANJERA whose only activation is closed (estado off), 5 a retired one (hidden from the list).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const RUC_BODY = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' };
const DNI_BODY = { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES };
const bank = (n: number) => String(n).padStart(10, '0');
const text = (field: string) => `Para agregar un Banco, debes especificar su ${field}.`;

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `bancos ${name}`, slug: 'bancos', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `bancos ${name}`, slug: 'bancos', ctx: WRITER, deviation, steps: [{ op: 'update', id: bank(id), body }], expect });

export const BANCO_CASES: CatalogCase[] = [
  // R-MST-2 the identity block, with the real entity in every sentence (S-MST-3).
  write('S-MST-3 a blank tipo says "un Banco", not "un Cliente" [DEVIATION]', { ...RUC_BODY, id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Banco, debes Seleccionar un Tipo de Documento.']), true),
  update('S-MST-3 UPDATE words the tipo sentence with modificar [DEVIATION]', 1, { id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para modificar un Banco, debes Seleccionar un Tipo de Documento.']), true),
  write('R-MST-3 a DNI of 7 digits gives the DNI sentence', { ...DNI_BODY, numero_doc: '1234567' }, invalid(['numero_doc'], ['El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('R-MST-3 the names of a DNI are checked paterno, materno, nombres', { id_tipo_doc_iden: '01', numero_doc: '12345678' }, invalid(['ap_paterno'], [text('Apellido Paterno')])),
  write('R-MST-3 a blank materno says su Apellido Materno', { ...DNI_BODY, ap_materno: ' ' }, invalid(['ap_materno'], [text('Apellido Materno')])),
  write('R-MST-3 a blank nombres says su Nombre', { ...DNI_BODY, nombres: '' }, invalid(['nombres'], [text('Nombre')])),
  write('R-MST-3 a RUC of 10 digits gives the RUC sentence', { ...RUC_BODY, numero_doc: '2012345678' }, invalid(['numero_doc'], ['El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('R-MST-3 a RUC starting with 3 cannot be stored', { ...RUC_BODY, numero_doc: '30123456789' }, invalid(['numero_doc'], ['EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2'])),
  write('R-MST-3 a RUC starting with 2 needs its razon social: su Descripcion', { ...RUC_BODY, descripcion: ' ' }, invalid(['descripcion'], [text('Descripcion')])),
  write('R-MST-3 a blank nacionalidad says the MS sentence with the real entity', { ...RUC_BODY, id_nacionalidad: '' }, invalid(['id_nacionalidad'], ['Para agregar un Banco, debes Seleccionar una Nacionalidad.'])),
  write('R-MST-2 an unknown tipo is a 422 on it', { ...RUC_BODY, id_tipo_doc_iden: '77' }, invalid(['id_tipo_doc_iden'])),
  write('R-MST-2 a tipo that is not for persons is a 422 on it', { ...RUC_BODY, id_tipo_doc_iden: '00' }, invalid(['id_tipo_doc_iden'])),
  write('R-MST-3 a razon social of 301 characters is a 422', { ...RUC_BODY, descripcion: 'a'.repeat(301) }, invalid(['descripcion'])),
  write('R-MST-2 direccion takes 280 characters, not 281', { ...RUC_BODY, direccion: 'a'.repeat(281) }, invalid(['direccion'])),
  write('R-MST-2 telefono and celular keep digits only, at most 15', { ...RUC_BODY, telefono: '(01) 456-7890', celular: '9'.repeat(15) }, { ok: true, match: { telefono: '014567890', celular: '9'.repeat(15) } }),
  write('R-MST-2 a 16-digit celular is a 422', { ...RUC_BODY, celular: '9'.repeat(16) }, invalid(['celular'])),
  write('R-MST-2 the e-mail is stored in lowercase', { ...RUC_BODY, email: 'Caja@Banco.PE' }, { ok: true, match: { email: 'caja@banco.pe' } }),
  write('R-MST-2 an e-mail of 101 characters is a 422', { ...RUC_BODY, email: 'a'.repeat(101) }, invalid(['email'])),

  // INSERT defaults and the stored flags (R-MST-2, R-ANX-9, S-ANX-16).
  write('RegisterBancoAnexo.newRegister opens on RUC and PERUANA: a body that leaves them out gets them', { numero_doc: '20123456789', descripcion: 'acme sac' }, { ok: true, match: { id_tipo_doc_iden: '05', id_nacionalidad: '001', nacionalidad: 'PERUANA', tipo_doc: 'RUC', sexo: '' } }),
  write('S-ANX-16 the server issues the next code padded to ten', RUC_BODY, { ok: true, match: { id_banco: bank(6), activo: true } }),
  write('R-ANX-9 the tipo anexo is the hidden constant "3", never read from the body', { ...RUC_BODY, id_tipo_anexo: '9' }, { ok: true, match: { id_tipo_anexo: '3' } }),
  write('R-MST-2 a RUC starting with 2 is juridical: flag_tipo_persona J', RUC_BODY, { ok: true, match: { flag_tipo_persona: 'J' } }),
  write('R-MST-2 a RUC starting with 1 composes the razon social and is N', { id_tipo_doc_iden: '05', numero_doc: '10123456789', ...NAMES }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA', flag_tipo_persona: 'N' } }),
  write('R-MST-2 a DNI is a natural person: the razon social is the composition, sexo is kept', { ...DNI_BODY, sexo: 'F' }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA', flag_tipo_persona: 'N', sexo: 'F', sexo_label: 'Femenino' } }),
  write('R-MST-2 sexo belongs to a natural person: a juridical RUC stores it empty', { ...RUC_BODY, sexo: 'F' }, { ok: true, match: { sexo: '' } }),
  write('R-MST-2 a sexo outside M|F is a 422', { ...DNI_BODY, sexo: 'X' }, invalid(['sexo'])),
  write('R-MST-2 any other tipo takes the razon social and at most 11 digits', { id_tipo_doc_iden: '04', numero_doc: '123456789012', descripcion: 'juan' }, invalid(['numero_doc'])),
  write('R-ACT-5 estado is derived: a POST ignores the body estado and the new banco is active', { ...RUC_BODY, estado: false }, { ok: true, match: { estado: true } }),
  { name: 'bancos S-MOCK-26 stamps the session user, not the body', slug: 'bancos', ctx: WRITER, steps: [{ op: 'create', body: { ...RUC_BODY, id_usuario: '9' } }], expect: { ok: true, match: { id_usuario: 7 } } },
  { name: 'bancos S-MOCK-36 a write without the user header is a 400', slug: 'bancos', ctx: {}, steps: [{ op: 'create', body: RUC_BODY }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },

  // UPDATE restores what is stored (S-MST-4) and estado is not writable (S-ANX-14).
  { name: 'bancos S-MST-4 the stored EXTRANJERA and CE are read back, not forced to PERUANA [DEVIATION]', slug: 'bancos', deviation: true, steps: [{ op: 'get', id: bank(4) }], expect: { ok: true, match: { id_tipo_doc_iden: '04', tipo_doc: 'CE', id_nacionalidad: '002', nacionalidad: 'EXTRANJERA' } } },
  update('S-MST-4 UPDATE keeps the stored tipo and nacionalidad when the body carries neither [DEVIATION]', 4, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '04', id_nacionalidad: '002', telefono: '5551234' } }, true),
  update('R-MST-3 UPDATE of a RUC row keeps its razon social', 1, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '05', descripcion: 'BANCO DE CREDITO DEL PERU' } }),
  update('S-ANX-14 a PUT carrying estado false and no deactivation keeps the banco active', 1, { estado: false }, { ok: true, match: { estado: true } }),
  update('S-ACT-8 a PUT carrying estado true does not activate a deactivated banco', 4, { estado: true }, { ok: true, match: { estado: false } }),
  update('R-MST-3 UPDATE words the names sentence with modificar', 4, { id_tipo_doc_iden: '01', numero_doc: '12345678', ap_paterno: 'x', ap_materno: '', nombres: 'y' }, invalid(['ap_materno'], ['Para modificar un Banco, debes especificar su Apellido Materno.'])),

  // The activation rule over the composite body (S-ANX-6, S-ANX-7).
  update('S-ANX-7 a body adding a second active row is a 409 with Banco ya Esta Activado', 1, { children: { activaciones: [{ op: 'I', f_inicio: '2026-03-11', motivo_activacion: 'otro' }] } }, { status: 409, code: 'ACTION_NOT_ALLOWED', messages: [] }),
  update('S-ANX-6 a fecha fin before the start is a 422 on the indexed field', 1, { children: { activaciones: [{ op: 'A', id: '2', estado: 'D', f_fin: '2024-12-31', motivo_desactivacion: 'cierre' }] } }, invalid(['activaciones[0].f_fin'], ['Fecha es menor a fecha inicial'])),
  update('S-ANX-6 the same day is accepted and the banco turns inactive', 1, { children: { activaciones: [{ op: 'A', id: '2', estado: 'D', f_fin: '2025-01-02', motivo_desactivacion: 'cierre' }] } }, { ok: true, match: { estado: false } }),
  update('R-ANX-4 a deactivation without a motivo is a 422 Ingrese Motivo', 1, { children: { activaciones: [{ op: 'A', id: '2', estado: 'D', f_fin: '2026-03-11' }] } }, invalid(['activaciones[0].motivo_desactivacion'], ['Ingrese Motivo'])),
  update('R-ANX-3 a new activation after a deactivation in the same body keeps the banco active', 1, { children: { activaciones: [{ op: 'A', id: '2', estado: 'D', f_fin: '2026-03-11', motivo_desactivacion: 'cierre' }, { op: 'I', f_inicio: '2026-03-12', motivo_activacion: 'reingreso' }] } }, { ok: true, match: { estado: true } }),

  // Modes and the list (S-MST-1, R-MST-1).
  { name: 'bancos S-MST-1 DELETE answers 405 MODE_NOT_SUPPORTED', slug: 'bancos', ctx: WRITER, steps: [{ op: 'remove', id: bank(1) }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'bancos S-MST-1 a refused DELETE leaves the banco in the list', slug: 'bancos', ctx: WRITER, steps: [{ op: 'remove', id: bank(1) }, { op: 'list' }], expect: { ok: true, total: 4 } },
  { name: 'bancos R-MST-3 the list hides the retired banco', slug: 'bancos', steps: [{ op: 'list' }], expect: { ok: true, total: 4 } },
  { name: 'bancos S-MOCK-15 get resolves the retired banco', slug: 'bancos', steps: [{ op: 'get', id: bank(5) }], expect: { ok: true, match: { activo: false } } },
  { name: 'bancos R-REG-8 get joins the tipo abreviatura and the nacionalidad', slug: 'bancos', steps: [{ op: 'get', id: bank(1) }], expect: { ok: true, match: { tipo_doc: 'RUC', nacionalidad: 'PERUANA', estado: true } } },
  { name: 'bancos S-MOCK-40 an unknown banco is a 404', slug: 'bancos', ctx: WRITER, steps: [{ op: 'get', id: bank(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
];
