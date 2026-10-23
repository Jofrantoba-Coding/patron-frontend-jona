import { referenceCatalog } from './reference.js';

const TICKET = { field: 'id_tipo_doc', in: ['TI'] };

/**
 * The two ticket fields (`TipoDocVentaEnum.TICKET`): visible and required only for the tipo TI, stored as an empty string otherwise
 * (`getNumeroAutorizacion` / `getCodigoMaquina`). The desktop checks them last (`isValidTicket`), so they sit after the unique key.
 * @param {string} name @param {string} label @param {string} phrase the desktop wording after "su"
 */
const ticket = (name, label, phrase) => ({
  name, kind: 'text', label, max: 50, normalize: ['upper'], msgLabel: `su ${phrase}`, visibleWhen: TICKET, requiredWhen: TICKET,
});

/**
 * Correlativo (`RegisterCorrelativo`, R-REF-6, R-REF-8, R-REF-9). Checked in the desktop order: tipo de documento, serie, correlativo, estado,
 * localidad, punto de venta, then the (punto de venta, tipo, serie) duplicate, then the ticket fields, so the ticket fields are only reported by
 * the server, after a passing unique (D10, S-REG-17). `mantCorrelativo(bean, usuario.getId_usuario(), op)` passes the user and no empresa and
 * `PanelTFCorrelativo.cargarTabla` lists everything (`listar("", "", "")`): tenant scope, user stamp. The localidad combo lists those of the
 * session empresa. The id pads to five (PanelTFCorrelativo `"00000" + code`), the serie to four (`DIG_SERIE`) and the correlativo to ten.
 * `getNumInicial`, `getNumFinal` and `getCondicionPago` are constants and `linea_impresion` is 12 when Se imprime is Sí, 0 otherwise.
 * [DEVIATION] the desktop skips the duplicate check on CLONE; the web port applies it (the generic create does).
 */
export const correlativos = referenceCatalog({
  slug: 'correlativos', idKey: 'id_correlativo', codeWidth: 5, entity: 'un Correlativo', formId: 'PanelTFCorrelativo', title: 'Correlativo', descripcion: false,
  // The Serie select of a UsuarioCorrelativo shows each correlativo by its serie (`loadCorrelativo`).
  optionLabel: 'serie',
  fields: [
    { name: 'id_tipo_doc', kind: 'select', label: 'Tipo de Documento', required: true, source: { catalog: 'tipos-doc-venta' } },
    { name: 'serie', kind: 'text', label: 'Serie', required: true, max: 4, normalize: ['upper', 'padLeft:4'] },
    { name: 'correlativo', kind: 'number', label: 'Correlativo', required: true, scale: 0, max: 10, normalize: ['padLeft:10'] },
    { name: 'estado', kind: 'options', label: 'Estado', required: true, display: 'radio', options: [{ value: 'A', label: 'Activo' }, { value: 'I', label: 'Inactivo' }], default: 'A' },
    // RegisterCorrelativo.loadLocalidad(usuario.getCodempresa()): the localidades of the session empresa; the punto de venta follows the localidad.
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, msgLabel: 'la Localidad', source: { catalog: 'localidades', where: { id_empresa: '$session.empresa' } } },
    { name: 'id_punto_venta', kind: 'select', label: 'Punto de Venta', required: true, source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    ticket('nro_autorizacion', 'Nro Autorizacion', 'Numero de Autorizacion'),
    ticket('codigo_maquina', 'Codigo Maquina', 'Codigo de Maquina'),
    { name: 'imprime', kind: 'options', label: 'Se imprime', display: 'radio', options: [{ value: 'S', label: 'Sí' }, { value: 'N', label: 'No' }], default: 'S' },
  ],
  columns: [
    { key: 'localidad', header: 'Localidad' }, { key: 'punto_venta', header: 'P Venta' }, { key: 'tipo_documento', header: 'T Doc' },
    { key: 'serie', header: 'Serie' }, { key: 'correlativo', header: 'Correlativo' }, { key: 'estado_label', header: 'Est' },
  ],
  joins: [
    { as: 'tipo_documento', ref: 'id_tipo_doc', display: 'descripcion' },
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
  ],
  unique: [{
    fields: ['id_punto_venta', 'id_tipo_doc', 'serie'], errorField: 'serie',
    message: 'Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.',
  }],
  validation: ['id_tipo_doc', 'serie', 'correlativo', 'estado', 'id_localidad', 'id_punto_venta', { unique: 0 }, 'nro_autorizacion', 'codigo_maquina'],
  constants: { num_inicial: '0000000001', num_final: '9999999999', flag_cond_pago: 'N' },
  derive: [{ target: 'linea_impresion', when: { field: 'imprime', in: ['S'] }, then: 12, else: 0 }],
});
