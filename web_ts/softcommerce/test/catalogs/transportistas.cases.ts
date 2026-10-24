import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the anexo master `transportistas` (`RegisterTransportistaNuevo`, R-MST-2, R-MST-5, S-MST-1..3, S-ANX-16), against the real registry and seeds, on the
 * in-browser mock and the HTTP mock. Seeded transportistas (code padded to 10): 1 TRANSPORTES RAPIDO SAC (RUC 2, active), 2 a natural person with a RUC 1
 * (active), 3 a CE / EXTRANJERA one whose only activation is closed (estado off), 4 a retired one (hidden from the list).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const RUC_BODY = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' };
const DNI_BODY = { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES };
const carrier = (n: number) => String(n).padStart(10, '0');
const text = (field: string) => `Para agregar un Transportista, debes especificar su ${field}.`;

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `transportistas ${name}`, slug: 'transportistas', ctx: WRITER, deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `transportistas ${name}`, slug: 'transportistas', ctx: WRITER, deviation, steps: [{ op: 'update', id: carrier(id), body }], expect });

export const TRANSPORTISTA_CASES: CatalogCase[] = [
  // R-MST-2 the identity block with the real entity in every sentence (S-MST-3).
  write('S-MST-3 a blank tipo says "un Transportista", not "un Cliente" [DEVIATION]', { ...RUC_BODY, id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Transportista, debes Seleccionar un Tipo de Documento.']), true),
  update('S-MST-3 UPDATE words the tipo sentence with modificar [DEVIATION]', 1, { id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para modificar un Transportista, debes Seleccionar un Tipo de Documento.']), true),
  write('R-MST-2 a DNI of 7 digits gives the DNI sentence', { ...DNI_BODY, numero_doc: '1234567' }, invalid(['numero_doc'], ['El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('R-MST-2 the names of a DNI are checked paterno, materno, nombres', { id_tipo_doc_iden: '01', numero_doc: '12345678' }, invalid(['ap_paterno'], [text('Apellido Paterno')])),
  write('R-MST-2 a RUC of 10 digits gives the RUC sentence', { ...RUC_BODY, numero_doc: '2012345678' }, invalid(['numero_doc'], ['El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('S-MST-2 a RUC starting with 3 cannot be stored', { ...RUC_BODY, numero_doc: '30123456789' }, invalid(['numero_doc'], ['EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2'])),
  write('S-MST-2 a RUC starting with 2 needs its razon social: su Descripcion', { ...RUC_BODY, descripcion: ' ' }, invalid(['descripcion'], [text('Descripcion')])),
  write('R-MST-2 a blank nacionalidad says the MS sentence with the real entity', { ...RUC_BODY, id_nacionalidad: '' }, invalid(['id_nacionalidad'], ['Para agregar un Transportista, debes Seleccionar una Nacionalidad.'])),
  write('R-MST-2 an e-mail is stored in lowercase', { ...RUC_BODY, email: 'Flota@Rapido.PE' }, { ok: true, match: { email: 'flota@rapido.pe' } }),

  // INSERT defaults and the stored flags (R-MST-2, R-ANX-9, S-ANX-16).
  write('newRegister opens on RUC and PERUANA: a body that leaves them out gets them', { numero_doc: '20123456789', descripcion: 'acme sac' }, { ok: true, match: { id_tipo_doc_iden: '05', id_nacionalidad: '001', nacionalidad: 'PERUANA', tipo_doc: 'RUC', sexo: '' } }),
  write('S-ANX-16 the server issues the next code padded to ten and the tipo anexo is 6', RUC_BODY, { ok: true, match: { id_transportista: carrier(5), id_tipo_anexo: '6', activo: true } }),
  write('R-ANX-9 the tipo anexo is the hidden constant "6", never read from the body', { ...RUC_BODY, id_tipo_anexo: '9' }, { ok: true, match: { id_tipo_anexo: '6' } }),
  write('S-MST-2 a RUC starting with 1 composes the razon social and is N', { id_tipo_doc_iden: '05', numero_doc: '10123456789', ...NAMES }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA', flag_tipo_persona: 'N' } }),
  write('R-MST-2 a RUC starting with 2 is juridical: flag_tipo_persona J', RUC_BODY, { ok: true, match: { flag_tipo_persona: 'J' } }),
  write('R-ACT-5 estado is derived: a POST ignores the body estado', { ...RUC_BODY, estado: false }, { ok: true, match: { estado: true } }),
  { name: 'transportistas S-MOCK-26 stamps the session user, not the body', slug: 'transportistas', ctx: WRITER, steps: [{ op: 'create', body: { ...RUC_BODY, id_usuario: '9' } }], expect: { ok: true, match: { id_usuario: 7 } } },
  { name: 'transportistas S-MOCK-36 a write without the user header is a 400', slug: 'transportistas', ctx: {}, steps: [{ op: 'create', body: RUC_BODY }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },

  // UPDATE restores what is stored (the desktop forced PERUANA, spec [DEVIATION]).
  { name: 'transportistas R-MST-2 the stored EXTRANJERA and CE are read back, not forced to PERUANA [DEVIATION]', slug: 'transportistas', deviation: true, steps: [{ op: 'get', id: carrier(3) }], expect: { ok: true, match: { id_tipo_doc_iden: '04', tipo_doc: 'CE', id_nacionalidad: '002', nacionalidad: 'EXTRANJERA' } } },
  update('R-MST-2 UPDATE keeps the stored tipo and nacionalidad when the body carries neither [DEVIATION]', 3, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '04', id_nacionalidad: '002', telefono: '5551234' } }, true),
  update('R-MST-2 UPDATE words the names sentence with modificar', 3, { id_tipo_doc_iden: '01', numero_doc: '12345678', ap_paterno: 'x', ap_materno: '', nombres: 'y' }, invalid(['ap_materno'], ['Para modificar un Transportista, debes especificar su Apellido Materno.'])),
  update('S-ACT-8 a PUT carrying estado true does not activate a deactivated transportista', 3, { estado: true }, { ok: true, match: { estado: false } }),

  // Modes and the list (S-MST-1, R-MST-5).
  { name: 'transportistas S-MST-1 DELETE answers 405 MODE_NOT_SUPPORTED', slug: 'transportistas', ctx: WRITER, steps: [{ op: 'remove', id: carrier(1) }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'transportistas R-MST-5 the list hides the retired transportista', slug: 'transportistas', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'transportistas R-REG-8 get joins the tipo abreviatura and the nacionalidad', slug: 'transportistas', steps: [{ op: 'get', id: carrier(1) }], expect: { ok: true, match: { tipo_doc: 'RUC', nacionalidad: 'PERUANA', estado: true } } },
  { name: 'transportistas S-MOCK-40 an unknown transportista is a 404', slug: 'transportistas', ctx: WRITER, steps: [{ op: 'get', id: carrier(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
];
