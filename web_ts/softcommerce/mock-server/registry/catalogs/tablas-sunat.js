/**
 * Tabla SUNAT (`DaoTablaDetalleSunat.listarTablaSunat`, R-REF-11): the read-only list behind the Tabla Sunat select of a Tipo de Movimiento de
 * Inventario and of a Unidad de Medida. The desktop shows `nombre - descripcion` and keeps the int id (`TablaSunat.id_tabla_sunat`) as the value, so
 * the option label joins both fields and the server never issues the id. The Unidad de Medida starts on the 6th row (`setSelectedIndex(6)` over the
 * placeholder, `loadTablaSunat`): a seed spec asserts that row. Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const tablasSunat = {
  slug: 'tablas-sunat',
  idKey: 'id_tabla_sunat',
  codeWidth: 0,
  entity: 'una Tabla Sunat',
  scope: 'shared',
  seed: 'tablas-sunat',
  readOnly: true,
  optionLabel: ['nombre', 'descripcion'],
  messages: { style: 'M1' },
  fields: [
    { name: 'id_tabla_sunat', kind: 'code', label: 'Código' },
    { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 100 },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 200 },
  ],
  columns: [{ key: 'id_tabla_sunat', header: 'Código' }, { key: 'nombre', header: 'Nombre' }, { key: 'descripcion', header: 'Descripción' }],
};
