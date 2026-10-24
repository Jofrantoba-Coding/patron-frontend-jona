import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the Cliente child grids (`RegisterClienteNuevo` dialogs `FormClienteDireccion`, `FormClienteContacto`, `FormClienteCuenta`; R-MST-11, S-MST-22, S-MST-23, S-MOCK-42),
 * through the composite write of `clientes`, on the in-browser mock and the HTTP mock. The tenant `demo` has IS_DIRECCION_CLIENTE true (the zona is optional). Seeded: cliente 1 has
 * three direcciones (active, deactivated, deleted), one contacto and two cuentas (BCP and OTROS); the bancos are the detalles of tabla 3 (56 BCP, 57 INTERBANK, 58 OTROS, 59 retired).
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const WRITER = { userId: '7' };
const BASE = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1' };
const withChildren = (children: Record<string, unknown[]>) => ({ ...BASE, children });
const direccion = (over: Record<string, unknown> = {}) => ({ op: 'I', id_ubigeo: '150101', direccion: 'av lima 100', ...over });
const contacto = (over: Record<string, unknown> = {}) => ({ op: 'I', paterno: 'perez', materno: 'lopez', nombre: 'ana', ...over });
const cuenta = (over: Record<string, unknown> = {}) => ({ op: 'I', id_cuenta: '56', num_cuenta: '1234567890', ...over });

const write = (name: string, children: Record<string, unknown[]>, expect: Outcome): CatalogCase => ({ name: `clientes ${name}`, slug: 'clientes', ctx: WRITER, steps: [{ op: 'create', body: withChildren(children) }], expect });

export const CLIENTE_GRID_CASES: CatalogCase[] = [
  // S-MST-22 the Direccion dialog: the server sees the distrito, the zona and the direccion, in that order (the departamento and provincia are client-only levels).
  write('S-MST-22 a direccion with no distrito says Debes Seleccionar un Distrito.', { direcciones: [direccion({ id_ubigeo: '' })] }, invalid(['direcciones[0].id_ubigeo'], ['Debes Seleccionar un Distrito.'])),
  write('S-MST-22 the distrito comes before the direccion', { direcciones: [direccion({ id_ubigeo: '', direccion: '' })] }, invalid(['direcciones[0].id_ubigeo'], ['Debes Seleccionar un Distrito.'])),
  write('S-MST-22 a blank direccion says Debes Ingresar Direccion.', { direcciones: [direccion({ direccion: '' })] }, invalid(['direcciones[0].direccion'], ['Debes Ingresar Direccion.'])),
  write('S-MST-22 with IS_DIRECCION_CLIENTE true the zona is optional', { direcciones: [direccion()] }, { ok: true }),
  write('S-MST-22 a zona of another distrito is refused on the indexed field', { direcciones: [direccion({ id_zona: '2' })] }, invalid(['direcciones[0].id_zona'])),
  write('S-MST-22 the zona of the distrito is stored', { direcciones: [direccion({ id_zona: '1' })] }, { ok: true }),
  write('R-MST-11 a ubigeo that is not a distrito is refused', { direcciones: [direccion({ id_ubigeo: '15' })] }, invalid(['direcciones[0].id_ubigeo'])),
  write('S-MOCK-42 the second direccion is invalid: the 422 names direcciones[1].direccion and nothing is stored', { direcciones: [direccion(), direccion({ direccion: '' })] }, invalid(['direcciones[1].direccion'], ['Debes Ingresar Direccion.'])),

  // S-MST-23 the Contacto dialog: paterno, materno, nombres, in that order.
  write('S-MST-23 a blank contacto says Ingrese Apellido Paterno', { contactos: [contacto({ paterno: '', materno: '', nombre: '' })] }, invalid(['contactos[0].paterno'], ['Ingrese Apellido Paterno'])),
  write('S-MST-23 then Ingrese Apellido Materno', { contactos: [contacto({ materno: ' ', nombre: '' })] }, invalid(['contactos[0].materno'], ['Ingrese Apellido Materno'])),
  write('S-MST-23 then Ingrese Nombres', { contactos: [contacto({ nombre: '' })] }, invalid(['contactos[0].nombre'], ['Ingrese Nombres'])),
  write('R-MST-11 a contacto is stored uppercase with digits-only phones', { contactos: [contacto({ correo: 'ana@acme.pe', telef: '(01) 555-1234', celular: '9 8765' })] }, { ok: true }),

  // S-MST-23 the Cuenta dialog: banco, then the nombre (OTROS only), then the número.
  write('S-MST-23 a blank cuenta says Seleccione Banco', { cuentas: [cuenta({ id_cuenta: '', num_cuenta: '' })] }, invalid(['cuentas[0].id_cuenta'], ['Seleccione Banco'])),
  write('S-MST-23 with a banco and no número: Ingrese Numero de Cuenta', { cuentas: [cuenta({ num_cuenta: '' })] }, invalid(['cuentas[0].num_cuenta'], ['Ingrese Numero de Cuenta'])),
  write('S-MST-23 with OTROS the nombre is required: Ingrese Nombre de Banco', { cuentas: [cuenta({ id_cuenta: '58', descripcion: '' })] }, invalid(['cuentas[0].descripcion'], ['Ingrese Nombre de Banco'])),
  write('S-MST-23 with OTROS, a nombre and a número the cuenta is stored', { cuentas: [cuenta({ id_cuenta: '58', descripcion: 'caja rural sur' })] }, { ok: true }),
  write('R-MST-11 a banco outside tabla 3 is refused (D21)', { cuentas: [cuenta({ id_cuenta: '1' })] }, invalid(['cuentas[0].id_cuenta'])),
  write('R-MST-11 a retired banco is refused', { cuentas: [cuenta({ id_cuenta: '59' })] }, invalid(['cuentas[0].id_cuenta'])),
  { name: 'clientes R-MST-11 the banco options are the active detalles of tabla 3', slug: 'tablas-detalle-sunat', steps: [{ op: 'options', filters: { id_tabla_sunat: '3' } }], expect: { ok: true, items: [{ id: '56', name: 'BANCO DE CREDITO DEL PERU' }, { id: '57', name: 'INTERBANK' }, { id: '58', name: 'OTROS' }] } },

  // S-MD-6 / S-MOCK-41 the persisted rows are deactivated, never removed.
  { name: 'clientes S-MD-6 deactivating a persisted direccion keeps both active and deactivated rows', slug: 'clientes', ctx: WRITER, steps: [{ op: 'update', id: '0000000001', body: { children: { direcciones: [{ op: 'A', id: '1', estado: 'D' }] } } }], expect: { ok: true } },
  { name: 'clientes S-MOCK-42 a valid parent with valid children is created', slug: 'clientes', ctx: WRITER, steps: [{ op: 'create', body: withChildren({ direcciones: [direccion()], contactos: [contacto()], cuentas: [cuenta()] }) }], expect: { ok: true, match: { id_cliente: '0000000005' } } },
];
