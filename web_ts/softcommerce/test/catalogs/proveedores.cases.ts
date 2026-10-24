import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the anexo master `proveedores` (`RegisterProveedorNuevo`, R-MST-2, R-MST-13, S-MST-3, S-MST-5, S-MST-26, S-ANX-9..13), against the real registry and seeds, on
 * the in-browser mock and the HTTP mock. Seeded proveedores (code padded to 10): 1 DISTRIBUIDORA ANDINA SAC (RUC 2, active, padron 02 active), 2 a natural person with a
 * RUC 1 (active, padron 04 active), 3 a CE / EXTRANJERA one whose only activation is closed (estado off, padron 03 closed), 4 a retired one (hidden from the list).
 * The padron rows share one id sequence (1 to 3).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
// The 409 carries its sentence as the error message, not as a field detail; the spec file asserts the sentence.
const refused = (): Outcome => ({ status: 409, code: 'ACTION_NOT_ALLOWED' });
const WRITER = { userId: '7' };
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const RUC_BODY = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' };
const DNI_BODY = { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES };
const supplier = (n: number) => String(n).padStart(10, '0');
const text = (field: string) => `Para agregar un Proveedor, debes especificar su ${field}.`;
const padrones = (...ops: Record<string, unknown>[]) => ({ children: { padrones: ops } });
const add = (id_padron: string) => ({ op: 'I', id_padron, f_inicio: '2026-03-11' });

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `proveedores ${name}`, slug: 'proveedores', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `proveedores ${name}`, slug: 'proveedores', ctx: WRITER, deviation, steps: [{ op: 'update', id: supplier(id), body }], expect });

export const PROVEEDOR_CASES: CatalogCase[] = [
  // R-MST-2 the identity block with the real entity in every sentence (S-MST-3).
  write('S-MST-3 a blank tipo says "un Proveedor"', { ...RUC_BODY, id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Proveedor, debes Seleccionar un Tipo de Documento.'])),
  write('S-MST-3 no tipo at all is the same sentence (the form opens with none selected)', { numero_doc: '20123456789', descripcion: 'acme sac' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Proveedor, debes Seleccionar un Tipo de Documento.'])),
  update('S-MST-3 UPDATE words the tipo sentence with modificar', 1, { id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para modificar un Proveedor, debes Seleccionar un Tipo de Documento.'])),
  write('R-MST-2 a DNI of 7 digits gives the DNI sentence', { ...DNI_BODY, numero_doc: '1234567' }, invalid(['numero_doc'], ['El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('R-MST-2 the names of a DNI are checked paterno, materno, nombres', { id_tipo_doc_iden: '01', numero_doc: '12345678' }, invalid(['ap_paterno'], [text('Apellido Paterno')])),
  write('R-MST-2 a RUC of 10 digits gives the RUC sentence', { ...RUC_BODY, numero_doc: '2012345678' }, invalid(['numero_doc'], ['El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('S-MST-2 a RUC starting with 3 cannot be stored', { ...RUC_BODY, numero_doc: '30123456789' }, invalid(['numero_doc'], ['EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2'])),
  write('S-MST-2 a RUC starting with 2 needs its razon social: su Descripcion', { ...RUC_BODY, descripcion: ' ' }, invalid(['descripcion'], [text('Descripcion')])),
  write('R-MST-2 a blank nacionalidad says the MS sentence with the real entity', { ...RUC_BODY, id_nacionalidad: '' }, invalid(['id_nacionalidad'], ['Para agregar un Proveedor, debes Seleccionar una Nacionalidad.'])),
  write('R-MST-2 an e-mail is stored in lowercase', { ...RUC_BODY, email: 'Ventas@Andina.PE' }, { ok: true, match: { email: 'ventas@andina.pe' } }),

  // S-MST-5 the persona flag and the stored constants (R-ANX-9).
  write('S-MST-5 a RUC starting with 2 is juridical: flag_tipo_persona J', RUC_BODY, { ok: true, match: { flag_tipo_persona: 'J' } }),
  write('S-MST-5 a RUC starting with 1 composes the razon social and is N', { id_tipo_doc_iden: '05', numero_doc: '10123456789', ...NAMES }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA', flag_tipo_persona: 'N' } }),
  write('S-MST-5 a DNI is N', DNI_BODY, { ok: true, match: { flag_tipo_persona: 'N', id_tipo_doc_iden: '01' } }),
  write('newRegister opens on PERUANA and sexo M (and no tipo): a body that leaves nacionalidad out gets it', DNI_BODY, { ok: true, match: { id_nacionalidad: '001', nacionalidad: 'PERUANA', sexo: 'M' } }),
  write('S-ANX-16 the server issues the next code padded to ten and the tipo anexo is 1', RUC_BODY, { ok: true, match: { id_proveedor: supplier(5), id_tipo_anexo: '1', activo: true } }),
  write('R-ANX-9 the tipo anexo is the hidden constant "1", never read from the body', { ...RUC_BODY, id_tipo_anexo: '9' }, { ok: true, match: { id_tipo_anexo: '1' } }),
  write('R-ACT-5 estado is derived: a POST ignores the body estado', { ...RUC_BODY, estado: false }, { ok: true, match: { estado: true } }),
  { name: 'proveedores S-MOCK-26 stamps the session user, not the body', slug: 'proveedores', ctx: WRITER, steps: [{ op: 'create', body: { ...RUC_BODY, id_usuario: '9' } }], expect: { ok: true, match: { id_usuario: 7 } } },
  { name: 'proveedores S-MOCK-36 a write without the user header is a 400', slug: 'proveedores', ctx: {}, steps: [{ op: 'create', body: RUC_BODY }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },

  // UPDATE restores what is stored.
  { name: 'proveedores R-MST-2 the stored CE and EXTRANJERA are read back', slug: 'proveedores', steps: [{ op: 'get', id: supplier(3) }], expect: { ok: true, match: { id_tipo_doc_iden: '04', tipo_doc: 'CE', id_nacionalidad: '002', nacionalidad: 'EXTRANJERA' } } },
  update('R-MST-2 UPDATE keeps the stored tipo and nacionalidad when the body carries neither', 3, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '04', id_nacionalidad: '002', telefono: '5551234' } }),
  update('R-MST-2 UPDATE words the names sentence with modificar', 3, { id_tipo_doc_iden: '01', numero_doc: '12345678', ap_paterno: 'x', ap_materno: '', nombres: 'y' }, invalid(['ap_materno'], ['Para modificar un Proveedor, debes especificar su Apellido Materno.'])),
  update('S-ACT-8 a PUT carrying estado true does not activate a deactivated proveedor', 3, { estado: true }, { ok: true, match: { estado: false } }),

  // R-ANX-8 the padron flags are derived by padron id (the desktop mapped 01 to Buen Contribuyente when adding and 04 when removing [DEVIATION]).
  write('S-ANX-12 a create with padron 04 checks Buen Contribuyente and not A Percepcion', { ...RUC_BODY, ...padrones(add('04')) }, { ok: true, match: { flag_buen_contrib: true, flag_percepcion: false, flag_retencion: false } }, true),
  write('R-ANX-8 a create with padron 03 checks A Percepcion only', { ...RUC_BODY, ...padrones(add('03')) }, { ok: true, match: { flag_percepcion: true, flag_buen_contrib: false } }, true),
  write('R-ANX-8 a create with no padron leaves the three flags off', RUC_BODY, { ok: true, match: { flag_percepcion: false, flag_retencion: false, flag_buen_contrib: false } }),
  write('R-ANX-8 a body never writes the flags', { ...RUC_BODY, flag_retencion: true, flag_buen_contrib: true }, { ok: true, match: { flag_retencion: false, flag_buen_contrib: false } }),
  update('S-ANX-11 deactivating the padron 04 row unchecks Buen Contribuyente', 2, padrones({ op: 'A', id: '2', estado: 'D', f_fin: '2026-03-11' }), { ok: true, match: { flag_buen_contrib: false } }, true),
  { name: 'proveedores S-ANX-12 the seeded flags follow the active rows', slug: 'proveedores', steps: [{ op: 'get', id: supplier(2) }], expect: { ok: true, match: { flag_buen_contrib: true, flag_percepcion: false, flag_retencion: false } } },

  // S-ANX-9, S-ANX-10 the padron rule before any write.
  update('S-ANX-9 the same padron twice: Padron ya se Encuentra Activado', 1, padrones(add('02')), refused()),
  write('S-ANX-9 two inserts of one padron in a body are refused', { ...RUC_BODY, ...padrones(add('03'), add('03')) }, refused()),
  write('S-ANX-10 Proveedor does not offer 01 EXCEPTUADO: a 422 on the indexed padron', { ...RUC_BODY, ...padrones(add('01')) }, invalid(['padrones[0].id_padron'])),
  write('S-ANX-3 a padron row with no padron says Seleccione Padron', { ...RUC_BODY, ...padrones({ op: 'I', f_inicio: '2026-03-11' }) }, invalid(['padrones[0].id_padron'], ['Seleccione Padron'])),
  update('S-ANX-13 re-activating a deactivated padron is allowed (a new row, the old one stays)', 3, padrones(add('03')), { ok: true, match: { flag_percepcion: true } }),

  // Modes and the list (S-MST-1, S-MST-26, R-MST-13).
  { name: 'proveedores S-MST-1 DELETE answers 405 MODE_NOT_SUPPORTED', slug: 'proveedores', ctx: WRITER, steps: [{ op: 'remove', id: supplier(1) }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'proveedores R-MST-13 the list hides the retired proveedor', slug: 'proveedores', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'proveedores R-REG-8 get joins the tipo abreviatura and the nacionalidad', slug: 'proveedores', steps: [{ op: 'get', id: supplier(1) }], expect: { ok: true, match: { tipo_doc: 'RUC', nacionalidad: 'PERUANA', estado: true, flag_tipo_persona: 'J' } } },
  { name: 'proveedores S-MOCK-40 an unknown proveedor is a 404', slug: 'proveedores', ctx: WRITER, steps: [{ op: 'get', id: supplier(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
];
