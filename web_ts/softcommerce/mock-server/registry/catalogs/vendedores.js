import { presets, TIPO_ANEXO } from '../presets.js';
import { referenceCatalog } from './reference.js';

const anexo = presets.anexo({ entity: 'Vendedor', tipoAnexo: TIPO_ANEXO.vendedor });

/**
 * Vendedor, the anexo master built from a trabajador (`PanelTFVendedorNuevo` / `RegisterVendedor`, R-MST-9, S-MST-18, S-MST-19). `Cargar Trabajador` (`Buscar`)
 * opens `PanelCargarTrabajador`, a `lookup` over the `panelCargarTrabajador` picker whose pick fills `Nombres`, `Dirección`, `Numero`, `Telefono Fijo`, `Telefono Movil`
 * (`setValueSearch`) and the code itself (`Codigo Trab.`): the five copies are the `fill` of the field, and `Nombres`, `Dirección` and `Numero` are never typed
 * (`fillReadOnly`: the desktop disables them once loaded, and `Nombres` has no editor at all). `loadRegister` disables the picker in every mode but INSERT.
 * `isRegisterValid` checks only that `Nombres` is filled: `Debe elegir un trabajdor` (the desktop spelling).
 * `llenarVendedor` sends the session user and no empresa (tenant scope, user stamp), `Credito` / `Contado` as S / N (booleans here), and the tipo anexo is `"8"`
 * (`newRegister`); the code pads to ten (`PanelTFVendedorNuevo.focusLost`). The estado is derived from the activation history (R-ACT-5). `executeDelete` calls
 * `RnAnexo.eliminar`, so DELETE exists (it removes the activations with the vendedor, R-MD-7); no CLONE (R-MST-1).
 * [DEVIATION] the desktop hardcodes the tipo `01` on save and drops the last tipo of the combo (`size() - 1`): the selected tipo is stored and the combo lists every
 * persona tipo; the `Comentario` textarea the desktop shows and never saves is stored; the picker with no selection does not throw (S-LKP-7).
 */
export const vendedores = referenceCatalog({
  slug: 'vendedores', idKey: 'id_vendedor', codeWidth: anexo.codeWidth, entity: 'un Vendedor', formId: 'miVendedor', title: 'Vendedor', descripcion: false,
  fields: [
    {
      name: 'id_trabajador', kind: 'lookup', picker: 'panelCargarTrabajador', label: 'Codigo Trab.', readOnlyOn: ['UPDATE'], display: 'trabajador',
      fill: { nombres: 'nombre', direccion: 'direccion', numero_doc: 'dni', telefono: 'telefono', celular: 'celular' }, fillReadOnly: ['nombres', 'direccion', 'numero_doc'],
    },
    { name: 'nombres', kind: 'text', label: 'Nombres', required: true, message: 'Debe elegir un trabajdor', max: 180, normalize: ['upper'] },
    { name: 'direccion', kind: 'text', label: 'Dirección', max: 280, normalize: ['upper'] },
    {
      name: 'id_tipo_doc_iden', kind: 'select', label: 'Tipo de Documento', required: true, message: 'Para {modo} un Vendedor, debes Seleccionar un Tipo de Documento.',
      default: { INSERT: '01' }, source: { catalog: 'tipos-doc-iden', where: { persona: true, estado: true } },
    },
    // `IntegerDocument(8)` for a DNI, `IntegerDocument(11)` for a RUC; the desktop checks no minimum.
    { name: 'numero_doc', kind: 'text', label: 'Numero', max: 11, normalize: ['digits'], maxWhen: [{ when: { field: 'id_tipo_doc_iden', in: ['01'] }, len: 8 }] },
    { name: 'telefono', kind: 'text', label: 'Telefono Fijo', max: 15, normalize: ['digits'] },
    { name: 'celular', kind: 'text', label: 'Telefono Movil', max: 15, normalize: ['digits'] },
    {
      name: 'id_nacionalidad', kind: 'select', label: 'Nacionalidad', required: true, message: 'Para {modo} un Vendedor, debes Seleccionar una Nacionalidad.',
      default: { INSERT: '001' }, source: { catalog: 'nacionalidades' },
    },
    { name: 'credito', kind: 'boolean', label: 'Credito', default: false },
    { name: 'contado', kind: 'boolean', label: 'Contado', default: true },
    { name: 'comentario', kind: 'textarea', label: 'Comentario', max: 500 },
    { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] },
  ],
  columns: [
    { key: 'nombres', header: 'Nombres' }, { key: 'numero_doc', header: 'DNI' }, { key: 'direccion', header: 'Dirección' }, { key: 'telefono', header: 'Teléfono' },
    { key: 'credito', header: 'Crédito', type: 'bool' }, { key: 'contado', header: 'Contado', type: 'bool' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [{ as: 'nacionalidad', ref: 'id_nacionalidad', display: 'descripcion' }],
  modes: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL'],
  rules: anexo.rules,
  validation: ['nombres', 'id_trabajador', 'id_tipo_doc_iden', 'numero_doc', 'id_nacionalidad', 'direccion', 'telefono', 'celular', 'credito', 'contado', 'comentario'],
  constants: anexo.constants,
  children: anexo.children,
  actions: anexo.actions,
});
