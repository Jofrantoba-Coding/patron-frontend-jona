/**
 * Reusable field presets, merged under the field that names them
 * (`{ name: 'estado', kind: 'boolean', preset: 'estado' }`). Wave 2 adds each
 * preset with the first catalog that needs it (`descripcion` in W2-2).
 * @type {Record<string, Record<string, any>>}
 */
export const PRESETS = {
  // `descripcion` of the reference catalogs; the desktop message says "su Descripcion" (no accent).
  descripcion: { kind: 'text', label: 'Descripción', required: true, max: 100, msgLabel: 'su Descripcion' },
  // R-REF-3: INSERT is true and read-only; UPDATE is editable; CLONE copies the source value read-only (D15).
  estado: { kind: 'boolean', label: 'Activo', default: { INSERT: true }, readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE'] },
};

/** @param {Record<string, any>} field */
export function applyPreset(field) {
  if (field.preset === undefined) return field;
  if (!Object.hasOwn(PRESETS, field.preset)) throw new Error(`field "${field.name}": unknown preset "${field.preset}"`);
  return { ...PRESETS[field.preset], ...field };
}

/**
 * Tipo anexo of each anexo master (R-ANX-9, D13): the hidden constant the stored procedure files the master under. Banco is `"3"` (`PanelTFBanco.cargarTabla`
 * lists `listAnexo("3", ...)`); the others come with their master. The Trabajador id is not in the repository (`mantTrabajador` passes no tipo anexo and `PanelTFTrabajador` lists `listarTrabajador`, not `listAnexo`): `'9'` is a placeholder (the free id after Vendedor `8`) `[INFERRED]`.
 */
export const TIPO_ANEXO = { banco: '3', transportista: '6', chofer: '7', vendedor: '8', trabajador: '9' };

const MOTIVO_REQUERIDO = 'Ingrese Motivo';
const ACCIONES = [
  // The dialogs of `FormAnexoActivacion`: one fecha (Fecha Inicio for Activar, Fecha Fin for Desactivar) and the motivo (uppercase, 100).
  { id: 'activar', rule: 'activarAnexo', server: 'activarAnexo', fecha: ['f_inicio', 'Fecha Inicio'], motivo: ['motivo_activacion', 'Motivo de Activacion'] },
  { id: 'desactivar', rule: 'desactivarAnexo', server: 'desactivarAnexo', fecha: ['f_fin', 'Fecha Fin'], motivo: ['motivo_desactivacion', 'Motivo de Desactivacion'] },
];
/** @param {string} id */
const label = (id) => id[0].toUpperCase() + id.slice(1);

/**
 * The anexo preset (D13): the pieces every anexo master shares, to be spread into its entry. `activaciones` is the history child (R-ANX-1: no Quitar, no
 * Agregar, the `INICIO` row the server creates, the desktop columns) with the deferred Activar and Desactivar; `actions` are the API-only entry actions the
 * endpoints of S-MOCK-47..49 run; `rules` names the `activacion` rule (one active row, `estado` derived and owned by it); `codeWidth` 10 and the tipo anexo
 * constant (R-ANX-9). The padron pieces come with the first master that needs them (W3-15).
 * @param {{ entity: string, tipoAnexo: string }} options `entity` is the word of the messages and dialogs (`Banco`)
 */
function anexo({ entity, tipoAnexo }) {
  const dialog = (/** @type {{ id: string, fecha: string[], motivo: string[] }} */ { id, fecha, motivo }) => ({
    title: `${label(id)} ${entity}`,
    fields: [
      { name: fecha[0], kind: 'date', label: fecha[1], required: true, default: 'today' },
      { name: motivo[0], kind: 'text', label: motivo[1], required: true, max: 100, normalize: ['upper'], message: MOTIVO_REQUERIDO },
    ],
  });
  return {
    codeWidth: 10,
    constants: { id_tipo_anexo: tipoAnexo },
    rules: [{ name: 'activacion', params: { entity, child: 'activaciones' } }],
    // Activar / Desactivar stay enabled in UPDATE: the guard says why it cannot go on (S-ANX-2, S-ANX-4), as the desktop does.
    actions: ACCIONES.map(({ id, server }) => ({ id, label: label(id), kind: 'immediate', server, placement: 'api' })),
    children: {
      activaciones: {
        tab: `Activación de ${entity}`, removal: 'none', entry: 'none', initial: { motivo_activacion: 'INICIO' },
        fields: [
          { name: 'f_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today' },
          { name: 'f_fin', kind: 'date', label: 'Fecha Fin' },
          // The server asks for the motivo of an activation a body inserts; the INICIO row it creates itself is not validated (R-MD-9).
          { name: 'motivo_activacion', kind: 'text', label: 'Motivo de Activacion', required: true, max: 100, normalize: ['upper'], message: MOTIVO_REQUERIDO },
          { name: 'motivo_desactivacion', kind: 'text', label: 'Motivo de Desactivacion', max: 100, normalize: ['upper'] },
        ],
        columns: [
          { key: 'motivo_activacion', header: 'MOTIVO_ACTIVACION' },
          { key: 'f_inicio', header: 'FECHA_ACTIVACION', type: 'date' },
          { key: 'motivo_desactivacion', header: 'MOTIVO_DESACTIVACION' },
          { key: 'f_fin', header: 'FECHA_DESACTIVACION', type: 'date' },
        ],
        actions: ACCIONES.map((accion) => ({ id: accion.id, label: label(accion.id), kind: 'deferred', rule: accion.rule, params: { entity }, enabledWhen: { modes: ['UPDATE'] }, dialog: dialog(accion) })),
      },
    },
  };
}

/** The master flag each padron id sets (R-ANX-8) and its label: the desktop checkboxes of `RegisterProveedorNuevo` say `A Percepcion`, `A Retencion`, `Buen Contribuyente`. */
const PADRON_FLAGS = { '01': ['flag_exceptuado', 'Exceptuado'], '02': ['flag_retencion', 'A Retencion'], '03': ['flag_percepcion', 'A Percepcion'], '04': ['flag_buen_contrib', 'Buen Contribuyente'] };
/** What each master offers (`FormAnexoPadron.loadPadron` removes the 4th entry for Cliente and the 1st for Proveedor): the `padrones` column it filters on and the flags in form order. */
const PADRON_OFERTA = { proveedor: { where: 'para_proveedor', ids: ['03', '02', '04'] }, cliente: { where: 'para_cliente', ids: ['01', '02', '03'] } };
const PADRON_MODES = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];

/**
 * The padron preset (R-ANX-7, R-ANX-8, W3-15): the pieces Cliente and Proveedor share, spread into the entry beside the anexo preset. `fields` are the read-only master
 * flags the rule derives from the active rows; `rules` names the `padron` rule (it owns the flags and runs the incompatibility checks); `children.padrones` is the grid
 * (`ESTADO`, `PADRON`, `F_INICIO`, `F_FIN`; no Agregar, no Quitar) with the deferred Activar (`Agregar Padron`: the select of the padrones the master offers and the start date)
 * and Desactivar (`Desea Desactivar Padron?`).
 * @param {{ master: 'proveedor' | 'cliente' }} options
 */
function padron({ master }) {
  const { where, ids } = PADRON_OFERTA[master];
  const flags = Object.fromEntries(ids.map((id) => [id, PADRON_FLAGS[/** @type {keyof typeof PADRON_FLAGS} */ (id)][0]]));
  const select = { name: 'id_padron', kind: 'select', label: 'Padron', required: true, message: 'Seleccione Padron', source: { catalog: 'padrones', where: { [where]: true } } };
  return {
    fields: ids.map((id) => ({ name: flags[id], kind: 'boolean', label: PADRON_FLAGS[/** @type {keyof typeof PADRON_FLAGS} */ (id)][1], readOnlyOn: PADRON_MODES })),
    rules: [{ name: 'padron', params: { child: 'padrones', flags } }],
    children: {
      padrones: {
        tab: 'Padrones', removal: 'none', entry: 'none',
        fields: [select, { name: 'f_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today' }, { name: 'f_fin', kind: 'date', label: 'Fecha Fin' }],
        columns: [{ key: 'padron', header: 'PADRON' }, { key: 'f_inicio', header: 'F_INICIO', type: 'date' }, { key: 'f_fin', header: 'F_FIN', type: 'date' }],
        actions: [
          {
            id: 'activar', label: 'Activar', kind: 'deferred', rule: 'activarPadron', enabledWhen: { modes: ['INSERT', 'UPDATE'] },
            dialog: { title: 'Agregar Padron', fields: [select, { name: 'f_inicio', kind: 'date', label: 'Fecha Inicio', required: true, default: 'today' }] },
          },
          { id: 'desactivar', label: 'Desactivar', kind: 'deferred', rule: 'desactivarPadron', confirm: 'Desea Desactivar Padron?', enabledWhen: { modes: ['INSERT', 'UPDATE'] } },
        ],
      },
    },
  };
}

/** Whole-entry presets, merged by the entry that names them (the field presets above are merged under a field). */
export const presets = { anexo, padron };
