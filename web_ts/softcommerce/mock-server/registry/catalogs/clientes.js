import { presets, TIPO_ANEXO } from '../presets.js';
import { anexoIdentity } from './anexo-identidad.js';
import { referenceCatalog } from './reference.js';

/**
 * Cliente, the anexo master (`RegisterClienteNuevo` / `PanelTFClienteNuevo`, R-MST-1, R-MST-2, R-MST-10, R-ANX-1..5). The person block of R-MST-2 (entity `un Cliente`; the
 * form opens with no tipo de documento and PERUANA: `newRegister`) plus the `Tipo Cliente` select and the activation history with its Activar and Desactivar. `isRegisterValid`
 * checks the tipo de documento, the DNI / RUC steps, the razon social, then the tipo de cliente (skipped when the tipo de documento is `OTROS`), then the nacionalidad.
 * `mantCliente` passes the session user and no empresa (tenant scope, user stamp: `cs.setString(23, idUsuario)`); the tipo anexo `"2"` and the code width 10 are [INFERRED]
 * as the Proveedor's (`PanelTFClienteNuevo` pads nothing and `mantCliente` passes no tipo anexo; `FormAnexoPadron(..., 2, ...)` is the only evidence). `executeDelete`
 * returns false and the panel has no clone or detail handler: the modes are INSERT and UPDATE. The estado is derived from the last activation (R-ACT-5, the `activacion` rule
 * owns it); the desktop disables its checkbox, the web port shows it read-only. [DEVIATION] the desktop selects the first tipo de cliente when it loads the combo
 * (`setSelectedIndex(1)`), the web register opens on `--- Seleccione ---` so the sentence stays reachable (R-MST-10). The condición de pago is gated by `IS_CLIENTE_CONDICION_PAGO`
 * (R-REG-17). The padron flags, the sustitutos, the credit tabs and
 * the padrones are W3-17. The grids Direcciones, Contactos and Cuentas are W3-16b (`RegisterClienteNuevo` `quitarDireccion`, `quitarContacto`, `quitarCuenta`).
 */
const anexo = presets.anexo({ entity: 'Cliente', tipoAnexo: TIPO_ANEXO.cliente });
const identity = anexoIdentity('un Cliente');

// `isRegisterValid` skips the tipo de cliente when the selected tipo de documento is `OTROS`. No seeded tipo is OTROS [INFERRED], so the condition lists the ids the tipo
// select offers (persona and estado: DNI, CE, RUC); the id of OTROS arrives with the W6 catalog and stays out of this list.
const TIPOS_CON_CLASIF = ['01', '04', '05'];
const tipoCliente = {
  name: 'id_clasif_cliente', kind: 'select', label: 'Tipo Cliente', requiredWhen: { field: 'id_tipo_doc_iden', in: TIPOS_CON_CLASIF },
  message: 'Para {modo} un Cliente, debes Seleccionar un Tipo de Cliente.', source: { catalog: 'clasif-clientes', where: { estado: true } },
};
// R-MST-10: with `IS_CLIENTE_CONDICION_PAGO` on the General tab adds the condición (the combo `CondicionPagoEnum`: the blank item, then CONTADO and CREDITO; the desktop also lists
// OPERACION_BANCARIA and TARJETA but `saveCondicionPagoCliente` only files CONTADO and CREDITO, so the web offers those two [DEVIATION]) and the días (`IntegerDocument(3)`, enabled
// only for CREDITO, reset to 0 on every change of the condición, `Ingrese numero de Dias` when blank: checked last). The label of the días is `Numero de dias` (the desktop label says
// `Condicion Pago` twice). `saveCondicionPagoCliente` files the flags `S` / `N` and the días on the anexo row, which the web stores beside the condición.
const GATE = { param: 'IS_CLIENTE_CONDICION_PAGO' };
const condicion = [
  {
    name: 'condicion_pago', kind: 'options', label: 'Condicion Pago', gate: GATE, clearsOnChange: ['numero_dias'],
    options: [{ value: 'CONTADO', label: 'CONTADO' }, { value: 'CREDITO', label: 'CREDITO' }],
  },
  {
    name: 'numero_dias', kind: 'number', label: 'Numero de dias', gate: GATE, scale: 0, max: 3, normalize: ['digits'], default: '0', required: true, message: 'Ingrese numero de Dias',
    enabledWhen: { field: 'condicion_pago', in: ['CREDITO'] },
  },
];
const derive = [
  { target: 'flag_contado', when: { field: 'condicion_pago', in: ['CONTADO'] }, then: 'S', else: 'N' },
  { target: 'flag_credito', when: { field: 'condicion_pago', in: ['CREDITO'] }, then: 'S', else: 'N' },
];

// The desktop General tab shows the tipo de cliente before the nacionalidad.
const fields = identity.fields.flatMap((f) => (f.name === 'id_nacionalidad' ? [tipoCliente, f] : [f]));
const validation = identity.validation.flatMap((step) => (step === 'id_nacionalidad' ? ['id_clasif_cliente', step] : [step]));

// R-MST-11 the Direcciones child (`FormClienteDireccion`). `loadUbigeo(..., !IS_DIRECCION_CLIENTE)` lists every ubigeo while the parameter is true and only the ubigeos with an active
// zona while it is false, and `validarData` asks for the zona only in that case: both are `byParam` overrides on the cascade leaf (UI) and the zona (UI and server). The sentences are
// the bare ones of the dialog (`Debes Seleccionar un Distrito.`; [DEVIATION] the desktop distrito sentence says `un Almacen`); the departamento and provincia are client-only levels.
const SIN_ZONA = { param: 'IS_DIRECCION_CLIENTE', in: [false] };
const direcciones = {
  tab: 'Direcciones', removal: 'deactivate', entry: 'dialog', messages: { style: 'dialog' },
  quitar: { none: 'Para quitar una direccion primero debe seleccionar la fila.', confirm: 'Desea Quitar Direccion?', already: 'Direccion ya Esta desactivada' },
  fields: [
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required: true, article: 'un', source: { catalog: 'ubigeo' }, byParam: { ...SIN_ZONA, set: { filter: { has: 'zonas' } } } },
    { name: 'id_zona', kind: 'select', label: 'Zona', article: 'una', source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_ubigeo', filterKey: 'id_ubigeo' }], byParam: { ...SIN_ZONA, set: { required: true } } },
    // `UpperCaseDocument()` has no limit; the 280 of the Cliente direccion is [INFERRED].
    { name: 'direccion', kind: 'text', label: 'Direccion', required: true, max: 280, normalize: ['upper'], message: 'Debes Ingresar Direccion.' },
  ],
  validation: ['id_ubigeo', 'id_zona', 'direccion'],
  joins: [{ as: 'distrito', ref: 'id_ubigeo', display: 'name' }, { as: 'zona', ref: 'id_zona', display: 'descripcion' }],
  columns: [{ key: 'distrito', header: 'UBIGEO' }, { key: 'zona', header: 'ZONA' }, { key: 'direccion', header: 'DIRECCION' }],
};

// R-MST-11 the Contactos child (`FormClienteContacto`): the three names are required in that order; the correo has no document (the 100 is [INFERRED]), the phones are `IntegerDocument(15)`.
/** @param {string} name @param {string} label @param {string} message */
const required = (name, label, message) => ({ name, kind: 'text', label, required: true, max: 50, normalize: ['upper'], message });
const contactos = {
  tab: 'Contactos', removal: 'deactivate', entry: 'dialog',
  quitar: { none: 'Seleccione Fila.', confirm: 'Desea Quitar Contacto?', already: 'Contacto ya esta Desactivado' },
  fields: [
    required('paterno', 'Paterno', 'Ingrese Apellido Paterno'), required('materno', 'Materno', 'Ingrese Apellido Materno'), required('nombre', 'Nombres', 'Ingrese Nombres'),
    { name: 'correo', kind: 'text', label: 'Correo', max: 100 },
    { name: 'telef', kind: 'text', label: 'Telef', max: 15, normalize: ['digits'] }, { name: 'celular', kind: 'text', label: 'Celular', max: 15, normalize: ['digits'] },
  ],
  validation: ['paterno', 'materno', 'nombre', 'correo', 'telef', 'celular'],
  columns: [
    { key: 'paterno', header: 'PATERNO' }, { key: 'materno', header: 'MATERNO' }, { key: 'nombre', header: 'NOMBRES' }, { key: 'correo', header: 'CORREO' }, { key: 'telef', header: 'TELEF' }, { key: 'celular', header: 'CELULAR' },
  ],
};

// R-MST-11 the Cuentas child (`FormClienteCuenta`): a BANK account over the detalles of tabla SUNAT 3 (`listarDetalleSunat(3)`, [INFERRED] as the bank table), not a cuenta contable. The
// Nombre is the banco name, read-only, unless the banco is the detalle 58 (OTROS, [INFERRED]), where it starts empty and is typed (`Ingrese Nombre de Banco`); the server stores the name the client sends.
const OTROS = '58';
const cuentas = {
  tab: 'Cuentas', removal: 'deactivate', entry: 'dialog',
  quitar: { none: 'Seleccione Fila.', confirm: 'Desea Quitar Cuenta?', already: 'Cuenta ya esta Desactivada' },
  fields: [
    {
      name: 'id_cuenta', kind: 'select', label: 'Banco', required: true, message: 'Seleccione Banco', source: { catalog: 'tablas-detalle-sunat', where: { id_tabla_sunat: '3' } },
      fillLabel: { target: 'descripcion', unless: [OTROS] },
    },
    { name: 'descripcion', kind: 'text', label: 'Nombre', required: true, max: 100, normalize: ['upper'], message: 'Ingrese Nombre de Banco', enabledWhen: { field: 'id_cuenta', in: [OTROS] } },
    { name: 'num_cuenta', kind: 'text', label: 'Cuenta', required: true, max: 30, message: 'Ingrese Numero de Cuenta' },
  ],
  validation: ['id_cuenta', 'descripcion', 'num_cuenta'],
  columns: [{ key: 'descripcion', header: 'DESC_CUENTA' }, { key: 'num_cuenta', header: 'NUM_CUENTA' }],
};

// R-MST-12 the Sustitutos child (`getPanelSustitutos`, `FormClienteBuscar`, `ClienteSustitutoTableModel`; tab behind IS_CLIENTE_SUSTITUTO). `Agregar` opens the FormClienteBuscar picker (no dialog of its own)
// and a pick adds the row; the grid shows the cliente (RUC/DNI, RAZON SOCIAL, DIRECCION) and its AP / AR / EX flags beside the state. There is no Quitar: `Activar` and `Desactivar` change the
// state (a pending row that is deactivated is removed, a persisted one is closed), so the child is `removal: 'none'` and `reactivable`. A cliente is unique among the active rows
// (`Cliente ya Esta Agregado`); `Cliente esta desactivado` (the cliente of the row was deactivated) is the client check of Activar, read from the joined estado of the cliente.
const SUSTITUTO_DUPLICADO = 'Cliente ya Esta Agregado';
const sustitutos = {
  tab: 'Sustitutos', removal: 'none', entry: 'picker', reactivable: true, gate: { param: 'IS_CLIENTE_SUSTITUTO' },
  pick: {
    picker: 'formClienteBuscar', field: 'id_hijo', message: SUSTITUTO_DUPLICADO,
    copy: { descripcion: 'descripcion', numero_doc: 'numero_doc', direccion: 'direccion', estado_cliente: 'estado', flag_percepcion: 'flag_percepcion', flag_retencion: 'flag_retencion', flag_exceptuado: 'flag_exceptuado' },
  },
  fields: [{ name: 'id_hijo', kind: 'select', label: 'Cliente', required: true, message: 'Seleccione Cliente', source: { catalog: 'clientes' } }],
  unique: [{ fields: ['id_hijo'], errorField: 'id_hijo', message: SUSTITUTO_DUPLICADO }],
  validation: ['id_hijo', { unique: 0 }],
  joins: ['descripcion', 'numero_doc', 'direccion', 'flag_percepcion', 'flag_retencion', 'flag_exceptuado'].map((name) => ({ as: name, ref: 'id_hijo', display: name })).concat([{ as: 'estado_cliente', ref: 'id_hijo', display: 'estado' }]),
  columns: [
    { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'descripcion', header: 'RAZON SOCIAL' }, { key: 'direccion', header: 'DIRECCION' },
    { key: 'flag_percepcion', header: 'AP', type: 'bool' }, { key: 'flag_retencion', header: 'AR', type: 'bool' }, { key: 'flag_exceptuado', header: 'EX', type: 'bool' },
  ],
  actions: [
    { id: 'activar', label: 'Activar', kind: 'deferred', rule: 'activarSustituto', confirm: 'Desea activar Cliente Sustituto?', enabledWhen: { modes: ['INSERT', 'UPDATE'] } },
    { id: 'desactivar', label: 'Desactivar', kind: 'deferred', rule: 'desactivarSustituto', confirm: 'Desea Desactivar Cliente Sustituto?', enabledWhen: { modes: ['INSERT', 'UPDATE'] } },
  ],
};

// R-MST-12 the Credito and Credito Temp children (`getPanelCredito`, `getPanelCreditoTemp`, `FormClienteCredito`; tabs behind IS_CLIENTE_CREDITO). The desktop kept one list with a TEMPORAL flag; the web keeps one
// child per tab. A credit is additive: the dialog (Motivo, Monto, F Inicio and, for the temporal one, F Fin) is its only way in and the desktop wired no Desactivar, so there is no Quitar and no action.
// [DEVIATION] the desktop copied the fecha de INICIO into the fin of a temporal credit (`dc_fechainicio.getDate()` read twice) and validated no dates: the fin is stored as entered and a fin before the inicio
// is refused with `Fecha es menor a fecha inicial` (`afterField`). `validarData` checks the motivo, then the monto (`Ingrese Motivo`, `Ingrese Monto`); the dialog title `Agregar Cuenta` is a copy-paste defect.
const GATE_CREDITO = { param: 'IS_CLIENTE_CREDITO' };
/** @param {string} tab @param {boolean} temporal */
const creditoEntry = (tab, temporal) => ({
  tab, removal: 'none', entry: 'dialog', gate: GATE_CREDITO,
  fields: [
    { name: 'motivo', kind: 'text', label: 'Motivo', required: true, max: 50, normalize: ['upper'], message: 'Ingrese Motivo' },
    { name: 'monto', kind: 'number', label: 'Monto', required: true, scale: 2, message: 'Ingrese Monto' },
    { name: 'f_inicio', kind: 'date', label: 'F Inicio', required: true, default: 'today' },
    ...(temporal ? [{ name: 'f_fin', kind: 'date', label: 'F Fin', required: true, default: 'today', afterField: 'f_inicio', messages: { afterField: 'Fecha es menor a fecha inicial' } }] : []),
  ],
  validation: ['motivo', 'monto', 'f_inicio', ...(temporal ? ['f_fin'] : [])],
  columns: [
    { key: 'motivo', header: 'MOTIVO' }, { key: 'monto', header: 'MONTO', type: 'dec' }, { key: 'f_inicio', header: 'F_INICIO', type: 'date' }, ...(temporal ? [{ key: 'f_fin', header: 'F_FIN', type: 'date' }] : []),
  ],
});
// The totals of the register (`txtCredito`, `txtCreditoTemp`, read-only, 0 by default) are the sums of the montos of each tab (D27a): derived on every read, never written by a body.
const MODES_ALL = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const totales = [
  { name: 'credito', kind: 'number', label: 'Credito', scale: 2, gate: GATE_CREDITO, readOnlyOn: MODES_ALL },
  { name: 'credito_temp', kind: 'number', label: 'Credito Temp', scale: 2, gate: GATE_CREDITO, readOnlyOn: MODES_ALL },
];

export const clientes = referenceCatalog({
  slug: 'clientes', idKey: 'id_cliente', codeWidth: anexo.codeWidth, entity: 'un Cliente', formId: 'miCliente', title: 'Cliente', descripcion: false,
  fields: [...fields, { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: MODES_ALL }, ...condicion, ...totales],
  columns: [
    { key: 'flag_tipo_persona', header: 'T_PERSONA' }, { key: 'descripcion', header: 'RAZON SOCIAL' }, { key: 'ap_paterno', header: 'PATERNO' }, { key: 'ap_materno', header: 'MATERNO' }, { key: 'nombres', header: 'NOMBRES' },
    { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'direccion', header: 'DIRECCION' },
    // CANT_SUST is the aggregate over the sustitutos (D27a), listed with IS_CLIENTE_SUSTITUTO. With IS_CLIENTE_CONDICION_PAGO off the desktop hides the last two columns (`setNoVisibleColumn(15)` and `(16)`).
    { key: 'cant_sust', header: 'CANT_SUST', gate: { param: 'IS_CLIENTE_SUSTITUTO' } },
    { key: 'condicion_pago', header: 'CONDICION PAGO', gate: GATE }, { key: 'numero_dias', header: 'NUMERO DIAS', gate: GATE },
  ],
  joins: identity.joins,
  // The BuscarCliente picker filters by the tipo de cliente, an exact key.
  lookupFilters: { id_clasif_cliente: {} },
  modes: ['INSERT', 'UPDATE'],
  rules: [...identity.rules, ...anexo.rules],
  validation: [...validation, 'condicion_pago', 'numero_dias'],
  derive,
  constants: anexo.constants,
  children: { ...anexo.children, direcciones, sustitutos, creditos: creditoEntry('Credito', false), creditos_temp: creditoEntry('Credito Temp', true), contactos, cuentas },
  aggregate: [
    { as: 'cant_sust', child: 'sustitutos', op: 'count', where: { estado: 'A' } },
    { as: 'credito', child: 'creditos', op: 'sum', field: 'monto' }, { as: 'credito_temp', child: 'creditos_temp', op: 'sum', field: 'monto' },
  ],
  actions: anexo.actions,
});
