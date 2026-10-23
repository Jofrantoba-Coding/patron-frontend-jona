import { referenceCatalog } from './reference.js';

/**
 * Ubicación (`RegisterUbicacion`, R-REF-6, S-REF-30). The desktop loads every active localidad (`LoadCombo.loadLocalidad`), the puntos de venta of the
 * chosen one and the almacenes of the chosen punto de venta in the session empresa (`loadAlmacen(.., usuario)` passes `usuario.getCodempresa()`), and
 * only the almacen and the descripcion are written (`insertUbicacion(descripcion, idAlmacen)`): no user and no empresa, and the list takes none either
 * (`listarUbicacion(0, "")`), so the entry is tenant scope with no stamp. The messages are plain literals without the `Para {modo}` sentence
 * (`JOptionPane.showMessageDialog(this, "Seleccione Localidad")`), checked in the order localidad, punto de venta, almacen, descripcion. The id is an
 * int bean (`Util.getNumberInteger`), so it prints unpadded; the descripcion is `UpperCaseNumberDocument(50)`. The form title is "Ubicación".
 */
export const ubicaciones = referenceCatalog({
  slug: 'ubicaciones', idKey: 'id_ubicacion', codeWidth: 0, entity: 'una Ubicación', formId: 'PnlUbicacion', title: 'Ubicación', stamp: [],
  // The form asks for the chain first, so the descripcion is declared after it instead of using the helper's first-position one.
  descripcion: false,
  fields: [
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, message: 'Seleccione Localidad', source: { catalog: 'localidades' } },
    { name: 'id_punto_venta', kind: 'select', label: 'Punto de Venta', required: true, message: 'Seleccione Punto de Venta', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    { name: 'id_almacen', kind: 'select', label: 'Almacen', required: true, message: 'Seleccione Almacen', source: { catalog: 'almacenes' }, dependsOn: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }] },
    { name: 'descripcion', preset: 'descripcion', normalize: ['upper'], max: 50, message: 'Ingrese Descripcion' },
  ],
  columns: [
    { key: 'descripcion', header: 'Ubicación' }, { key: 'almacen', header: 'Almacen' }, { key: 'punto_venta', header: 'Punto Venta' }, { key: 'localidad', header: 'Localidad' },
  ],
  joins: [
    { as: 'almacen', ref: 'id_almacen', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
  ],
  validation: ['id_localidad', 'id_punto_venta', 'id_almacen', 'descripcion'],
});
