import { referenceCatalog } from './reference.js';

/**
 * Tipo de Movimiento de Inventario (`RegisterTipoMovInventario`, R-REF-6, S-REF-23). The form starts on tipo E and loads the clasificaciones of
 * the tipo (`loadClasificacion(tipo)`), selecting the first (`setSelectedIndex(0)`); a tipo change reloads them. The Tabla Sunat combo lists every
 * tabla and starts on its placeholder, the Codigo Sunat combo is disabled and empty until a tabla is chosen and follows it; both are optional
 * (`getSelectedIndex() > 0 ? ... : 0`). `isRegisterValid` only checks the descripcion and then the abreviatura; the rest is always filled by the
 * combos, so the server order starts with them. `manTipoMovInventario` passes the user and no empresa and `listar(t)` takes none (`PanelTFTipoMovInventario`):
 * tenant scope, user stamp. Every write sends estado `A` (`setEstado("A")`), so it is a constant written on create. The ids are the three-digit
 * `TipoMovInventarioEnum` codes. The Hab Ingreso checkbox is stored as S/N (`HabNi`), unchecked by default.
 */
export const tiposMovInventario = referenceCatalog({
  slug: 'tipos-mov-inventario', idKey: 'id_tipo_mov', codeWidth: 3, entity: 'un Tipo de Movimiento de Inventario', formId: 'miTipoMovInventario', title: 'Tipo de Movimiento de Inventario',
  descripcion: false,
  fields: [
    // The desktop combo shows the bare letters E and S.
    { name: 'tipo', kind: 'options', label: 'Tipo', required: true, display: 'select', options: [{ value: 'E', label: 'E' }, { value: 'S', label: 'S' }], default: 'E' },
    { name: 'id_clasif_inventario', kind: 'select', label: 'Clasificacion', required: true, source: { catalog: 'clasif-inventarios' }, dependsOn: [{ field: 'tipo', filterKey: 'tipo' }], defaultOption: 'first' },
    { name: 'descripcion', preset: 'descripcion', normalize: ['upper'] },
    { name: 'abrev', kind: 'text', label: 'Abreviatura', required: true, max: 100, normalize: ['upper'] },
    { name: 'id_tabla_sunat', kind: 'select', label: 'Tabla Sunat', source: { catalog: 'tablas-sunat' } },
    { name: 'id_detalle_sunat', kind: 'select', label: 'Codigo Sunat', source: { catalog: 'tablas-detalle-sunat' }, dependsOn: [{ field: 'id_tabla_sunat', filterKey: 'id_tabla_sunat' }] },
    { name: 'hab_ingreso', kind: 'boolean', label: 'Hab Ingreso', default: false },
  ],
  columns: [
    { key: 'tipo_label', header: 'Tipo de Mov' }, { key: 'clasif_inventario', header: 'Clasif Mov' }, { key: 'clasif_abrev', header: 'Clasif Abrev' },
    { key: 'descripcion', header: 'Descripción' }, { key: 'abrev', header: 'Abrev' }, { key: 'hab_ingreso', header: 'Hab Ni', type: 'bool' },
  ],
  joins: [
    { as: 'clasif_inventario', ref: 'id_clasif_inventario', display: 'descripcion' },
    { as: 'clasif_abrev', ref: 'id_clasif_inventario', display: 'abrev' },
  ],
  validation: ['descripcion', 'abrev', 'tipo', 'id_clasif_inventario', 'id_tabla_sunat', 'id_detalle_sunat', 'hab_ingreso'],
  constants: { estado: 'A' },
});
