import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the Item master `items`, tab `Datos de Item` (`RegisterItem`, R-MST-14, S-MST-1, S-MST-27 to S-MST-29, S-MST-31), against the real registry and seeds, on the in-browser mock and
 * the HTTP mock. Seeded items (empresa 1, code padded to six): 1 MANZANA ROJA (producto, perecible 7 dias, AFECTO 18), 2 SERVICIO DE TRANSPORTE (tipo T, INAFECTO 0), 3 LECHE ENTERA (estado off),
 * 4 retired (hidden). `demo` has IS_ITEM_RESUMEN_PRECIO on and PORC_IGV 18.
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7', empresaId: '1' };
const item = (n: number) => String(n).padStart(6, '0');
const sentence = (what: string) => `Para agregar un Item, debes especificar su ${what}.`;
const BODY = { id_alterno: 'zz-1', id_familia: '001', id_marca: '001', descripcion: 'arroz extra', id_um_stock: '001' };

const write = (name: string, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `items ${name}`, slug: 'items', ctx: WRITER, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: number, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `items ${name}`, slug: 'items', ctx: WRITER, steps: [{ op: 'update', id: item(id), body }], expect });
const options = (name: string, filters: Record<string, string>, expect: Outcome): CatalogCase => ({ name: `items ${name}`, slug: 'clases-sunat', ctx: WRITER, steps: [{ op: 'options', filters }], expect });

export const ITEM_CASES: CatalogCase[] = [
  // S-MST-27 the order of isRegisterValid: alterno, familia, marca, descripcion, U. Stock (U. Compra and U. Venta follow the stock).
  write('S-MST-27 an empty INSERT asks for the Codigo Alternativo first', {}, invalid(['id_alterno'], [sentence('Codigo Alternativo')])),
  write('S-MST-27 then the Familia', { id_alterno: 'zz-1' }, invalid(['id_familia'], [sentence('Familia')])),
  write('S-MST-27 then the Marca', { id_alterno: 'zz-1', id_familia: '001' }, invalid(['id_marca'], [sentence('Marca')])),
  write('S-MST-27 then the Descripcion', { id_alterno: 'zz-1', id_familia: '001', id_marca: '001' }, invalid(['descripcion'], [sentence('Descripcion')])),
  write('S-MST-27 then the U. Stock', { id_alterno: 'zz-1', id_familia: '001', id_marca: '001', descripcion: 'arroz' }, invalid(['id_um_stock'], [sentence('U. Stock')])),
  write('S-MST-27 a body that leaves U. Compra and U. Venta out gets the U. Stock in both', BODY, { ok: true, match: { id_um_stock: '001', id_um_compra: '001', id_um_venta: '001', id_alterno: 'ZZ-1' } }),
  write('S-MST-27 U. Compra and U. Venta of a body never win over the U. Stock (read-only)', { ...BODY, id_um_compra: '002', id_um_venta: '004' }, { ok: true, match: { id_um_compra: '001', id_um_venta: '001' } }),
  update('S-MST-27 UPDATE words the sentence with modificar', 1, { id_alterno: '' }, invalid(['id_alterno'], ['Para modificar un Item, debes especificar su Codigo Alternativo.'])),
  write('R-MST-14 a deactivated familia is not offered: a 422 on the field', { ...BODY, id_familia: '004' }, invalid(['id_familia'])),
  write('R-MST-14 a unit of another empresa is not offered: a 422 on the field', { ...BODY, id_um_stock: '003' }, invalid(['id_um_stock'])),

  // The id_alterno is unique (a stored-procedure rule, [ASSUMPTION]): a new message.
  write('R-MST-14 a repeated Codigo Alternativo is a 409 with the new message', { ...BODY, id_alterno: 'aba-001' }, { status: 409, code: 'DUPLICATE', fields: ['id_alterno'], messages: ['El codigo alternativo ya existe.'] }),
  update('R-MST-14 UPDATE keeps the own Codigo Alternativo without conflict', 1, { descripcion: 'manzana roja especial' }, { ok: true, match: { id_alterno: 'ABA-001', descripcion: 'MANZANA ROJA ESPECIAL' } }),
  write('S-ANX-16 the server issues the next code padded to six, stamped with the session empresa and user', BODY, { ok: true, match: { id_item: item(5), id_empresa: '1', id_usuario: 7, estado: true, activo: true } }),

  // S-MST-29 the familia -> subfamilia chain and the clase SUNAT.
  write('S-MST-29 a subfamilia of another familia is a 422 on the field', { ...BODY, id_subfamilia: '003' }, invalid(['id_subfamilia'])),
  write('S-MST-29 a subfamilia of the chosen familia is stored', { ...BODY, id_subfamilia: '001' }, { ok: true, match: { id_subfamilia: '001', subfamilia: 'FRUTAS', familia: 'ABARROTES' } }),
  write('S-MST-29 a clase SUNAT of the subfamilia SUNAT code is stored', { ...BODY, id_subfamilia: '001', codigo_clase_sunat: '50101538' }, { ok: true, match: { codigo_clase_sunat: '50101538' } }),
  write('S-MST-29 a clase SUNAT of another subfamilia SUNAT code is a 422', { ...BODY, id_subfamilia: '002', codigo_clase_sunat: '50101538' }, invalid(['codigo_clase_sunat'])),
  options('S-MST-29 the clase SUNAT options follow the subfamilia SUNAT code', { id_subfamilia: '001' }, { ok: true, items: [{ id: '50101538', name: 'MANZANAS' }, { id: '50101539', name: 'PERAS' }] }),
  options('S-MST-29 a subfamilia with no SUNAT code offers no clase', { id_subfamilia: '004' }, { ok: true, items: [] }),

  // S-MST-28 the tipo: Kardex and Serv.Transporte are derived and read-only, perecible and dias are for the producto.
  write('S-MST-28 a producto has Kardex on and Serv.Transporte off (the default tipo is P)', BODY, { ok: true, match: { tipo: 'P', kardex: true, serv_transporte: false, perecible: 'N', dias: 0 } }),
  write('S-MST-28 a concepto has both off', { ...BODY, tipo: 'C' }, { ok: true, match: { kardex: false, serv_transporte: false } }),
  write('S-MST-28 a transporte has Serv.Transporte on and Kardex off', { ...BODY, tipo: 'T' }, { ok: true, match: { kardex: false, serv_transporte: true } }),
  write('S-MST-28 Kardex and Serv.Transporte of a body never win over the tipo', { ...BODY, tipo: 'C', kardex: true, serv_transporte: true }, { ok: true, match: { kardex: false, serv_transporte: false } }),
  write('S-MST-28 a producto perecible keeps its dias', { ...BODY, perecible: 'S', dias: 10 }, { ok: true, match: { perecible: 'S', dias: 10 } }),
  write('S-MST-28 a tipo that is not P stores the perecible panel blank (it is hidden)', { ...BODY, tipo: 'T', perecible: 'S', dias: 10 }, { ok: true, match: { perecible: '', dias: '' } }),
  update('S-MST-28 changing the tipo to T recomputes the flags', 1, { tipo: 'T' }, { ok: true, match: { kardex: false, serv_transporte: true } }),
  write('R-MST-14 a tipo outside P, C and T is a 422', { ...BODY, tipo: 'X' }, invalid(['tipo'])),

  // S-MST-29 the tax clause: INAFECTO gives 0, AFECTO the company percentage (PORC_IGV 18 in demo), editable.
  write('S-MST-29 AFECTO with no percentage takes the company IGV', BODY, { ok: true, match: { afecto_igv: 'AFECTO', por_igv: 18 } }),
  write('S-MST-29 AFECTO keeps an edited percentage', { ...BODY, por_igv: 10.5 }, { ok: true, match: { por_igv: 10.5 } }),
  write('S-MST-29 INAFECTO stores 0 whatever the body says', { ...BODY, afecto_igv: 'INAFECTO', por_igv: 18 }, { ok: true, match: { afecto_igv: 'INAFECTO', por_igv: 0 } }),
  write('S-MST-29 EXONERADO stores 0 too', { ...BODY, afecto_igv: 'EXONERADO' }, { ok: true, match: { por_igv: 0 } }),
  update('S-MST-29 changing the seeded AFECTO item to INAFECTO stores 0', 1, { afecto_igv: 'INAFECTO' }, { ok: true, match: { por_igv: 0 } }),
  write('R-MST-14 Suj. Percepcion and Porc. Perc open off and 0 (the Percepcion tab is deferred)', BODY, { ok: true, match: { flag_percepcion: false, por_perc: 0 } }),

  // S-MST-31 the six prices (IS_ITEM_RESUMEN_PRECIO on in demo): a blank saves 0.
  write('S-MST-31 the prices of a body are stored', { ...BODY, precio_sol_publico: 3.5, precio_dol_mayor: 0.9 }, { ok: true, match: { precio_sol_publico: 3.5, precio_dol_mayor: 0.9, precio_sol_tarjeta: 0 } }),
  write('S-MST-31 a blank price saves 0', { ...BODY, precio_sol_tarjeta: '', precio_dol_tarjeta: '  ' }, { ok: true, match: { precio_sol_tarjeta: 0, precio_dol_tarjeta: 0, precio_sol_mayor: 0 } }),

  // S-MST-1 and the list: the Item has no clone; the retired one is hidden; the scope is the session empresa.
  { name: 'items S-MST-1 the list hides the retired item', slug: 'items', ctx: WRITER, steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'items R-REG-8 get joins the familia, marca and the three units', slug: 'items', ctx: WRITER, steps: [{ op: 'get', id: item(1) }], expect: { ok: true, match: { familia: 'ABARROTES', subfamilia: 'FRUTAS', marca: 'SONY', um_stock: 'KG', um_compra: 'KG', um_venta: 'KG' } } },
  { name: 'items R-MOCK-13 the list is the session empresa: empresa 2 sees none', slug: 'items', ctx: { userId: '7', empresaId: '2' }, steps: [{ op: 'list' }], expect: { ok: true, total: 0 } },
  { name: 'items S-MOCK-40 an unknown item is a 404', slug: 'items', ctx: WRITER, steps: [{ op: 'get', id: item(9) }], expect: { status: 404, code: 'NOT_FOUND' } },
  { name: 'items R-MST-15 DELETE is logical: the item leaves the list', slug: 'items', ctx: WRITER, steps: [{ op: 'remove', id: item(2) }, { op: 'list' }], expect: { ok: true, total: 2 } },
];
