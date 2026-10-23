import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the two catalogs that use the named rule `docIdentidad` (R-REF-8, S-REF-25..29, S-MOCK-32): Chofer and Socio, against the real registry and
 * seeds. Tipo ids: `01` DNI, `04` CE, `05` RUC, `00` a non-person type, `06` a person type whose estado is off, `99` a retired one (tipos-doc-iden).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const DNI_TEXT = 'El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.';
const RUC_TEXT = 'El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.';
const ALERT = 'EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2';
const NAMES = { ap_paterno: 'perez', ap_materno: 'lopez', nombres: 'ana' };
const modeNotSupported: Outcome = { status: 405, code: 'MODE_NOT_SUPPORTED' };

/** The rows every document catalog shares; `entity` and `slug` word the messages, `ctx` is the session of its writes. */
function documentCases(slug: 'choferes' | 'socios', entity: string, base: Record<string, unknown>, ctx: CatalogCase['ctx'], idOf: (n: number) => string): CatalogCase[] {
  const at = (what: string) => `${slug} ${what}`;
  const create = (body: Record<string, unknown>, expect: Outcome, name: string, deviation?: boolean): CatalogCase => ({ name: at(name), slug, ctx, deviation, steps: [{ op: 'create', body: { ...base, ...body } }], expect });
  const text = (field: string) => `Para agregar ${entity}, debes especificar su ${field}.`;
  return [
    create({ id_tipo_doc_iden: '01', numero_doc: '1234567', ...NAMES }, invalid(['numero_doc'], [DNI_TEXT]), 'S-REF-25 a DNI of 7 digits gives the DNI sentence'),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678', ap_paterno: 'perez', ap_materno: ' ', nombres: 'ana' }, invalid(['ap_materno'], [text('Apellido Materno')]), 'S-REF-25 a blank materno says so with the real entity [DEVIATION]', true),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678' }, invalid(['ap_paterno'], [text('Apellido Paterno')]), 'S-REF-25 the names are checked paterno, materno, nombres'),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678', ap_paterno: 'perez', ap_materno: 'lopez' }, invalid(['nombres'], [text('Nombre')]), 'S-REF-25 a blank nombres says su Nombre'),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA', numero_doc: '12345678' } }, 'S-REF-25 composes the razon social as paterno materno nombres'),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES, descripcion: 'OTRO' }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA' } }, 'S-REF-25 the razon social of a person is the composition, whatever the body says'),
    create({ id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES, descripcion: null }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA' } }, 'S-MOCK-20 the hidden razon social the UI sends as null is composed'),
    create({ id_tipo_doc_iden: '01', numero_doc: '123456789', ...NAMES }, invalid(['numero_doc']), 'S-REF-25 maxWhen: a ninth digit of a DNI is a 422'),
    create({ id_tipo_doc_iden: '05', numero_doc: '2012345678', descripcion: 'acme' }, invalid(['numero_doc'], [RUC_TEXT]), 'S-REF-26 a RUC of 10 digits gives the RUC sentence'),
    create({ id_tipo_doc_iden: '05', numero_doc: '30123456789', descripcion: 'acme' }, invalid(['numero_doc'], [ALERT]), 'S-REF-26 a RUC starting with 3 cannot be stored'),
    create({ id_tipo_doc_iden: '05', numero_doc: '10123456789', ap_paterno: 'perez' }, invalid(['ap_materno'], [text('Apellido Materno')]), 'S-REF-26 a RUC starting with 1 needs the three names'),
    create({ id_tipo_doc_iden: '05', numero_doc: '10123456789', ...NAMES }, { ok: true, match: { descripcion: 'PEREZ LOPEZ ANA' } }, 'S-REF-26 a RUC starting with 1 composes the razon social'),
    create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: ' ' }, invalid(['descripcion'], [text('Descripcion')]), 'S-REF-26 a RUC starting with 2 needs its razon social'),
    create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' }, { ok: true, match: { descripcion: 'ACME SAC' } }, 'S-REF-26 a RUC starting with 2 stores its razon social'),
    create({ id_tipo_doc_iden: '04', numero_doc: '1', descripcion: 'juan' }, { ok: true, match: { numero_doc: '1', descripcion: 'JUAN' } }, 'S-REF-26 any other tipo has no minimum on the number'),
    create({ id_tipo_doc_iden: '04', numero_doc: '123456789012', descripcion: 'juan' }, invalid(['numero_doc']), 'S-REF-26 any other tipo takes at most 11 digits'),
    create({ id_tipo_doc_iden: '04', numero_doc: '1' }, invalid(['descripcion'], [text('Descripcion')]), 'S-REF-26 any other tipo needs its razon social'),
    create({ id_tipo_doc_iden: '', numero_doc: '12345678', ...NAMES }, invalid(['id_tipo_doc_iden']), 'a blank tipo is a 422 on it'),
    create({ id_tipo_doc_iden: '00', numero_doc: '1', descripcion: 'x' }, invalid(['id_tipo_doc_iden']), 'D16 a tipo that is not for persons is a 422 on id_tipo_doc_iden'),
    create({ id_tipo_doc_iden: '06', numero_doc: '1', descripcion: 'x' }, invalid(['id_tipo_doc_iden']), 'D16 a person tipo whose estado is off is a 422 on id_tipo_doc_iden'),
    create({ id_tipo_doc_iden: '99', numero_doc: '1', descripcion: 'x' }, invalid(['id_tipo_doc_iden']), 'S-REF-34 a retired tipo is a 422 on id_tipo_doc_iden'),
    create({ id_tipo_doc_iden: '77', numero_doc: '1', descripcion: 'x' }, invalid(['id_tipo_doc_iden']), 'S-REF-34 an unknown tipo is a 422 on id_tipo_doc_iden'),
    { name: at('S-REF-29 DELETE answers 405 MODE_NOT_SUPPORTED'), slug, ctx, steps: [{ op: 'remove', id: idOf(1) }], expect: modeNotSupported },
    { name: at('S-REF-29 a refused DELETE leaves the row active'), slug, ctx, steps: [{ op: 'remove', id: idOf(1) }, { op: 'get', id: idOf(1) }], expect: { ok: true, match: { activo: true } } },
    { name: at('S-REF-25 UPDATE words the names sentence with modificar'), slug, ctx, steps: [{ op: 'update', id: idOf(1), body: { ap_materno: '' } }], expect: invalid(['ap_materno'], [`Para modificar ${entity}, debes especificar su Apellido Materno.`]) },
    { name: at('S-REF-26 UPDATE of a RUC row keeps its tipo and razon social'), slug, ctx, steps: [{ op: 'update', id: idOf(2), body: { nombres: '' } }], expect: { ok: true, match: { id_tipo_doc_iden: '05', numero_doc: '20512345678', descripcion: 'TRANSPORTES ANDINOS SAC' } } },
    { name: at('S-REF-27 UPDATE to another tipo re-runs the rule'), slug, ctx, steps: [{ op: 'update', id: idOf(1), body: { id_tipo_doc_iden: '05', numero_doc: '20123456789', ap_paterno: '', ap_materno: '', nombres: '', descripcion: 'acme' } }], expect: { ok: true, match: { id_tipo_doc_iden: '05', descripcion: 'ACME' } } },
    { name: at('S-REF-1 the list hides the retired row'), slug, steps: [{ op: 'list' }], expect: { ok: true, total: 2 } },
    { name: at('S-MOCK-15 get resolves the retired row'), slug, steps: [{ op: 'get', id: idOf(3) }], expect: { ok: true, match: { activo: false } } },
    { name: at('R-REG-8 get joins the tipo abreviatura'), slug, steps: [{ op: 'get', id: idOf(1) }], expect: { ok: true, match: { tipo_doc: 'DNI' } } },
    { name: at('R-REG-8 a RUC row joins RUC'), slug, steps: [{ op: 'get', id: idOf(2) }], expect: { ok: true, match: { tipo_doc: 'RUC' } } },
  ];
}

const CHOFER_BASE = { id_nacionalidad: '001' };
const chofer = (id: number) => String(id).padStart(10, '0');
const DNI_BODY = { id_tipo_doc_iden: '01', numero_doc: '12345678', ...NAMES };

export const DOCUMENT_CASES: CatalogCase[] = [
  ...documentCases('choferes', 'un Chofer', CHOFER_BASE, WRITER, chofer),
  { name: 'choferes S-MOCK-25 the server issues the next code padded to ten', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: DNI_BODY }], expect: { ok: true, match: { id_chofer: '0000000004', activo: true } } },
  { name: 'choferes S-MOCK-26 stamps the session user, not the body', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, id_usuario: '9' } }], expect: { ok: true, match: { id_usuario: 7 } } },
  { name: 'choferes S-MOCK-36 a write without the user header is a 400', slug: 'choferes', ctx: {}, steps: [{ op: 'create', body: DNI_BODY }], expect: { status: 400, code: 'MISSING_SESSION_CONTEXT' } },
  { name: 'choferes R-REF-8 stores flag_tipo_persona N, even for a RUC starting with 2', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme' } }], expect: { ok: true, match: { flag_tipo_persona: 'N' } } },
  { name: 'choferes R-REF-6 INSERT starts on DNI and PERUANA when the body leaves them out', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { numero_doc: '12345678', ...NAMES } }], expect: { ok: true, match: { id_tipo_doc_iden: '01', id_nacionalidad: '001', sexo: 'M', nacionalidad: 'PERUANA' } } },
  { name: 'choferes S-REF-26 sexo belongs to a natural person: a juridical RUC stores it empty', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme', sexo: 'F' } }], expect: { ok: true, match: { sexo: '' } } },
  { name: 'choferes a natural person keeps the sexo it is sent', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, sexo: 'F' } }], expect: { ok: true, match: { sexo: 'F', sexo_label: 'Femenino' } } },
  { name: 'choferes R-MOCK-10 a sexo outside M|F is a 422 on it', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, sexo: 'X' } }], expect: invalid(['sexo']) },
  { name: 'choferes a blank nacionalidad says the MS sentence with the real entity', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, id_nacionalidad: '' } }], expect: invalid(['id_nacionalidad'], ['Para agregar un Chofer, debes Seleccionar una Nacionalidad.']) },
  { name: 'choferes a blank tipo says the MS sentence', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, id_tipo_doc_iden: '' } }], expect: invalid(['id_tipo_doc_iden'], ['Para agregar un Chofer, debes Seleccionar un Tipo de Documento.']) },
  { name: 'choferes UPDATE words the nacionalidad sentence with modificar', slug: 'choferes', ctx: WRITER, steps: [{ op: 'update', id: chofer(1), body: { id_nacionalidad: '' } }], expect: invalid(['id_nacionalidad'], ['Para modificar un Chofer, debes Seleccionar una Nacionalidad.']) },
  { name: 'choferes S-REF-34 an unknown nacionalidad is a 422 on it', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, id_nacionalidad: '999' } }], expect: invalid(['id_nacionalidad']) },
  { name: 'choferes S-REF-34 an inactive nacionalidad is a 422 on it', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, id_nacionalidad: '003' } }], expect: invalid(['id_nacionalidad']) },
  { name: 'choferes S-REF-29 a RUC chofer with EXTRANJERA reads back both, not forced to DNI / PERUANA [DEVIATION]', slug: 'choferes', deviation: true, steps: [{ op: 'get', id: chofer(2) }], expect: { ok: true, match: { id_tipo_doc_iden: '05', id_nacionalidad: '002', nacionalidad: 'EXTRANJERA' } } },
  { name: 'choferes S-REF-29 UPDATE keeps the stored RUC and EXTRANJERA when the body carries neither [DEVIATION]', slug: 'choferes', ctx: WRITER, deviation: true, steps: [{ op: 'update', id: chofer(2), body: { telefono: '5551234' } }], expect: { ok: true, match: { id_tipo_doc_iden: '05', id_nacionalidad: '002', telefono: '5551234' } } },
  { name: 'choferes R-REF-6 nro_licencia is uppercased', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, nro_licencia: 'q12ab' } }], expect: { ok: true, match: { nro_licencia: 'Q12AB' } } },
  { name: 'choferes R-REF-6 nro_licencia takes 20 characters, not 21', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, nro_licencia: 'a'.repeat(21) } }], expect: invalid(['nro_licencia']) },
  { name: 'choferes R-REF-6 direccion takes 280 characters, not 281', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, direccion: 'a'.repeat(281) } }], expect: invalid(['direccion']) },
  { name: 'choferes R-REF-6 telefono and celular keep digits only, at most 15', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, telefono: '(01) 456-7890', celular: '9'.repeat(15) } }], expect: { ok: true, match: { telefono: '014567890', celular: '9'.repeat(15) } } },
  { name: 'choferes R-REF-6 a 16-digit celular is a 422', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { ...DNI_BODY, celular: '9'.repeat(16) } }], expect: invalid(['celular']) },
  { name: 'choferes R-REF-6 descripcion takes 300 characters, not 301', slug: 'choferes', ctx: WRITER, steps: [{ op: 'create', body: { id_tipo_doc_iden: '04', numero_doc: '1', descripcion: 'a'.repeat(301) } }], expect: invalid(['descripcion']) },

  ...documentCases('socios', 'un Socio', {}, {}, (n) => String(n)),
  { name: 'socios S-MOCK-25 the server issues the next code, unpadded', slug: 'socios', steps: [{ op: 'create', body: DNI_BODY }], expect: { ok: true, match: { id_socio: '4', activo: true } } },
  { name: 'socios R-REF-3 a Socio stamps no user: it needs no session header', slug: 'socios', ctx: {}, steps: [{ op: 'create', body: DNI_BODY }], expect: { ok: true } },
  { name: 'socios R-REF-3 estado is true when the body omits it', slug: 'socios', steps: [{ op: 'create', body: DNI_BODY }], expect: { ok: true, match: { estado: true } } },
  { name: 'socios R-REF-6 a Socio has no tipo default: a missing tipo is a 422 with the MS sentence', slug: 'socios', steps: [{ op: 'create', body: { numero_doc: '12345678', ...NAMES } }], expect: invalid(['id_tipo_doc_iden'], ['Para agregar un Socio, debes Seleccionar un Tipo de Documento.']) },
  { name: 'socios S-REF-28 a RUC starting with 2 is J', slug: 'socios', steps: [{ op: 'create', body: { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' } }], expect: { ok: true, match: { flag_tipo_persona: 'J' } } },
  { name: 'socios S-REF-28 a RUC starting with 1 is N', slug: 'socios', steps: [{ op: 'create', body: { id_tipo_doc_iden: '05', numero_doc: '10123456789', ...NAMES } }], expect: { ok: true, match: { flag_tipo_persona: 'N' } } },
  { name: 'socios S-REF-28 a DNI is N', slug: 'socios', steps: [{ op: 'create', body: DNI_BODY }], expect: { ok: true, match: { flag_tipo_persona: 'N' } } },
  { name: 'socios S-REF-28 any other tipo is N', slug: 'socios', steps: [{ op: 'create', body: { id_tipo_doc_iden: '04', numero_doc: '20123456789', descripcion: 'x' } }], expect: { ok: true, match: { flag_tipo_persona: 'N' } } },
  { name: 'socios S-REF-28 UPDATE from DNI to a juridical RUC turns the flag to J', slug: 'socios', steps: [{ op: 'update', id: '1', body: { id_tipo_doc_iden: '05', numero_doc: '20123456789', ap_paterno: '', ap_materno: '', nombres: '', descripcion: 'acme' } }], expect: { ok: true, match: { flag_tipo_persona: 'J' } } },
  { name: 'socios S-REF-28 the seeded juridical socio is J', slug: 'socios', steps: [{ op: 'get', id: '2' }], expect: { ok: true, match: { flag_tipo_persona: 'J' } } },
  { name: 'socios S-MOCK-32 DELETE is 405 MODE_NOT_SUPPORTED, not METHOD_NOT_ALLOWED', slug: 'socios', steps: [{ op: 'remove', id: '1' }], expect: modeNotSupported },
  { name: 'socios S-MOCK-32 the refused DELETE leaves the socio active', slug: 'socios', steps: [{ op: 'remove', id: '2' }, { op: 'list' }], expect: { ok: true, total: 2 } },
];
