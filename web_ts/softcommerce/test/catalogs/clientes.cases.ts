import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the anexo master `clientes` (`RegisterClienteNuevo`, R-MST-2, R-MST-10, S-MST-1, S-MST-3, S-MST-20), against the real registry and seeds, on the in-browser mock
 * and the HTTP mock. Seeded clientes (code padded to 10): 1 COMERCIAL LOS ANDES SAC (RUC 2, clasif 1, CREDITO 30), 2 a natural DNI client (CONTADO), 3 a CE / EXTRANJERA one
 * whose only activation is closed (estado off), 4 a retired one (hidden from the list). The tenant `demo` has every Cliente parameter on.
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const RUC_BODY = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1' };
const DNI_BODY = { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES, id_clasif_cliente: '1' };
const client = (n: number) => String(n).padStart(10, '0');
const text = (field: string) => `Para agregar un Cliente, debes especificar su ${field}.`;
const TIPO_CLIENTE = 'Para agregar un Cliente, debes Seleccionar un Tipo de Cliente.';

const write = (name: string, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `clientes ${name}`, slug: 'clientes', ctx: WRITER, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `clientes ${name}`, slug: 'clientes', ctx: WRITER, steps: [{ op: 'update', id: client(id), body }], expect });

export const CLIENTE_CASES: CatalogCase[] = [
  // R-MST-2 the identity block with the real entity in every sentence (S-MST-3).
  write('S-MST-3 a blank tipo says "un Cliente"', { ...RUC_BODY, id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para agregar un Cliente, debes Seleccionar un Tipo de Documento.'])),
  update('S-MST-3 UPDATE words the tipo sentence with modificar', 1, { id_tipo_doc_iden: '' }, invalid(['id_tipo_doc_iden'], ['Para modificar un Cliente, debes Seleccionar un Tipo de Documento.'])),
  write('R-MST-2 a DNI of 7 digits gives the DNI sentence', { ...DNI_BODY, numero_doc: '1234567' }, invalid(['numero_doc'], ['El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.'])),
  write('R-MST-2 the names of a DNI are checked paterno, materno, nombres', { id_tipo_doc_iden: '01', numero_doc: '12345678', id_clasif_cliente: '1' }, invalid(['ap_paterno'], [text('Apellido Paterno')])),
  write('S-MST-2 a RUC starting with 2 needs its razon social: su Descripcion', { ...RUC_BODY, descripcion: ' ' }, invalid(['descripcion'], [text('Descripcion')])),
  write('R-MST-2 a blank nacionalidad says the MS sentence with the real entity', { ...RUC_BODY, id_nacionalidad: '' }, invalid(['id_nacionalidad'], ['Para agregar un Cliente, debes Seleccionar una Nacionalidad.'])),

  // S-MST-20 the Cliente validation order: the tipo de cliente comes after the razon social and before the nacionalidad.
  write('S-MST-20 a DNI client with 8 digits, all names and no tipo de cliente', { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES }, invalid(['id_clasif_cliente'], [TIPO_CLIENTE])),
  write('S-MST-20 a RUC client with no tipo de cliente says the same', { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' }, invalid(['id_clasif_cliente'], [TIPO_CLIENTE])),
  write('S-MST-20 the tipo de cliente is checked before the nacionalidad', { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_nacionalidad: '' }, invalid(['id_clasif_cliente'], [TIPO_CLIENTE])),
  write('R-MST-10 a deactivated tipo de cliente is not offered: a 422 on the field', { ...RUC_BODY, id_clasif_cliente: '2' }, invalid(['id_clasif_cliente'])),

  // S-MST-20 third clause and S-MST-21 (the tenant `demo` has IS_CLIENTE_CONDICION_PAGO on): the días are checked last and only for CREDITO.
  write('S-MST-20 CREDITO with blank días says Ingrese numero de Dias', { ...RUC_BODY, condicion_pago: 'CREDITO', numero_dias: '' }, invalid(['numero_dias'], ['Ingrese numero de Dias'])),
  write('S-MST-20 the días come last: the nacionalidad sentence wins over a blank días', { ...RUC_BODY, id_nacionalidad: '', condicion_pago: 'CREDITO', numero_dias: '' }, invalid(['id_nacionalidad'], ['Para agregar un Cliente, debes Seleccionar una Nacionalidad.'])),
  write('S-MST-21 CREDITO with días stores flag_credito S and the días', { ...RUC_BODY, condicion_pago: 'CREDITO', numero_dias: 45 }, { ok: true, match: { condicion_pago: 'CREDITO', numero_dias: 45, flag_credito: 'S', flag_contado: 'N' } }),
  write('S-MST-21 CONTADO needs no días (the field is disabled and shows 0): flag_contado S', { ...RUC_BODY, condicion_pago: 'CONTADO', numero_dias: 0 }, { ok: true, match: { condicion_pago: 'CONTADO', numero_dias: 0, flag_contado: 'S', flag_credito: 'N' } }),
  write('S-MST-21 no condición (the blank item) stores neither flag and the default días 0', RUC_BODY, { ok: true, match: { numero_dias: 0, flag_contado: 'N', flag_credito: 'N' } }),
  write('R-MST-10 a condición outside CONTADO and CREDITO is a 422 on the field', { ...RUC_BODY, condicion_pago: 'TARJETA' }, invalid(['condicion_pago'])),
  update('S-MST-21 changing a CREDITO cliente to CONTADO stores the flags and días 0', 1, { condicion_pago: 'CONTADO', numero_dias: 0 }, { ok: true, match: { flag_contado: 'S', flag_credito: 'N', numero_dias: 0 } }),
  { name: 'clientes S-MST-21 the seeded condición is read back', slug: 'clientes', steps: [{ op: 'get', id: client(1) }], expect: { ok: true, match: { condicion_pago: 'CREDITO', numero_dias: 30, flag_credito: 'S' } } },

  // S-MST-5 the persona flag and the stored constants (R-ANX-9).
  write('S-MST-5 a RUC starting with 2 is juridical: flag_tipo_persona J', RUC_BODY, { ok: true, match: { flag_tipo_persona: 'J' } }),
  write('S-MST-5 a DNI is N and composes the razon social', DNI_BODY, { ok: true, match: { flag_tipo_persona: 'N', descripcion: 'PEREZ LOPEZ ANA' } }),
  write('newRegister opens on PERUANA and sexo M: a body that leaves them out gets them', DNI_BODY, { ok: true, match: { id_nacionalidad: '001', nacionalidad: 'PERUANA', sexo: 'M' } }),
  write('S-ANX-16 the server issues the next code padded to ten and the tipo anexo is 2', RUC_BODY, { ok: true, match: { id_cliente: client(5), id_tipo_anexo: '2', activo: true } }),
  write('R-ANX-9 the tipo anexo is the hidden constant "2", never read from the body', { ...RUC_BODY, id_tipo_anexo: '9' }, { ok: true, match: { id_tipo_anexo: '2' } }),
  write('R-ACT-5 estado is derived: a POST ignores the body estado', { ...RUC_BODY, estado: false }, { ok: true, match: { estado: true } }),
  { name: 'clientes S-MOCK-26 stamps the session user, not the body', slug: 'clientes', ctx: WRITER, steps: [{ op: 'create', body: { ...RUC_BODY, id_usuario: '9' } }], expect: { ok: true, match: { id_usuario: 7 } } },
  { name: 'clientes S-MOCK-36 a write without the user header is a 400', slug: 'clientes', ctx: {}, steps: [{ op: 'create', body: RUC_BODY }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },

  // UPDATE restores what is stored.
  { name: 'clientes R-MST-2 the stored CE and EXTRANJERA are read back', slug: 'clientes', steps: [{ op: 'get', id: client(3) }], expect: { ok: true, match: { id_tipo_doc_iden: '04', tipo_doc: 'CE', id_nacionalidad: '002', nacionalidad: 'EXTRANJERA' } } },
  update('R-MST-2 UPDATE keeps the stored tipo and nacionalidad when the body carries neither', 3, { telefono: '5551234' }, { ok: true, match: { id_tipo_doc_iden: '04', id_nacionalidad: '002', telefono: '5551234' } }),
  update('S-ACT-8 a PUT carrying estado true does not activate a deactivated cliente', 3, { estado: true }, { ok: true, match: { estado: false } }),

  // Modes and the list (S-MST-1, R-MST-10).
  { name: 'clientes S-MST-1 DELETE answers 405 MODE_NOT_SUPPORTED', slug: 'clientes', ctx: WRITER, steps: [{ op: 'remove', id: client(1) }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: 'clientes R-MST-10 the list hides the retired cliente', slug: 'clientes', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'clientes R-REG-8 get joins the tipo abreviatura and the nacionalidad', slug: 'clientes', steps: [{ op: 'get', id: client(1) }], expect: { ok: true, match: { tipo_doc: 'RUC', nacionalidad: 'PERUANA', estado: true, flag_tipo_persona: 'J' } } },
  { name: 'clientes S-MOCK-40 an unknown cliente is a 404', slug: 'clientes', ctx: WRITER, steps: [{ op: 'get', id: client(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
];
