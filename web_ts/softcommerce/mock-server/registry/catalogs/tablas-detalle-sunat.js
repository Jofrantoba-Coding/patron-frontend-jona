/**
 * Detalle de Tabla SUNAT (`DaoTablaDetalleSunat.listarDetalleSunat(id_tabla)`, R-REF-11): the read-only rows behind the Codigo Sunat select, listed
 * for one tabla (`?id_tabla_sunat=`, an exact match). The desktop shows the description and keeps the int id (`TablaDetalleSunat.idDetalleSunat`) as
 * the value; `numero` is the SUNAT code itself. Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const tablasDetalleSunat = {
  slug: 'tablas-detalle-sunat',
  idKey: 'id_detalle_sunat',
  codeWidth: 0,
  entity: 'un Detalle de Tabla Sunat',
  scope: 'shared',
  seed: 'tablas-detalle-sunat',
  readOnly: true,
  messages: { style: 'M1' },
  fields: [
    { name: 'id_detalle_sunat', kind: 'code', label: 'Código' },
    { name: 'id_tabla_sunat', kind: 'select', label: 'Tabla Sunat', required: true, source: { catalog: 'tablas-sunat' } },
    { name: 'numero', kind: 'text', label: 'Número', required: true, max: 20 },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 200 },
  ],
  columns: [{ key: 'tabla_sunat', header: 'Tabla' }, { key: 'numero', header: 'Número' }, { key: 'descripcion', header: 'Descripción' }],
  joins: [{ as: 'tabla_sunat', ref: 'id_tabla_sunat', display: 'nombre' }],
};
