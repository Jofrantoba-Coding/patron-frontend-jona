import { referenceCatalog } from './reference.js';

/**
 * Almacen (`RegisterAlmacen`, R-REF-6). The desktop loads the localidades of the session empresa (`loadLocalidad(usuario.getCodempresa())`),
 * then the puntos de venta of the chosen localidad, and checks localidad, punto de venta, descripcion, direccion and the
 * departamento > provincia > distrito cascade in that order, all with the M1 sentence ("debes especificar su ..."). `DAOAlmacen.listar`
 * takes the session empresa (`PanelTFAlmacen`) and `insertar` / `modificar` pass it (`txtCodEmpresa`) with the user, so the empresa
 * scopes the list and every write. Direccionamiento, Despacho and Venta are plain checkboxes that start unchecked. The id is a
 * string with no pad evidence (inferred width 3, flagged for W6).
 */
export const almacenes = referenceCatalog({
  slug: 'almacenes', idKey: 'id_almacen', entity: 'un Almacen', formId: 'mi_almacen', title: 'Almacen', scope: 'empresa', stamp: ['id_usuario'],
  descripcion: false,
  fields: [
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, source: { catalog: 'localidades', where: { id_empresa: '$session.empresa' } } },
    { name: 'id_punto_venta', kind: 'select', label: 'Punto de Venta', required: true, source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    // The desktop spells the descripcion message with its accent.
    { name: 'descripcion', preset: 'descripcion', normalize: ['upper'], msgLabel: 'su Descripción' },
    { name: 'direccion', kind: 'text', label: 'Dirección', required: true, max: 100, normalize: ['upper'] },
    // The departamento > provincia > distrito cascade storing the distrito.
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' } },
    { name: 'direccionamiento', kind: 'boolean', label: 'Direccionamiento Facturación', default: false },
    { name: 'habilita_despacho', kind: 'boolean', label: 'Habilitar Despacho', default: false },
    { name: 'habilita_venta', kind: 'boolean', label: 'Habilitar Venta', default: false },
  ],
  columns: [
    { key: 'localidad', header: 'Localidad' },
    { key: 'punto_venta', header: 'P Venta' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'direccion', header: 'Dirección' },
    { key: 'departamento', header: 'Departamento' },
    { key: 'provincia', header: 'Provincia' },
    { key: 'distrito', header: 'Distrito' },
    { key: 'habilita_despacho', header: 'Despacho', type: 'bool' },
    { key: 'habilita_venta', header: 'Venta', type: 'bool' },
  ],
  joins: [
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
    // INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6.
    { as: 'departamento', ref: 'id_ubigeo', display: 'name', prefixLen: 2 },
    { as: 'provincia', ref: 'id_ubigeo', display: 'name', prefixLen: 4 },
    { as: 'distrito', ref: 'id_ubigeo', display: 'name', prefixLen: 6 },
  ],
});
